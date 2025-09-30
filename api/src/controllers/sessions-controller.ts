import { AppError } from "@/utils/AppError";
import { prisma } from "@/database/prisma";
import { Request, Response } from "express";
import { compare } from "bcrypt";
import { z } from "zod";
import { authConfig } from "@/config/auth";
import { sign, SignOptions } from "jsonwebtoken";

class SessionsController {
    async create(request: Request, response: Response) {
        const bodySchema = z.object({
            email: z.string().email({ message: "E-mail inválido" }),
            password: z.string(),
        });

        const { email, password } = bodySchema.parse(request.body);

        const user = await prisma.user.findFirst({ where: { email } });
        if (!user) throw new AppError("E-mail ou senha não confere.", 401);

        const passwordMatched = await compare(password, user.password);
        if (!passwordMatched) throw new AppError("E-mail ou senha não confere.", 401);

        const signOptions: SignOptions = {
            subject: String(user.id),
            expiresIn: authConfig.jwt.expiresIn,
        };

        const token = sign({ role: user.role }, authConfig.jwt.secret, signOptions);

        const { password: _, ...userWithoutPassword } = user;

        response.json({ token, user: userWithoutPassword });
    }
}

export { SessionsController };