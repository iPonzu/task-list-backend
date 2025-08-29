import { Request, Response } from "express"
import { Task } from "../models/taskModels"
import { List } from "../models/taskList"

export const createTask = async (req: any, res: Response) => {
  try {
    console.log("DEBUG createTask - userId:", req.userId, "body:", req.body);
    const { title, description, status, dueDate } = req.body;

    if (!title) return res.status(400).json({ message: "Título da tarefa é obrigatório" });

    let parsedDueDate: Date | undefined = undefined;
    if (dueDate) {
      const tempDate = new Date(dueDate);
      if (!isNaN(tempDate.getTime())) parsedDueDate = tempDate;
      else return res.status(400).json({ message: "Formato de dueDate inválido" });
    }

    const task = await Task.create({
      title,
      description: description || "",
      status: status || "pendente",
      dueDate: parsedDueDate,
      user: req.userId,
    });

    return res.status(201).json(task);

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
    if (dueDate) filters.dueDate = new Date(dueDate);
    if (listId) filters.list = listId;

    const tasks = await Task.find(filters);
    return res.json(tasks);
  } catch (err) {
    console.error("Erro em getTasks:", err);
    return res.status(500).json({ message: "Erro ao buscar tarefas", error: err });
  }
};

export const getTaskById = async (req: any, res: Response) => {
  console.log("DEBUG getTaskById - userId:", req.userId, "params:", req.params);
  try {
    const { id } = req.params;
    const task = await Task.findOne({ _id: id, user: req.userId });

    if (!task) return res.status(404).json({ message: "Tarefa não encontrada" });
    return res.json(task);
  } catch (err) {
    console.error("Erro em getTaskById:", err);
    return res.status(500).json({ message: "Erro ao buscar tarefa", error: err });
  }
};

export const updateTask = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, status } = req.body;

    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, user: req.userId },
      {
        title,
        description,
        status,
        dueDate: dueDate ? new Date(dueDate) : undefined,
      },
      { new: true }
    );

    if (!updatedTask) return res.status(404).json({ message: "Tarefa não encontrada" });
    return res.json(updatedTask);
  } catch (err) {
    console.error("Erro em updateTask:", err);
    return res.status(500).json({ message: "Erro ao atualizar tarefa", error: err });
  }
};

export const deleteTask = async (req: any, res: Response) => {
  console.log("DEBUG deleteTask - userId:", req.userId, "params:", req.params);
  try {
    const { id } = req.params;
    const deleteTask = await Task.findOneAndDelete({ _id: id, user: req.userId });

    if (!deleteTask) return res.status(404).json({ message: "Tarefa não encontrada" });
    return res.json({ message: "Tarefa deletada" });
  } catch (err) {
    console.error("Erro em deleteTask:", err);
    return res.status(500).json({ message: "Erro ao deletar tarefa", error: err });
  }
};
