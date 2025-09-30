import { Router } from "express";
import { CalledController } from "@/controllers/called-controller";

const calledRoutes = Router();
const calledController = new CalledController();

calledRoutes.post("/", calledController.create); // ✅ define POST /calleds

export { calledRoutes };



