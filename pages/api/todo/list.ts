import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import TodoItem from "@/app/type/todoItem";

const prisma = new PrismaClient()

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<TodoItem[]>
) {
    const todos:TodoItem[] = await prisma.todo.findMany()
    res.status(200).json(todos)
}

