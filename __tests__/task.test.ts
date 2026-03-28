import request from "supertest";
import { app } from "../src/server";
import {
  token,
  baseListId,
  connectTestDB,
  clearTestDB,
  createTestUserAndAuth,
  disconnectTestDB,
} from "../src/test-utils/setupTest";

let createdTaskId: string;

beforeAll(async () => {
  await connectTestDB();
  await clearTestDB();
  await createTestUserAndAuth();
});

afterAll(async () => {
  await disconnectTestDB();
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

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Título da tarefa é obrigatório");
  });

  it("Deve buscar todas as tarefas do usuário", async () => {
    const res = await request(app)
      .get("/tasks")
      .set("Authorization", token);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("Deve buscar tarefa por ID", async () => {
    const res = await request(app)
      .get(`/tasks/${createdTaskId}`)
      .set("Authorization", token);

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

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Tarefa Atualizada");
  });

  it("Deve deletar tarefa", async () => {
    const res = await request(app)
      .delete(`/tasks/${createdTaskId}`)
      .set("Authorization", token);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Tarefa deletada");
  });

  it("Não deve encontrar tarefa deletada", async () => {
    const res = await request(app)
      .get(`/tasks/${createdTaskId}`)
      .set("Authorization", token);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Tarefa não encontrada");
  });
});