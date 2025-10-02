



import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { z } from "zod";
import bcrypt from "bcrypt";

class NewPassController {
    async updatePassword(request: Request, response: Response) {
        const bodySchema = z.object({
            currentPassword: z.string().min(6),
            newPassword: z.string().min(6),
        });

        const { currentPassword, newPassword } = bodySchema.(request.body);
        const { id } = request.user;

        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) return response.status(404).json({ error: "Usuário não encontrado." });

        const passwordMatched = await bcrypt.compare(currentPassword, user.password);
        if (!passwordMatched) return response.status(401).json({ error: "Senha atual incorreta." });

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id },
            data: { password: hashedNewPassword },
        });

        return response.status(200).json({ message: "Senha atualizada com sucesso!" });
    }
}

export { NewPassController };