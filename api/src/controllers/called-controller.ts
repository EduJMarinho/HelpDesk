import { Request, Response } from "express"
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
import { z } from "zod"

const ServicesEnum = z.enum([
    "backup",
    "virus",
    "software",
    "internet",
    "printer",
    "peripherals",
])

class CalledController {
    async create(request: Request, response: Response) {
        // Validação do corpo da requisição (sem o campo 'name')
        const bodySchema = z.object({
            service: ServicesEnum,
            amount: z.number().positive({ message: "O valor tem que ser escolhido" }),
            technical: z.string(),
        })

        const { service, amount, technical } = bodySchema.parse(request.body)

        // Verifica se o usuário está autenticado
        if (!request.user?.id) {
            throw new AppError("Não autorizado.", 401)
        }

        // Busca o nome do usuário logado no banco
        const user = await prisma.user.findUnique({
            where: { id: request.user.id },
        })

        if (!user) {
            throw new AppError("Usuário não encontrado.", 404)
        }

        // Cria a chamada com o nome do usuário logado
        const called = await prisma.calleds.create({
            data: {
                name: user.name,
                service,
                amount,
                technical,
                userId: request.user.id,
            },
        })

        response.status(201).json(called)

        /**
         * 🔧 INSTRUÇÕES PARA O FRONTEND:
         *
         * Este endpoint espera um único serviço e valor por chamada.
         * Exemplo de payload JSON enviado pelo frontend:
         *
         * {
         *   "service": "virus",
         *   "amount": 100.00,
         *   "technical": "Luiz Antonio"
         * }
         *
         * Se o frontend permitir múltiplas escolhas (ex: vários serviços e valores),
         * existem duas abordagens possíveis:
         *
         * 1. Enviar múltiplas requisições POST, uma para cada combinação de service + amount.
         *    Isso pode ser feito em um loop no frontend.
         *
         * 2. Adaptar a API para aceitar um array de chamadas:
         *    [
         *      { "service": "virus", "amount": 100, "technical": "João" },
         *      { "service": "backup", "amount": 150, "technical": "João" }
         *    ]
         *    Nesse caso, o controller precisaria ser ajustado para processar múltiplos itens.
         *
         * Por enquanto, este controller aceita apenas uma chamada por vez.
         */
    }
    async index(request: Request, response: Response) {
        const querySchema = z.object({
            name: z.string().optional().default(""),
            page: z.coerce.number().optional().default(1),
            perPage: z.coerce.number().optional().default(10),

        })
        const { name, page, perPage } = querySchema.parse(request.query);

        // Calcula os valores de skip
        const skip = (page - 1) * perPage;

        const calleds = await prisma.calleds.findMany({
            skip,
            take: perPage,

            where: {
                user: {
                    name: {
                        contains: name.trim(),
                    }
                }
            },
            orderBy: { createdAt: "desc" },
            include: { user: true },
        })

        //Obter o total de registros para calcular o número de páginas.
        const totalRecords = await prisma.calleds.count({
            where: {
                user: {
                    name: {
                        contains: name.trim(),
                    }
                }
            }
        })
        const totalPages = Math.ceil(totalRecords / perPage);

        response.json({
            calleds,
            pagination: {
                page,
                perPage,
                totalRecords,
                totalPages: totalPages > 0 ? totalPages : 1,
            }

        })
    }

    async show(request: Request, response: Response) {
        const paramsSchema = z.object({
            id: z.string().uuid(),
        })
        const { id } = paramsSchema.parse(request.params);

        const called = await prisma.calleds.findFirst({
            where: { id },
            include: { user: true },
        });

        response.json(called);
    }
}


export { CalledController }