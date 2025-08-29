import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

const SECRET = "secret_key" 

export const auth = (req: any, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"]
    console.log("DEBUG authHeader:", authHeader);
  if(!authHeader) return res.status(401).json({ message: "Token não fornecido" })

  const token = authHeader.split(" ")[1];
  console.log("DEBUG token:", token);
  if(!token) return res.status(401).json({ message: "Token inválido" })

  try {
    const payload: any = jwt.verify(token, SECRET)
    console.log("DEBUG payload:", payload)
    req.userId = payload.id;
    next();
  } catch(err: any) {
    console.error("JWT verify error:", err.message)
    return res.status(401).json({ message: "Token inválido ou expirado" })
  }
};
