import request from "supertest";
import { app } from "../src/server";
import {
  token,
  connectTestDB,
  clearTestDB,
  createTestUserAndAuth,
  disconnectTestDB,
} from "../src/test-utils/setupTest";

let newListId: string;

beforeAll(async () => {
  await connectTestDB();
  await clearTestDB();
  await createTestUserAndAuth();
});

afterAll(async () => {
  await disconnectTestDB();
});

describe("API Lists - Testes Funcionais", () => {
  const uniqueListTitle = `Nova Lista ${Date.now()}`;
  const updatedListTitle = `Lista Atualizada ${Date.now()}`;

  it("Deve criar uma lista com sucesso", async () => {
    const res = await request(app)
      .post("/lists")
      .set("Authorization", token)
      .send({
        title: uniqueListTitle,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.title).toBe(uniqueListTitle);

    newListId = res.body._id;
  });

  it("Deve buscar todas as listas do usuário", async () => {
    const res = await request(app)
      .get("/lists")
      .set("Authorization", token);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("Deve buscar lista por ID", async () => {
    expect(newListId).toBeDefined();

    const res = await request(app)
      .get(`/lists/${newListId}`)
      .set("Authorization", token);

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

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe(updatedListTitle);
  });

  it("Deve deletar lista", async () => {
    expect(newListId).toBeDefined();

    const res = await request(app)
      .delete(`/lists/${newListId}`)
      .set("Authorization", token);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Lista deletada");
  });

  it("Não deve encontrar lista deletada", async () => {
    expect(newListId).toBeDefined();

    const res = await request(app)
      .get(`/lists/${newListId}`)
      .set("Authorization", token);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Lista não encontrada");
  });
});