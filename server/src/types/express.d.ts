// Augmentation du type Request d'Express : porteur de l'utilisateur authentifié.
import 'express';

declare global {
  namespace Express {
    interface UserPayload {
      id: string;
      role: 'ADMIN' | 'MEMBRE';
    }

    interface Request {
      user?: UserPayload;
    }
  }
}

export {};
