import { Router } from "express";
import { usersRoutes } from "./users-routes";
import { calledRoutes } from "./called-routes";
import { sessionRoutes } from "./sessions-routes";
import { ensureAuthenticated } from "./ensure-authenticated";

const routes = Router();

routes.use("/sessions", sessionRoutes);
routes.use("/users", usersRoutes);
routes.use("/calleds", ensureAuthenticated, calledRoutes);

export { routes };