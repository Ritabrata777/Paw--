// ============================================================
// PAWTRACE — Database Client (Prisma)
// ============================================================
// In production, uses Prisma with PostgreSQL.
// For development without a database, all APIs seamlessly fall back to our in-memory store.

let prismaClient: any;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaClient } = require('@prisma/client');
  const globalForPrisma = globalThis as unknown as { prisma: any };
  prismaClient = globalForPrisma.prisma ?? new PrismaClient();
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaClient;
} catch {
  // Fallback stub for dev environment
  prismaClient = null;
}

export const prisma = prismaClient;
export default prisma;
