//secure-users-routes.ts

import { Router } from "express";
import { NewPassController } from "@/controllers/new_pass-controller";

const router = Router();
const controller = new NewPassController();

router.patch("/password", controller.updatePassword.bind(controller));

export { router as secureUsersRoutes };


