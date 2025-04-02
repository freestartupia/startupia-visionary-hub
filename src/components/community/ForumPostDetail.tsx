
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ThumbsUp, ArrowLeft, MessageCircle, Eye, Calendar, Send } from 'lucide-react';
import { ForumPost, ForumReply } from '@/types/community';
import { getForumPost, addReplyToPost, togglePostLike, toggleReplyLike, incrementPostViews } from '@/services/forumService';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const ForumPostDetail = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<ForumPost | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [replyContent, setReplyContent] = useState<string>('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;
      
      try {
        setIsLoading(true);
        const fetchedPost = await getForumPost(postId);
        setPost(fetchedPost);
        // Incrémenter le compteur de vues
        incrementPostViews(postId);
      } catch (error) {
        console.error('Erreur lors du chargement du post:', error);
        toast.error('Impossible de charger la discussion');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPost();
  }, [postId]);
  
  const handleGoBack = () => {
    navigate('/community');
  };
  
  const handleSubmitReply = async () => {
    if (!user || !post) {
      toast.error('Vous devez être connecté pour répondre');
      navigate('/auth');
      return;
    }
    
    if (!replyContent.trim()) {
      toast.error('Le contenu de la réponse ne peut pas être vide');
      return;
    }
    
    try {
      const userName = `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim() || user.email || 'Utilisateur';
      const avatarUrl = user.user_metadata?.avatar_url;
      
      const newReply = await addReplyToPost(
        post.id,
        replyContent,
        userName,
        avatarUrl,
        replyingTo
      );
      
      // Rafraîchir les données du post
      const updatedPost = await getForumPost(post.id);
      setPost(updatedPost);
      
      // Réinitialiser le formulaire
      setReplyContent('');
      setReplyingTo(null);
      
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la réponse:', error);
    }
  };
  
  const handleReplyToComment = (replyId: string) => {
    setReplyingTo(replyId);
    // Faire défiler jusqu'au formulaire de réponse
    document.getElementById('reply-form')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleLikePost = async () => {
    if (!user || !post) {
      toast.error('Vous devez être connecté pour liker');
      navigate('/auth');
      return;
    }
    
    try {
      const result = await togglePostLike(post.id);
      
      // Mettre à jour l'état local
      setPost(prev => {
        if (!prev) return null;
        return {
          ...prev,
          likes: result.newCount,
          isLiked: result.liked
        };
      });
      
    } catch (error) {
      console.error('Erreur lors du like:', error);
    }
  };
  
  const handleLikeReply = async (replyId: string) => {
    if (!user) {
      toast.error('Vous devez être connecté pour liker');
      navigate('/auth');
      return;
    }
    
    try {
      const result = await toggleReplyLike(replyId);
      
      // Mettre à jour l'état local
      setPost(prev => {
        if (!prev) return null;
        
        const updatedReplies = prev.replies.map(reply => {
          if (reply.id === replyId) {
            return {
              ...reply,
              likes: result.newCount,
              isLiked: result.liked
            };
          }
          return reply;
        });
        
        return {
          ...prev,
          replies: updatedReplies
        };
      });
      
    } catch (error) {
      console.error('Erreur lors du like:', error);
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: fr
      });
    } catch (error) {
      return 'date inconnue';
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-startupia-turquoise"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">Discussion introuvable</h3>
        <Button onClick={handleGoBack} variant="outline" className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au forum
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Button onClick={handleGoBack} variant="outline" className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour au forum
      </Button>
      
      {/* Post principal */}
      <Card className="glass-card overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={post.authorAvatar} alt={post.authorName} />
                <AvatarFallback>{getInitials(post.authorName)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{post.authorName}</h3>
                <div className="text-sm text-white/60 flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(post.createdAt)}
                </div>
              </div>
            </div>
            <div>
              <span className="bg-white/10 text-xs font-medium py-1 px-2 rounded">
                {post.category}
              </span>
              {post.isPinned && (
                <span className="bg-startupia-gold/20 text-startupia-gold text-xs font-medium py-1 px-2 rounded ml-2">
                  Épinglé
                </span>
              )}
            </div>
          </div>
          <h2 className="text-2xl font-bold mt-4">{post.title}</h2>
        </CardHeader>
        
        <CardContent>
          <div className="whitespace-pre-wrap">{post.content}</div>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t border-white/10 pt-4">
          <div className="flex gap-4">
            <button 
              onClick={handleLikePost}
              className={`flex items-center gap-1 ${post.isLiked ? "text-startupia-turquoise" : "text-white/60 hover:text-white"}`}
            >
              <ThumbsUp size={18} />
              <span>{post.likes}</span>
            </button>
            
            <div className="flex items-center gap-1 text-white/60">
              <MessageCircle size={18} />
              <span>{post.replies?.length || 0}</span>
            </div>
            
            <div className="flex items-center gap-1 text-white/60">
              <Eye size={18} />
              <span>{post.views}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
      
      {/* Formulaire de réponse */}
      <Card className="glass-card" id="reply-form">
        <CardHeader>
          <h3 className="text-lg font-medium">
            {replyingTo ? 'Répondre à un commentaire' : 'Ajouter une réponse'}
          </h3>
          {replyingTo && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setReplyingTo(null)}
              className="text-xs text-white/60"
            >
              Annuler la réponse
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Votre réponse..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="min-h-[100px] bg-black/30"
          />
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleSubmitReply} disabled={!user || !replyContent.trim()}>
            <Send className="mr-2 h-4 w-4" /> 
            Répondre
          </Button>
        </CardFooter>
      </Card>
      
      {/* Liste des réponses */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Réponses ({post.replies?.length || 0})</h3>
        
        {post.replies?.length > 0 ? (
          post.replies.map((reply) => (
            <Card key={reply.id} className="glass-card">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={reply.authorAvatar} alt={reply.authorName} />
                    <AvatarFallback>{getInitials(reply.authorName)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{reply.authorName}</h4>
                    <div className="text-sm text-white/60">
                      {formatDate(reply.createdAt)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="whitespace-pre-wrap">{reply.content}</p>
              </CardContent>
              
              <CardFooter className="flex justify-between pt-2">
                <div className="flex gap-4">
                  <button 
                    onClick={() => handleLikeReply(reply.id)}
                    className={`flex items-center gap-1 ${reply.isLiked ? "text-startupia-turquoise" : "text-white/60 hover:text-white"}`}
                  >
                    <ThumbsUp size={16} />
                    <span>{reply.likes}</span>
                  </button>
                  
                  <button 
                    onClick={() => handleReplyToComment(reply.id)}
                    className="flex items-center gap-1 text-white/60 hover:text-white"
                  >
                    <MessageCircle size={16} />
                    <span>Répondre</span>
                  </button>
                </div>
              </CardFooter>
              
              {/* Réponses imbriquées (si implémentées) */}
              {reply.nestedReplies && reply.nestedReplies.length > 0 && (
                <div className="ml-8 pl-4 border-l border-white/10 mt-2 space-y-3">
                  {reply.nestedReplies.map((nestedReply) => (
                    <div key={nestedReply.id} className="bg-black/20 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={nestedReply.authorAvatar} alt={nestedReply.authorName} />
                          <AvatarFallback>{getInitials(nestedReply.authorName)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h5 className="font-medium text-sm">{nestedReply.authorName}</h5>
                          <div className="text-xs text-white/60">
                            {formatDate(nestedReply.createdAt)}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{nestedReply.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))
        ) : (
          <div className="text-center py-12 text-white/60">
            <MessageCircle className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <h4 className="text-lg font-medium">Aucune réponse pour l'instant</h4>
            <p>Soyez le premier à répondre à cette discussion !</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForumPostDetail;
