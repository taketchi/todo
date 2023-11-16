import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, Prisma } from '@prisma/client'
import TodoItem from "@/app/type/todoItem";
import ErrorMessage from "@/app/type/ErrorMessage"

const prisma = new PrismaClient()

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<TodoItem|ErrorMessage>
) {
    try {
        const item = req.body
        if (req.method === 'POST') {
            if(item.id === "create") {
                const newTodoItem:TodoItem = await prisma.todo.create({
                    data: {
                        todo: item.todo,
                        editing: item.editing,
                        enable: item.enable
                    },
                });
                res.status(200).json(newTodoItem)
            }
            else {
                await prisma.todo.update({
                    where: {
                        id: item.id
                    },
                    data: {
                        todo: item.todo,
                        editing: item.editing,
                        enable: item.enable
                    },
                });
                res.status(200).end()
            }
        }
        else if(req.method === 'DELETE') {
            await prisma.todo.delete({
                where: {
                    id: item.id
                }
            });
            res.status(200).end()
        }
        else {
            res.status(500).json({ error: 'bad request' })
        }
    }
    catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            res.status(500).json({ error: 'can\'t read databases' })
        }
        else {
            res.status(500).json({ error: 'bad request' })
        }
    }
}


