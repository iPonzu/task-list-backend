import { Request, Response } from 'express'
import { List } from '../models/taskList'

export const createList = async (req: any, res: Response) => {
    const { name } = req.body;
    const userId = req.userId

    if(!name) {return res.status(400).json({message: "Nome da lista é obrigatório"})}

    const list = List.create(name, userId)
    return res.status(201).json(list)
}

export const getLists = async (req: any, res: Response) => {
    const userId = req.userId
    const lists = List.getAll(userId)
    return res.json(lists)

}

export const getListsById = async (req: any, res: Response) => {
    const { id } = req.params
    const userId = req.userId
    const list = List.getById(Number(id), userId)

    if(!list){return res.status(404).json({message: "Lista não encontrada"})}
    
    return res.json(list)
}

export const updateList = async (req: any, res: Response) => {
   const { id } = req.params
   const { name } = req.body
   const userId = req.userId
   const updateList = List.update(Number(id), userId, name)

   if(!updateList) {return res.status(404).json({message: "Lista não encontrada"})}

   return res.json(updateList)
}

export const deleteList = async (req: any, res: Response) => {
    const { id } = req.params
    const userId = req.userId
    const deleteList = List.delete(Number(id), userId)

    if(!deleteList) {return res.status(404).json({message: "Lista não encontrada"})}

    return res.json({message: "Lista deletada com sucesso"})
}