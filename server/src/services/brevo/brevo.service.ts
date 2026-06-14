import { env } from '../../config/env';
import { logger } from '../../config/logger';

// Service Brevo ISOLÉ : wrapper HTTP minimal + lecture de la clé en env.
// Aucun usage métier ici (pas d'envoi de campagne ni de gestion de contacts).
// Les modules métier construiront leur logique au-dessus de ce wrapper.
const BREVO_API_BASE = 'https://api.brevo.com/v3';

export function isBrevoConfigured(): boolean {
  return Boolean(env.BREVO_API_KEY);
}

export async function brevoRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  if (!env.BREVO_API_KEY) {
    throw new Error('BREVO_API_KEY manquante : service Brevo non configuré.');
  }

  const response = await fetch(`${BREVO_API_BASE}${path}`, {
    ...init,
    headers: {
      'api-key': env.BREVO_API_KEY,
      'content-type': 'application/json',
      accept: 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    logger.error(
      { status: response.status, body },
      'Échec de la requête Brevo',
    );
    throw new Error(`Requête Brevo échouée (${response.status})`);
  }

  return response.json() as Promise<T>;
}
