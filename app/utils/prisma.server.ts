import { PrismaClient } from "@prisma/client";
import { singleton } from "./singleton.server";

const prisma: PrismaClient = singleton("prisma", getClient);

function getClient(): PrismaClient {
  // NOTE: during development if you change anything in this function, remember
  // that this only runs once per server restart and won't automatically be
  // re-run per request like everything else is.
  const client = new PrismaClient({});
  // make the connection eagerly so the first request doesn't have to wait
  void client.$connect();
  return client;
}

export { prisma };
