import { Server } from "@hapi/hapi";
import { itemController } from "../controller";
import { itemGetSchema } from "../entities";

export const itemRoutes = (server: Server) => {
  const path = "/items";

  server.route({
    method: "GET",
    path: path,
    handler: itemController.getAll,
  });

  server.route({
    method: "GET",
    path: `${path}/{itemId}`,
    handler: itemController.getById,
    options: {
      validate: { params: itemGetSchema },
    },
  });

  server.route({
    method: "POST",
    path: path,
    handler: itemController.create,
    options: {
      payload: { output: "data", parse: true, allow: "application/json" },
    },
  });

  server.route({
    method: "PUT",
    path: `${path}/{itemId}`,
    handler: itemController.update,
    options: {
      payload: { output: "data", parse: true, allow: "application/json" },
      validate: { params: itemGetSchema },
    },
  });

  server.route({
    method: "DELETE",
    path: `${path}/{itemId}`,
    handler: itemController.delete,
    options: {
      validate: { params: itemGetSchema },
    },
  });
};
