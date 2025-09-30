import { Request, Response } from "express";


class CalledController {
    async create(request: Request, response: Response) {
        response.json({ message: "ok" })
    }
}

export { CalledController }

