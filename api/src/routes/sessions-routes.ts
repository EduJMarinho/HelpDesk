import { Router } from "express";
import { SessionsController } from "@/controllers/sessions-controller";

const sessionRoutes = Router();
const sessionController = new SessionsController();


sessionRoutes.post("/", sessionController.create);

export { sessionRoutes }


