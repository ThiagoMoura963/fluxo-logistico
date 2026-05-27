import { createRouter } from "next-connect";
import { runner } from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database.js";
import controller from "infra/controller.js";

const router = createRouter();

export default router.handler(controller.errorHandlers);

router.get(getHandler);
router.post(postHandler);

const defaultMigrationsOptions = {
  dryRun: true,
  dir: join("infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

async function getHandler(request, response) {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const pendingMigrations = await runner({
      ...defaultMigrationsOptions,
      dbClient,
    });
    return response.status(200).json(pendingMigrations);
  } finally {
    await dbClient.end();
  }
}

async function postHandler(request, response) {
  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const migratedMigrations = await runner({
      ...defaultMigrationsOptions,
      dbClient,
      dryRun: false,
    });

    if (migratedMigrations.length) {
      return response.status(201).json(migratedMigrations);
    }
    return response.status(200).json(migratedMigrations);
  } finally {
    await dbClient.end();
  }
}
