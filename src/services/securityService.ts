
/**
 * Service de sécurité pour la validation des entrées et la prévention d'attaques
 */

// Validation d'email (prévention d'injections)
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// Sanitisation de texte pour prévenir les attaques XSS
export const sanitizeText = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Validation de mot de passe fort
export const isStrongPassword = (password: string): boolean => {
  // Au moins 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Feedback sur la force du mot de passe
export const getPasswordStrength = (password: string): { score: number; feedback: string } => {
  if (!password) return { score: 0, feedback: 'Veuillez entrer un mot de passe' };
  
  let score = 0;
  let feedback = 'Très faible';
  
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  
  if (score === 1) feedback = 'Très faible';
  else if (score === 2) feedback = 'Faible';
  else if (score === 3) feedback = 'Moyen';
  else if (score === 4) feedback = 'Fort';
  else if (score === 5) feedback = 'Très fort';
  else if (score === 6) feedback = 'Excellent';
  
  return { score, feedback };
};

// Validation d'URL
export const validateURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

// Protection contre les attaques par force brute
let loginAttempts = new Map<string, { count: number, lastAttempt: number }>();

export const trackLoginAttempt = (email: string, success: boolean): boolean => {
  const now = Date.now();
  const attempts = loginAttempts.get(email) || { count: 0, lastAttempt: 0 };

  // Réinitialiser le compteur si la dernière tentative date de plus de 30 minutes
  if (now - attempts.lastAttempt > 30 * 60 * 1000) {
    attempts.count = 0;
  }

  // Si connexion réussie, réinitialiser le compteur
  if (success) {
    loginAttempts.delete(email);
    return true;
  }
  
  // Incrémenter le compteur d'échecs
  attempts.count += 1;
  attempts.lastAttempt = now;
  loginAttempts.set(email, attempts);
  
  // Bloquer si plus de 5 échecs
  return attempts.count <= 5;
};

// Nettoyage périodique des tentatives obsolètes (à appeler périodiquement)
export const cleanupLoginAttempts = (): void => {
  const now = Date.now();
  loginAttempts.forEach((value, key) => {
    if (now - value.lastAttempt > 30 * 60 * 1000) {
      loginAttempts.delete(key);
    }
  });
};
