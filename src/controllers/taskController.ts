import { Request, Response } from "express"
import mongoose from "mongoose"
import { Task } from "../models/taskModels"
import { List } from "../models/taskList"


const formatDate = (date?: Date | string | null): string | null => {
  if (!date) return null
  const parsedDate = date instanceof Date ? date : new Date(date)
  if (isNaN(parsedDate.getTime())) return null
  const day = String(parsedDate.getDate()).padStart(2, "0")
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0")
  const year = parsedDate.getFullYear()
  return `${day}/${month}/${year}`
}

const parseDueDate = (date?: string | Date | null): Date | null => {
  if (!date) return null
  if (date instanceof Date) return isNaN(date.getTime()) ? null : date

  const asString = date.trim()
  const ddmmyyyy = /^([0-3]\d)\/([0-1]\d)\/(\d{4})$/
  const match = asString.match(ddmmyyyy)
  if (match) {
    const day = Number(match[1])
    const month = Number(match[2])
    const year = Number(match[3])
    const parsed = new Date(year, month - 1, day)
    if (
      parsed.getFullYear() === year &&
      parsed.getMonth() === month - 1 &&
      parsed.getDate() === day
    ) {
      return parsed
    }
  }

  const standard = new Date(asString)
  if (!isNaN(standard.getTime())) return standard

  return null
}

const mapTask = (task: any) => {
  const taskObj = task.toObject ? task.toObject() : task
  return {
    ...taskObj,
    dueDate: taskObj.dueDate ? formatDate(taskObj.dueDate) : null,
  }
}
export const createTask = async (req: any, res: Response) => {
  try {
    console.log("DEBUG createTask - userId:", req.userId, "body:", req.body);
    const { title, description, status, dueDate, listId } = req.body;

    const existingTask = await Task.findOne({ title, user: req.userId });
    if (existingTask) return res.status(400).json({ message: "Você já tem uma tarefa com esse nome" });
    
    if (!title) return res.status(400).json({ message: "Título da tarefa é obrigatório" });

    const parsedDueDate = parseDueDate(dueDate)
    if (dueDate && !parsedDueDate) {
      return res.status(400).json({ message: "Formato de Data inválido" })
    }

    const task = await Task.create({
      title,
      description: description,
      status: status || "pendente",
      dueDate: parsedDueDate,
      user: req.userId,
    });

    const created = mapTask(task)
    console.log("DEBUG createdTask formatted:", created)

    return res.status(201).json(created);

  } catch (err: any) {
    console.error("Erro em createTask:", err);
    return res.status(500).json({ message: "Erro ao criar tarefa", error: err });
  }
}


export const getTasks = async (req: any, res: Response) => {
  console.log("DEBUG getTasks - userId:", req.userId, "query:", req.query);
  try {
    const { status, dueDate, listId } = req.query;

    const filters: any = { user: req.userId };
    if (status) filters.status = status;
    if (dueDate) {
      const parsed = parseDueDate(String(dueDate))
      if (!parsed) return res.status(400).json({ message: "Formato de Data inválido" })
      const nextDay = new Date(parsed)
      nextDay.setDate(nextDay.getDate() + 1)
      filters.dueDate = { $gte: parsed, $lt: nextDay }
    }
    if (listId) filters.list = listId;

    const tasks = await Task.find(filters);
    const tasksFormatted = tasks.map(mapTask);
    return res.json(tasksFormatted);
  } catch (err) {
    console.error("Erro em getTasks:", err);
    return res.status(500).json({ message: "Erro ao buscar tarefas", error: err });
  }
};

export const getTaskById = async (req: any, res: Response) => {
  console.log("DEBUG getTaskById - userId:", req.userId, "params:", req.params);
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID da tarefa inválido" });
    }
    
    const task = await Task.findOne({ _id: new mongoose.Types.ObjectId(id), user: req.userId });

    if (!task) return res.status(404).json({ message: "Tarefa não encontrada" });
    return res.json(mapTask(task));
  } catch (err) {
    console.error("Erro em getTaskById:", err);
    return res.status(500).json({ message: "Erro ao buscar tarefa", error: err });
  }
};

export const updateTask = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID da tarefa inválido" });
    }

    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, user: req.userId },
      {
        title,
        description,
        status,
        dueDate: dueDate ? parseDueDate(dueDate) : undefined,
      },
      { new: true }
    );

    if (!updatedTask) return res.status(404).json({ message: "Tarefa não encontrada" });
    return res.json(mapTask(updatedTask));
  } catch (err) {
    console.error("Erro em updateTask:", err);
    return res.status(500).json({ message: "Erro ao atualizar tarefa", error: err });
  }
};

export const deleteTask = async (req: any, res: Response) => {
  console.log("DEBUG deleteTask - userId:", req.userId, "params:", req.params);
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID da tarefa inválido" });
    }
    
    const deleteTask = await Task.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id), user: req.userId });

    if (!deleteTask) return res.status(404).json({ message: "Tarefa não encontrada" });
    return res.json({ message: "Tarefa deletada" });
  } catch (err) {
    console.error("Erro em deleteTask:", err);
    return res.status(500).json({ message: "Erro ao deletar tarefa", error: err });
  }
};
