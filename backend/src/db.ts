import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import path from 'path';

const dbPath = path.resolve(__dirname, '../dev.db');
const adapter = new PrismaLibSql({ url: `file:${dbPath}` });

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
