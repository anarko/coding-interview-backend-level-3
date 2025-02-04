import { itemRoutes } from "./item";
import { rootRoutes } from "./root";
import Hapi from "@hapi/hapi";

export const defineRoutes = (server: Hapi.Server) => {
  rootRoutes(server);
  itemRoutes(server);
};
