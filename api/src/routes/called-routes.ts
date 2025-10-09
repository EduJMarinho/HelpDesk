//called-routes.ts


import { Router } from "express";
import { CalledController } from "@/controllers/called-controller";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";

const calledRoutes = Router();
const calledController = new CalledController();

calledRoutes.post("/", verifyUserAuthorization(["customer", "admin"]), calledController.create);
calledRoutes.get("/", verifyUserAuthorization(["technical", "admin"]), calledController.index);
calledRoutes.get("/search", verifyUserAuthorization(["technical", "admin"]), calledController.search); // ✅ Nova rota de busca
calledRoutes.get("/:id", verifyUserAuthorization(["technical", "admin"]), calledController.show);
calledRoutes.put("/:id", verifyUserAuthorization(["technical", "admin"]), calledController.update);
calledRoutes.delete("/:id", verifyUserAuthorization(["admin"]), calledController.delete);
calledRoutes.post("/:id/services", verifyUserAuthorization(["technical"]), calledController.addService);

export { calledRoutes };