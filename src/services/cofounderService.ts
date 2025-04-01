
import { supabase } from '@/integrations/supabase/client';
import { CofounderProfile, MatchNotification, convertDbProfileToApp } from '@/types/cofounders';
import { v4 as uuidv4 } from 'uuid';

interface MatchRequestData {
  recipientId: string;
  message?: string;
}

// Récupérer un profil de cofondateur par ID
export const getCofounderProfileById = async (id: string): Promise<CofounderProfile | null> => {
  const { data, error } = await supabase
    .from('cofounder_profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error('Erreur lors de la récupération du profil:', error);
    return null;
  }

  return convertDbProfileToApp(data);
};

// Envoyer une demande de match
export const sendMatchRequest = async (requestData: MatchRequestData): Promise<boolean> => {
  const { recipientId, message } = requestData;
  
  // Vérifier que l'utilisateur est connecté
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Utilisateur non connecté');
  }

  // Récupérer les informations de l'utilisateur connecté
  const { data: userProfile } = await supabase
    .from('profiles')
    .select('first_name, last_name')
    .eq('id', user.id)
    .single();

  if (!userProfile) {
    throw new Error('Profil utilisateur introuvable');
  }

  const senderName = `${userProfile.first_name} ${userProfile.last_name}`;
  
  // Créer la notification de match
  const { error } = await supabase
    .from('match_notifications')
    .insert({
      id: uuidv4(),
      sender_id: user.id,
      sender_name: senderName,
      recipient_id: recipientId,
      message,
      status: 'pending',
    });

  if (error) {
    console.error('Erreur lors de l\'envoi de la demande:', error);
    throw error;
  }

  // Mettre à jour le tableau de matches dans les profils (optionnel)
  try {
    // On ajoute l'ID du destinataire aux matches de l'expéditeur
    await updateProfileMatches(user.id, recipientId);
  } catch (e) {
    console.warn('Mise à jour des matches non critique échouée:', e);
    // On ne fait pas échouer l'opération principale si cette mise à jour échoue
  }

  return true;
};

// Mettre à jour les matches d'un profil
const updateProfileMatches = async (userId: string, matchId: string): Promise<void> => {
  // Récupérer d'abord le profil et ses matches actuels
  const { data: profile } = await supabase
    .from('cofounder_profiles')
    .select('matches')
    .eq('id', userId)
    .single();

  // Si le profil existe et a déjà des matches
  if (profile && profile.matches) {
    // Vérifier si le match n'existe pas déjà
    if (!profile.matches.includes(matchId)) {
      const updatedMatches = [...profile.matches, matchId];
      
      await supabase
        .from('cofounder_profiles')
        .update({ matches: updatedMatches })
        .eq('id', userId);
    }
  } else {
    // Si le profil n'a pas encore de matches, créer un nouveau tableau
    await supabase
      .from('cofounder_profiles')
      .update({ matches: [matchId] })
      .eq('id', userId);
  }
};

// Récupérer toutes les notifications de match pour un utilisateur
export const getUserMatchNotifications = async (): Promise<MatchNotification[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Utilisateur non connecté');
  }
  
  const { data, error } = await supabase
    .from('match_notifications')
    .select('*')
    .or(`recipient_id.eq.${user.id},sender_id.eq.${user.id}`)
    .order('date_created', { ascending: false });

  if (error) {
    console.error('Erreur lors de la récupération des notifications:', error);
    throw error;
  }

  return data as MatchNotification[];
};

// Mettre à jour le statut d'une notification de match
export const updateMatchNotificationStatus = async (
  notificationId: string,
  status: 'accepted' | 'rejected'
): Promise<boolean> => {
  const { error } = await supabase
    .from('match_notifications')
    .update({ status })
    .eq('id', notificationId);

  if (error) {
    console.error('Erreur lors de la mise à jour de la notification:', error);
    throw error;
  }

  return true;
};
