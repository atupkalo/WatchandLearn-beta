import "dotenv/config"; 
import { defineConfig } from "prisma/config";

function normalizePostgresUrl(value: string) {
  const url = new URL(value);

  if (!url.searchParams.has("sslmode")) {
    url.searchParams.set("sslmode", "require");
  }

  return url.toString();
}

const directUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!directUrl) {
  throw new Error("DATABASE_URL or DIRECT_URL must be set for Prisma.");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: normalizePostgresUrl(directUrl),
    ...(process.env.SHADOW_DATABASE_URL
      ? {
          shadowDatabaseUrl: normalizePostgresUrl(process.env.SHADOW_DATABASE_URL),
        }
      : {}),
  },
});
