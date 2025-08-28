import express, { Router } from "express"
import { register, login, getProfile } from '../controllers/authController'
import { createTask, getTasks, updateTask, getTaskById, deleteTask } from '../controllers/taskController'
import { createList, getLists, getListsById, updateList, deleteList } from '../controllers/listController'
import { auth } from "../middleware/auth"

const router = Router()

router.post("/register", register)
router.post("/login", login)
router.get("/auth/profile", auth, getProfile)

router.post("/tasks", auth, createTask)
router.get("/tasks", auth, getTasks)
router.get("/tasks/:id", auth, getTaskById)
router.put("/tasks/:id", auth, updateTask)
router.delete("/tasks/:id", auth, deleteTask)

router.post("/lists", auth, createList)
router.get("/lists", auth, getLists)
router.get("/lists/:id", auth, getListsById)
router.put("/lists/:id", auth, updateList)
router.delete("/lists/:id", auth, deleteList)

export default router
