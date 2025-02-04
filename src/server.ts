import Hapi from "@hapi/hapi";
import { defineRoutes } from "./routes";
import { stopDataSource, initializeDataSource } from "./util";

const getServer = () => {
  const server = Hapi.server({
    host: "localhost",
    port: 3000,
  });

  server.events.on("stop", async () => {
    // close the database connection to prevent jest warning
    await stopDataSource();
  });

  defineRoutes(server);

  return server;
};

export const initializeServer = async () => {
  const server = getServer();
  // initialize the database and clear all items
  await initializeDataSource(true);

  await server.initialize();
  return server;
};

export const startServer = async () => {
  const server = getServer();

  await initializeDataSource();

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
  return server;
};
