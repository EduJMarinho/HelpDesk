import { AppError } from "@/utils/AppError";
import { verify } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { authConfig } from "@/config/auth";
import { UserRole } from "@prisma/client";

interface TokenPayload {
    role: string;
    sub: string;
}

export function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
    const authHeader = request.headers.authorization;
    if (!authHeader) throw new AppError("JWT token não encontrado", 401);

    const [, token] = authHeader.split(" ");

    try {
        const decoded = verify(token, authConfig.jwt.secret) as TokenPayload;
        request.user = {
            id: decoded.sub,
            role: decoded.role as UserRole,
        };
        return next();
    } catch (error: any) {
        throw new AppError(`Token inválido: ${error.message}`, 401);
    }
}