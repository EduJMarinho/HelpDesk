import { Router } from "express";
import { UsersController } from "@/controllers/users-controller";
import { prisma } from "@/database/prisma";

const usersRoutes = Router();
const usersController = new UsersController();

usersRoutes.post("/", usersController.create);

usersRoutes.get("/", async (req, res) => {
    const role = req.query.role;
    if (role !== "technical") return res.status(400).json({ error: "Role inválido" });

    const technicians = await prisma.user.findMany({
        where: { role: "technical" },
        select: { name: true },
    });

    res.json(technicians);
});

export { usersRoutes };

