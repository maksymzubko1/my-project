import { PrismaClient } from "@prisma/client";
import invariant from "tiny-invariant";

import { singleton } from "./singleton.server";

const prisma = singleton("prisma", getPrismaClient);

function getPrismaClient() {
  const { DATABASE_URL } = process.env;
  invariant(typeof DATABASE_URL === "string", "DATABASE_URL env var not set");

  const databaseUrl = new URL(DATABASE_URL);

  console.log(`🔌 setting up prisma client to ${databaseUrl.host}`);
  const client = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl.toString(),
      },
    },
  });
  client.$connect();

  return client;
}

export { prisma };
