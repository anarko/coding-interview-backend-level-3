import { Server } from "@hapi/hapi";
import { rootController } from "../controller";

export const rootRoutes = (server: Server) => {
  server.route({
    method: "GET",
    path: "/ping",
    handler: rootController.ping,
  });
};
