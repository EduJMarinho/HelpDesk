//index.ts

import { Router } from "express";
import { usersRoutes } from "./users-routes";
import { calledRoutes } from "./called-routes";
import { sessionRoutes } from "./sessions-routes";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { secureUsersRoutes } from "./secure-users-routes";

const routes = Router();

// Rotas públicas
routes.use("/users", usersRoutes);
routes.use("/sessions", sessionRoutes);

// Rotas privadas
routes.use(ensureAuthenticated);
routes.use("/calleds", calledRoutes);
routes.use("/secure-users", ensureAuthenticated, secureUsersRoutes);

export { routes };