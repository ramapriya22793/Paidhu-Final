const { PrismaClient } = require("@prisma/client");

let url = process.env.DATABASE_URL || "";
if (url && !url.includes("connection_limit=")) {
  const separator = url.includes("?") ? "&" : "?";
  url = `${url}${separator}connection_limit=20&pool_timeout=30&connect_timeout=15`;
}

let prisma;

if (!global.prisma) {
  global.prisma = new PrismaClient({
    datasources: url ? { db: { url } } : undefined,
    log: ['error', 'warn']
  });
}
prisma = global.prisma;

module.exports = prisma;

