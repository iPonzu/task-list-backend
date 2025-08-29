import { Request, Response } from 'express'
import { List } from '../models/taskList'

export const createList = async (req: any, res: Response) => {
    try{
        const { name } = req.body
        if(!name){ return res.status(400).json({message: "Nome da lista é obrigatório"})}

        const list = await List.create({ 
            name, 
            user: req.userId 
        })
        return res.status(201).json(list)
    }catch(err){
        return res.status(500).json({message: "Erro ao criar lista", error: err})
    }
}

export const getLists = async (req: any, res: Response) => {
    try{
        const lists = await List.find({ user: req.userId })
        return res.json(lists)
    }catch(err){
        return res.status(500).json({message: "Erro ao buscar listas", error: err})
    }

}

export const getListsById = async (req: any, res: Response) => {
    try {
        const { id } = req.params
        const list = await List.findOne({ _id: id, user: req.userId })
        if(!list){return res.status(404).json({message: "Lista não encontrada"})}
        
        return res.json(list)
    } catch (err) {
        return res.status(500).json({message: "Erro ao buscar lista", error: err})
    }
}

export const updateList = async (req: any, res: Response) => {
   try {
    const { id } = req.params
    const { name } = req.body

    const updatedList = await List.findOneAndUpdate(
        {_id: id, user: req.userId},
        { name },
        { new: true }
    )
        if(!updatedList){ return res.status(404).json({message: "Lista não encontrada"})}
        return res.json(updatedList)
   } catch (err) {
       return res.status(500).json({message: "Erro ao atualizar lista", error: err})
   }
}

export const deleteList = async (req: any, res: Response) => {
    try{
        const { id } = req.params
        const deletedList = await List.findByIdAndDelete({
            _id: id,
            user: req.userId
        })
        if(!deletedList){ return res.status(404).json({message: "Lista não encontrada"})}
    }catch (err){
        return res.status(500).json({message: "Erro ao deletar lista", error: err})
    }
}