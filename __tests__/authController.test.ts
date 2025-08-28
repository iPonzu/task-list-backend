// import request from "supertest";
// import { app } from "../src/index";

// describe("Teste de autenticação - Registro e Login", () => {


//     it("Deve registrar um novo usuário", async () => {
//         const res = await request(app)
//         .post("/auth/register")
//         .send({ username: "joao", password: "1234" });

//         expect(res.status).toBe(201);
//         expect(res.body.username).toBe("joao");
//         expect(res.body.id).toBeDefined();
//     });

//     it("Não deve registrar um usuário com username já existente", async () => {
//         const res = await request(app)
//         .post("/auth/register")
//         .send({ username: "joao", password: "1234" });

//         expect(res.status).toBe(409);
//         expect(res.body.error).toBe("Usuário já existe");
//     })

//     it("Deve fazer login com usuário válido", async () => {
//         const res = await request(app)
//         .post("/auth/login")
//         .send({ username: "joao", password: "1234" });

//         expect(res.status).toBe(401);
//         expect(res.body.username).toBe("joao");
//         expect(res.body.id).toBeDefined();
//     })

//     it("Deve logar usuário existente e retornar token", async () => {
//     await request(app).post("/auth/register")
//     .send({ username: "maria", password: "abcdef" });
//     const res = await request(app)
//     .post("/auth/login").send({ username: "maria", password: "abcdef" });

//     expect(res.status).toBe(200);
//     expect(res.body.token).toBeDefined();
//   })

//     it("Não deve logar usuário com credenciais inválidas", async () => {
//         const res = await request(app).post("/auth/login")
//         .send({username: "pedro", password: "wrong"});

//         expect(res.status).toBe(404);
//         expect(res.body.error).toBe("Credenciais inválidas");
//     })

//     it("Deve acessar perfil autenticado", async () => {
//         await request (app).post("/auth/register").send({ username: "maria", password: "1234" })
//         const loginRes = await request(app).post("/auth/login").send({ username: "maria", password: "1234" })
//         const token = loginRes.body.token;
        
//         const res = await request(app)
//         .get("auth/profile")
//         .set("Authorization", `Bearer ${token}`)

//         expect(res.status).toBe(200);
//         expect(res.body.username).toBe("maria");
//     })

//     it("Não deve acessar perfil sem token", async () => {
//         const res = await request(app).get("auth/profile").set("Authorization", "Bearer invalidtoken")

//         expect(res.status).toBe(401);
//         expect(res.body.error).toBe("Token inválido");
//     })
// })