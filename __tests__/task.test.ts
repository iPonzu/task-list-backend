import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { app } from "../src/server";
import { Task } from "../src/models/taskModels";
import { List } from "../src/models/taskList";
import { User } from "../src/models/taskUser";

let token: string;
let userId: string;
let baseListId: string;
let createdTaskId: string;

beforeAll(async () => {
  process.env.NODE_ENV = "test";

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(
      "mongodb+srv://ponzu:qRX9hAAIMBRKReND@dbtask.ec8ughh.mongodb.net/?appName=dbTask"
    );
  }

  await Task.deleteMany({});
  await List.deleteMany({});
  await User.deleteMany({});

  const uniqueUsername = `testuser_${Date.now()}`;

  const user = await User.create({
    username: uniqueUsername,
    password: "123456",
  });

  userId = (user as any)._id.toString();

  token =
    "Bearer " +
    jwt.sign({ id: userId }, "secret_key", { expiresIn: "1h" });

  const baseList = await List.create({
    title: `Lista Base ${Date.now()}`,
    user: userId,
  });

  baseListId = (baseList as any)._id.toString();
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
      .post("/tasks")
      .set("Authorization", token)
      .send({
        title: "Nova Tarefa",
        description: "Descrição teste",
        dueDate: "27/03/2026",
        listId: baseListId,
      });

    console.log("CREATE TASK STATUS:", res.statusCode);
    console.log("CREATE TASK BODY:", res.body);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.title).toBe("Nova Tarefa");
    expect(res.body.dueDate).toBe("27/03/2026");

    createdTaskId = res.body._id;
  });

  it("Não deve criar tarefa sem título", async () => {
    const res = await request(app)
      .post("/tasks")
      .set("Authorization", token)
      .send({
        description: "Sem título",
        listId: baseListId,
      });

    console.log("CREATE TASK WITHOUT TITLE STATUS:", res.statusCode);
    console.log("CREATE TASK WITHOUT TITLE BODY:", res.body);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Título da tarefa é obrigatório");
  });

  it("Deve buscar todas as tarefas do usuário", async () => {
    const res = await request(app)
      .get("/tasks")
      .set("Authorization", token);

    console.log("GET TASKS STATUS:", res.statusCode);
    console.log("GET TASKS BODY:", res.body);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("Deve buscar tarefa por ID", async () => {
    const res = await request(app)
      .get(`/tasks/${createdTaskId}`)
      .set("Authorization", token);

    console.log("GET TASK BY ID STATUS:", res.statusCode);
    console.log("GET TASK BY ID BODY:", res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(createdTaskId);
  });

  it("Deve atualizar tarefa", async () => {
    const res = await request(app)
      .put(`/tasks/${createdTaskId}`)
      .set("Authorization", token)
      .send({
        title: "Tarefa Atualizada",
      });

    console.log("UPDATE TASK STATUS:", res.statusCode);
    console.log("UPDATE TASK BODY:", res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Tarefa Atualizada");
  });

  it("Deve deletar tarefa", async () => {
    const res = await request(app)
      .delete(`/tasks/${createdTaskId}`)
      .set("Authorization", token);

    console.log("DELETE TASK STATUS:", res.statusCode);
    console.log("DELETE TASK BODY:", res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Tarefa deletada");
  });

  it("Não deve encontrar tarefa deletada", async () => {
    const res = await request(app)
      .get(`/tasks/${createdTaskId}`)
      .set("Authorization", token);

    console.log("GET DELETED TASK STATUS:", res.statusCode);
    console.log("GET DELETED TASK BODY:", res.body);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Tarefa não encontrada");
  });
});

describe("API Lists - Testes Funcionais", () => {
  let newListId: string;
  const uniqueListTitle = `Nova Lista ${Date.now()}`;
  const updatedListTitle = `Lista Atualizada ${Date.now()}`;

  it("Deve criar uma lista com sucesso", async () => {
    const res = await request(app)
      .post("/lists")
      .set("Authorization", token)
      .send({
        title: uniqueListTitle,
      });

    console.log("CREATE LIST STATUS:", res.statusCode);
    console.log("CREATE LIST BODY:", res.body);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.title).toBe(uniqueListTitle);

    newListId = res.body._id;
  });

  it("Deve buscar todas as listas do usuário", async () => {
    const res = await request(app)
      .get("/lists")
      .set("Authorization", token);

    console.log("GET LISTS STATUS:", res.statusCode);
    console.log("GET LISTS BODY:", res.body);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("Deve buscar lista por ID", async () => {
    expect(newListId).toBeDefined();

    const res = await request(app)
      .get(`/lists/${newListId}`)
      .set("Authorization", token);

    console.log("GET LIST BY ID STATUS:", res.statusCode);
    console.log("GET LIST BY ID BODY:", res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(newListId);
  });

  it("Deve atualizar lista", async () => {
    expect(newListId).toBeDefined();

    const res = await request(app)
      .put(`/lists/${newListId}`)
      .set("Authorization", token)
      .send({
        title: updatedListTitle,
      });

    console.log("UPDATE LIST STATUS:", res.statusCode);
    console.log("UPDATE LIST BODY:", res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe(updatedListTitle);
  });

  it("Deve deletar lista", async () => {
    expect(newListId).toBeDefined();

    const res = await request(app)
      .delete(`/lists/${newListId}`)
      .set("Authorization", token);

    console.log("DELETE LIST STATUS:", res.statusCode);
    console.log("DELETE LIST BODY:", res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Lista deletada");
  });

  it("Não deve encontrar lista deletada", async () => {
    expect(newListId).toBeDefined();

    const res = await request(app)
      .get(`/lists/${newListId}`)
      .set("Authorization", token);

    console.log("GET DELETED LIST STATUS:", res.statusCode);
    console.log("GET DELETED LIST BODY:", res.body);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Lista não encontrada");
  });
});