import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { app } from "../src/server";
import { Task } from "../src/models/taskModels";
import { List } from "../src/models/taskList";
import { User, IUser } from "../src/models/taskUser";

let token: string;
let userId: string;
let listId: string;
let taskId: string;

beforeAll(async () => {
  await mongoose.connect("mongodb+srv://admin:wearebrext@brext-teste.xfeveeo.mongodb.net/?retryWrites=true&w=majority&appName=brext-teste");

  const user = (await User.create({ username: "testuser", password: "123456" })) as IUser;
  userId = user.id;

  token = "Bearer " + jwt.sign({ id: userId }, "secret_key", { expiresIn: "1h" });

  const list = await List.create({ name: "Lista Teste", user: userId });
  listId = list.id;
});

afterAll(async () => {
  await Task.deleteMany({});
  await List.deleteMany({});
  await User.deleteMany({});
  await mongoose.disconnect();
});

describe("API Tasks - Testes Funcionais", () => {
  it("Deve criar uma tarefa com sucesso", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", token)
      .send({
        title: "Nova Tarefa",
        description: "Descrição teste",
        listId: listId,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Nova Tarefa");
    taskId = res.body._id;
  });

  it("Não deve criar tarefa sem título", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", token)
      .send({ listId });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Título da tarefa é obrigatório");
  });

  it("Deve buscar todas as tarefas do usuário", async () => {
    const res = await request(app)
      .get("/api/tasks")
      .set("Authorization", token);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("Deve buscar tarefa por ID", async () => {
    const res = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set("Authorization", token);

    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(taskId);
  });

  it("Deve atualizar tarefa", async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set("Authorization", token)
      .send({ title: "Tarefa Atualizada" });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Tarefa Atualizada");
  });

  it("Deve deletar tarefa", async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set("Authorization", token);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Tarefa deletada");
  });

  it("Não deve encontrar tarefa deletada", async () => {
    const res = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set("Authorization", token);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Tarefa não encontrada");
  });
});
