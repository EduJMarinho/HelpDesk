//new_pass-controller.ts

import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { z } from "zod";
import bcrypt from "bcrypt";

const defaultPasswords = {
    admin: "helpdesk",
    technical: "123456",
};

class NewPassController {
    async updatePassword(request: Request, response: Response) {
        const bodySchema = z.object({
            currentPassword: z.string().min(6),
            newPassword: z.string().min(6),
        });

        const { currentPassword, newPassword } = bodySchema.parse(request.body);

        const userId = request.user?.id;
        if (!userId) {
            return response.status(401).json({ error: "Usuário não autenticado." });
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return response.status(404).json({ error: "Usuário não encontrado." });
        }

        const passwordMatched = await bcrypt.compare(currentPassword, user.password);
        if (!passwordMatched) {
            return response.status(401).json({ error: "Senha atual incorreta." });
        }

        // Verifica se o usuário ainda está usando a senha padrão
        let isUsingDefaultPassword = false;
        if (user.role === "admin") {
            isUsingDefaultPassword = await bcrypt.compare(defaultPasswords.admin, user.password);
        } else if (user.role === "technical") {
            isUsingDefaultPassword = await bcrypt.compare(defaultPasswords.technical, user.password);
        }

        if (isUsingDefaultPassword) {
            const isCorrectDefault =
                (user.role === "admin" && currentPassword === defaultPasswords.admin) ||
                (user.role === "technical" && currentPassword === defaultPasswords.technical);

            if (!isCorrectDefault) {
                return response.status(403).json({ error: "A senha atual não é a padrão para este tipo de usuário." });
            }
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword },
        });

        return response.status(200).json({ message: "Senha atualizada com sucesso!" });
    }
}

export { NewPassController };
