import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from '../../config/env';

// Service Supabase Storage ISOLÉ : seul endroit qui parle au SDK Supabase.
// La clé service-role reste côté serveur. Aucun usage métier ici.

let client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      'Supabase non configuré : SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requis.',
    );
  }
  if (!client) {
    client = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });
  }
  return client;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY);
}

export interface SignedUpload {
  signedUrl: string; // URL absolue où le navigateur PUT le fichier
  token: string;
  path: string;
}

export async function createSignedUploadUrl(
  path: string,
): Promise<SignedUpload> {
  const { data, error } = await getClient()
    .storage.from(env.SUPABASE_STORAGE_BUCKET)
    .createSignedUploadUrl(path);
  if (error || !data) {
    throw new Error(`Échec createSignedUploadUrl : ${error?.message}`);
  }
  return { signedUrl: data.signedUrl, token: data.token, path: data.path };
}

export async function createSignedDownloadUrl(
  path: string,
  expiresInSeconds = 300,
): Promise<string> {
  const { data, error } = await getClient()
    .storage.from(env.SUPABASE_STORAGE_BUCKET)
    .createSignedUrl(path, expiresInSeconds);
  if (error || !data) {
    throw new Error(`Échec createSignedUrl : ${error?.message}`);
  }
  return data.signedUrl;
}

export async function removeObject(path: string): Promise<void> {
  const { error } = await getClient()
    .storage.from(env.SUPABASE_STORAGE_BUCKET)
    .remove([path]);
  if (error) {
    throw new Error(`Échec remove : ${error.message}`);
  }
}
