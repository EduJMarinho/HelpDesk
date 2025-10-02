import { Router } from "express";
import { CalledController } from "@/controllers/called-controller";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";

const calledRoutes = Router();
const calledController = new CalledController();

calledRoutes.post(
    "/",
    verifyUserAuthorization(["customer", "admin"]),//usuario autorizado.
    calledController.create);

calledRoutes.get("/",
    verifyUserAuthorization(["technical", "admin"]),
    calledController.index
)

calledRoutes.get("/:id",
    verifyUserAuthorization(["technical", "admin"]),
    calledController.show
)

export { calledRoutes };



