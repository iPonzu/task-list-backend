import { Request, Response } from "express";
import  { List }  from "../models/taskList"; 
import { Task } from "../models/taskModels";

export const createTask = async (req: any, res: Response) => {
    const { title, description, dueDate, status, listId } = req.body
    const userId = req.userId

    if(!title || !listId) {return res.status(400).json({message: "Título e ID da lista são obrigatórios"})}

    const list = List.getById(Number(listId), userId)
    if(!list) return res.status(404).json({message: "Lista não encontrada"})

    const task = Task.create({
        title,
        description,
        status,
        dueDate: dueDate? new Date (dueDate) : undefined,
        userId,
        listId: Number(listId),
    })
    return res.status(201).json(task)
}

export const getTasks = async (req: any, res: Response) => {
    const userId = req.userId
    const { status, dueDate, listId } = req.query

    const filters: any = {}
    if(status) filters.status = status
    if(dueDate) filters.dueDate = dueDate
    if(listId) filters.listaId = Number(listId)
        
    const tasks = Task.getAll(userId, filters)
    return res.json(tasks)
}

export const getTaskById = async (req: any, res: Response) => {
    const { id } = req.params
    const userId = req.userId

    const task = Task.getById(Number(id), userId)
    if(!task) return res.status(404).json({message: "Tarefa não encontrada"})

    return res.json(task)
}

export const updateTask = async (req: any, res: Response) => {
    const { id } = req.params
    const { title, description, dueDate, status, listId } = req.body
    const userId = req.userId

    // const updatedTask = Task.update(Number(id), userId, req.body)
    // if(!updatedTask) return res.status(404).json({message: "Tarefa não encontrada"})

    // return res.json(updatedTask)

    const updatedTask = Task.update(Number(id), userId, {
        title,
        description,
        status,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        listId: Number(listId),
    })
    if(!updatedTask) return res.status(404).json({message: "Tarefa não encontrada"})

    return res.json(updatedTask)
}

export const deleteTask = async (req: any, res: Response) => {
    const { id } = req.params
    const userId = req.userId

    const deleteTask = Task.delete(Number(id), userId)
    if(!deleteTask) return res.status(404).json({message: "Tarefa não encontrada"})

    return res.json({message: "Tarefa deletada"})
}