//error-handling.ts

import { AppError } from "@/utils/AppError";
import { ErrorRequestHandler } from "express";
import { request } from "http";
import { nextTick } from "process";
import { ZodError } from "zod";


export const errorHandling: ErrorRequestHandler = (
    error,
    request,
    response,
    next
) => {
    if (error instanceof AppError) {
        response.status(error.statusCode).json({ message: error.message })
        return
    }
    if (error instanceof ZodError) {
        response.status(400).json({
            message: "Erro de validação",
            issues: error.format()
        })
        return
    }
    response.status(500).json({ message: error.message })
    return
}


