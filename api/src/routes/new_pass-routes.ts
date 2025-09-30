import { Router } from "express";
import { NewPassController } from "@/controllers/new_pass-controller";

const usersRoutes = Router();
const usersController = new NewPassController();

usersRoutes.patch("/:email/password", usersController.updatePassword.bind(usersController));

export { usersRoutes };


