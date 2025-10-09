//called-controller.ts


import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { Service } from "@prisma/client";

const SERVICE_VALUES: Record<Service, number> = {
    backup: 100,
    virus: 150,
    software: 200,
    internet: 120,
    printer: 180,
    peripherals: 160,
};

class CalledController {
    async create(req: Request, res: Response) {
        const { service, amount, technical } = req.body;
        const userId = req.user?.id;

        if (!userId) return res.status(401).json({ error: "Usuário não autenticado" });

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

        const called = await prisma.calleds.create({
            data: {
                name: user.name,
                service,
                amount,
                technical,
                userId,
            },
        });

        return res.status(201).json(called);
    }

    async index(req: Request, res: Response) {
        const page = Number(req.query.page) || 1;
        const limit = 5;
        const skip = (page - 1) * limit;
        const userRole = req.user?.role;
        const userId = req.user?.id;

        const whereClause: any = {};

        if (userRole === "technical" && userId) {
            const techUser = await prisma.user.findUnique({ where: { id: userId } });
            if (techUser) {
                whereClause.technical = techUser.name;
            }
        }

        const calleds = await prisma.calleds.findMany({
            where: whereClause,
            include: {
                user: true,
                serviceEntries: true,
            },
            skip,
            take: limit,
            orderBy: {
                createdAt: "desc",
            },
        });

        const totalCount = await prisma.calleds.count({
            where: whereClause,
        });

        return res.json({
            calleds,
            pagination: {
                totalPages: Math.ceil(totalCount / limit),
                currentPage: page,
            },
        });
    }

    async search(req: Request, res: Response) {
        const rawName = req.query.name?.toString().toLowerCase() || "";

        const allCalleds = await prisma.calleds.findMany({
            include: {
                user: true,
                serviceEntries: true, // ✅ já está aqui
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        const filtered = allCalleds.filter((item) => {
            const userName = item.user?.name?.toLowerCase() || "";
            const technical = item.technical?.toLowerCase() || "";
            const service = item.service?.toLowerCase();

            return (
                userName.includes(rawName) ||
                technical.includes(rawName) ||
                service === rawName
            );
        });

        return res.json(filtered); // ✅ envia tudo, inclusive os serviços adicionais
    }


    async show(req: Request, res: Response) {
        const { id } = req.params;

        const called = await prisma.calleds.findUnique({
            where: { id },
            include: {
                user: true,
                serviceEntries: true,
            },
        });

        if (!called) return res.status(404).json({ error: "Chamado não encontrado" });

        return res.json({
            id: called.id,
            customer: called.user.name,
            technical: called.technical,
            service: called.service,
            amount: called.amount,
            status: called.status,
            serviceEntries: called.serviceEntries,
        });
    }

    async update(req: Request, res: Response) {
        const { id } = req.params;
        const { status, technical } = req.body;

        const called = await prisma.calleds.findUnique({ where: { id } });
        if (!called) return res.status(404).json({ error: "Chamado não encontrado" });

        const updated = await prisma.calleds.update({
            where: { id },
            data: {
                status: status ?? called.status,
                technical: technical ?? called.technical,
            },
        });

        return res.json(updated);
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params;

        await prisma.calleds.delete({ where: { id } });

        return res.status(204).send();
    }

    async addService(req: Request, res: Response) {
        const { id } = req.params;
        const { description } = req.body;

        if (!description || !(description in SERVICE_VALUES)) {
            return res.status(400).json({ error: "Serviço inválido" });
        }

        const value = SERVICE_VALUES[description as Service];

        const called = await prisma.calleds.findUnique({
            where: { id },
            include: { serviceEntries: true },
        });

        if (!called) return res.status(404).json({ error: "Chamado não encontrado" });

        await prisma.serviceEntry.create({
            data: {
                calledId: id,
                description,
                value,
            },
        });

        await prisma.calleds.update({
            where: { id },
            data: {
                amount: called.amount + value,
            },
        });

        return res.status(201).json({ message: "Serviço adicionado com sucesso" });
    }
}

export { CalledController };