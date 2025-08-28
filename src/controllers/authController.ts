import { Request, Response } from 'express'
import { User } from '../models/taskUser'
import jwt from 'jsonwebtoken'

const SECRET = "secret_key"


export const register = async (req: Request, res: Response) => {
    const { username, password } = req.body
    
    if(!username || !password){return res.status(400).json({message: "Nome de usuário e senha são obrigatórios"})}
    
    if(User.findByUsername(username)){return res.status(400).json({message: "Usuário já existe"})}
    const user = User.create(username, password)
    return res.status(201).json({id: user.id, username: user.username})
}

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body
    const user = User.findByUsername(username)
    
    if(!user || user.password !== password) return res.status(401).json({ message: "Credenciais inválidas" });
    const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "24h" });

    return res.json({ token })
}

export const getProfile = async (req: any, res: Response) => {
    const userId = req.userId
    const user = User.findById(userId)

    if(!user){return res.status(404).json({message: "Usuário não encontrado ou não existe"})}

    return res.json({id: user.id, username: user.username})
}