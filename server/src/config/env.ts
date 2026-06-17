import 'dotenv/config';
import { z } from 'zod';

// Schéma de validation des variables d'environnement.
// L'application refuse de démarrer si la configuration est invalide.
const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  // Connexion runtime (pooler en prod Supabase).
  DATABASE_URL: z.string().url(),
  // Connexion directe pour les migrations (optionnelle en local).
  DIRECT_URL: z.string().url().optional(),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET est requis'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  BREVO_API_KEY: z.string().optional(),
  // Supabase Storage (pièces jointes). Requis pour le module attachments.
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SUPABASE_STORAGE_BUCKET: z.string().default('attachments'),
  // Taille max d'une pièce jointe en octets (défaut 25 Mo).
  ATTACHMENTS_MAX_BYTES: z.coerce.number().int().positive().default(26214400),
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
    .default('info'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "Variables d'environnement invalides :",
    parsed.error.flatten().fieldErrors,
  );
  throw new Error("Configuration d'environnement invalide");
}

export const env = parsed.data;
export type Env = typeof env;
