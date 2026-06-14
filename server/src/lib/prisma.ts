import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import { env } from '../config/env';

// Singleton PrismaClient. En Prisma 7, un driver adapter est obligatoire :
// la connexion runtime passe par @prisma/adapter-pg (node-postgres).
const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
  });

// Évite de multiplier les instances en développement (hot reload).
if (env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
