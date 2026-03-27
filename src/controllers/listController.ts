import { Response } from "express";
import mongoose from "mongoose";
import { List } from "../models/taskList";

export const createList = async (req: any, res: Response) => {
  try {
    console.log("DEBUG createList - userId:", req.userId, "body:", req.body);

    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Nome da lista é obrigatório" });
    }

    const existingList = await List.findOne({
      title,
      user: req.userId,
    });

    console.log("DEBUG existingList:", existingList);

    if (existingList) {
      return res
        .status(400)
        .json({ message: "Você já tem uma lista com esse nome" });
    }

    const list = new List({
      title,
      user: req.userId,
    });

    console.log("DEBUG list before save:", list);

    await list.save();

    console.log("DEBUG list saved:", list);

    return res.status(201).json(list);
  } catch (err: any) {
    console.error("DEBUG createList error FULL:", err);
    console.error("DEBUG createList error message:", err?.message);
    console.error("DEBUG createList error stack:", err?.stack);

    return res.status(500).json({
      message: "Erro ao criar lista",
      error: err?.message || err,
    });
  }
};

export const getLists = async (req: any, res: Response) => {
  try {
    const lists = await List.find({ user: req.userId });
    return res.status(200).json(lists);
  } catch (err: any) {
    console.error("DEBUG getLists error:", err);
    return res.status(500).json({
      message: "Erro ao buscar listas",
      error: err.message || err,
    });
  }
};

export const getListsById = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID da lista inválido" });
    }

    const list = await List.findOne({ _id: id, user: req.userId });

    if (!list) {
      return res.status(404).json({ message: "Lista não encontrada" });
    }

    return res.status(200).json(list);
  } catch (err: any) {
    console.error("DEBUG getListsById error:", err);
    return res.status(500).json({
      message: "Erro ao buscar lista",
      error: err.message || err,
    });
  }
};

export const updateList = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID da lista inválido" });
    }

    if (!title) {
      return res.status(400).json({ message: "Nome da lista é obrigatório" });
    }

    const existingList = await List.findOne({
      title,
      user: req.userId,
      _id: { $ne: id },
    });

    if (existingList) {
      return res
        .status(400)
        .json({ message: "Você já tem uma lista com esse nome" });
    }

    const updatedList = await List.findOneAndUpdate(
      { _id: id, user: req.userId },
      { title },
      { new: true }
    );

    if (!updatedList) {
      return res.status(404).json({ message: "Lista não encontrada" });
    }

    return res.status(200).json(updatedList);
  } catch (err: any) {
    console.error("DEBUG updateList error:", err);
    return res.status(500).json({
      message: "Erro ao atualizar lista",
      error: err.message || err,
    });
  }
};

export const deleteList = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID da lista inválido" });
    }

    const deletedList = await List.findOneAndDelete({
      _id: id,
      user: req.userId,
    });

    if (!deletedList) {
      return res.status(404).json({ message: "Lista não encontrada" });
    }

    return res.status(200).json({ message: "Lista deletada" });
  } catch (err: any) {
    console.error("DEBUG deleteList error:", err);
    return res.status(500).json({
      message: "Erro ao deletar lista",
      error: err.message || err,
    });
  }
};