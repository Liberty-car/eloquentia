import 'dotenv/config';
import path from 'node:path';
import { defineConfig } from 'prisma/config';

// Configuration Prisma 7. Charge server/.env, puis fournit l'URL de connexion
// utilisee par les migrations / l'introspection (connexion DIRECTE).
// Le client runtime, lui, se connecte via le driver adapter (cf. lib/prisma.ts).
const migrationUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  ...(migrationUrl ? { datasource: { url: migrationUrl } } : {}),
});
