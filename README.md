# API de Gestão de Tarefas

API desenvolvida em **Node.js**, **Express**, **TypeScript** e **MongoDB** para gerenciamento de usuários, listas e tarefas. 
Foi extremamente gratificante poder ter a oportunidade de apresentar meus conhecimentos em forma de projeto. 
Apesar dos tropeços pelo caminho, utilizar ferramentas novas é com certeza uma forma de inovação!

---

## Índice

* [Tecnologias](#tecnologias)
* [Instalação](#instalação)
* [Estrutura de Pastas](#estrutura-de-pastas)
* [Diagrama de Arquitetura](#diagrama-de-arquitetura)
* [Diagrama ER](#diagrama-er)
* [Autenticação](#autenticação)
* [Rotas da API](#rotas-da-api)
* [Testes](#testes)

---

## Tecnologias

* Node.js
* Express
* TypeScript
* MongoDB / Mongoose
* JWT para autenticação
* Jest + Supertest para testes

---

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/tasklist.git
cd tasklist
```

2. Instale as dependências:

```bash
npm install
```

3. Crie um arquivo `.env` na raiz com as variáveis:

```env
MONGO_URI=mongodb+srv://admin:wearebrext@brext-teste.xfeveeo.mongodb.net/?retryWrites=true&w=majority&appName=brext-teste
```

4. Rodando a aplicação:

```bash
npm run dev
```

A API será executada em `http://localhost:3000/`.

---

## Estrutura de Pastas

```
src/
│
├─ controllers/       # Lógica de manipulação de rotas
│   ├─ taskController.ts
│   ├─ listController.ts
│   └─ userController.ts
│
├─ database/          # Conexão com MongoDB
│   └─ database.ts
│
├─ models/            # Modelos Mongoose
│   ├─ taskModels.ts
│   ├─ taskList.ts
│   └─ taskUser.ts
│
├─ routes/            # Rotas da aplicação
│   └─ routes.ts
│
├─ __tests__/         # Testes unitários e integração
│
├─ server.ts          # Servidor Express
```

---

## Diagrama de Arquitetura

```
[Client (Postman/Front-end)]
            |
            v
      [Express Router]
            |
            v
     [Controllers Layer]
            |
            v
      [Services / Models]
            |
            v
       [MongoDB Database]
```

* **Controllers:** Recebem requisições, validam e chamam models.
* **Models:** Representam coleções no MongoDB.
* **Database:** Persistência de dados usando Mongoose.

---

## Diagrama ER (MongoDB)

```
User
-----
_id: ObjectId
username: string
password: string

List
-----
_id: ObjectId
name: string
user: ObjectId (referência User)

Task
-----
_id: ObjectId
title: string
description: string
status: string
dueDate: Date
user: ObjectId (referência User)
list: ObjectId (referência List)
```

---

## Fluxo de Autenticação

1. Usuário realiza **login** enviando username e password.
2. O servidor gera um **JWT** assinado com `JWT_SECRET`.
3. Todas as requisições protegidas devem incluir o token no header:

```
Authorization: Bearer <TOKEN>
```

4. Middleware verifica token, decodifica e injeta `req.userId`.

---

## Rotas da API

### Usuários

| Método | Rota       | Descrição           | Body                   |
| ------ | ---------- | ------------------- | ---------------------- |
| POST   | /api/register | Criar usuário       | { username, password } |
| POST   | /api/login | Login e gerar token | { username, password } |

### Listas

| Método | Rota            | Descrição              | Body     |
| ------ | --------------- | ---------------------- | -------- |
| POST   | /api/lists      | Criar lista            | { name } |
| GET    | /api/lists      | Buscar todas as listas | -        |
| GET    | /api/lists/:id | Buscar lista por ID    | -        |
| PUT    | /api/lists/:id | Atualizar lista        | { name } |
| DELETE | /api/lists/:id | Deletar lista          | -        |

### Tarefas

| Método | Rota            | Descrição            | Body                                                 |
| ------ | --------------- | -------------------- | ---------------------------------------------------- |
| POST   | /api/tasks      | Criar tarefa         | { title, description?, status?, dueDate?, listId? }  |
| GET    | /api/tasks      | Buscar tarefas       | query: status?, dueDate?, listId?                    |
| GET    | /api/tasks/:id | Buscar tarefa por ID | -                                                    |
| PUT    | /api/tasks/:id | Atualizar tarefa     | { title?, description?, status?, dueDate?, listId? } |
| DELETE | /api/tasks/:id | Deletar tarefa       | -                                                    |

> Todas as rotas protegidas exigem `Authorization: Bearer <TOKEN>`.

---

## Testes

* Execute os testes com:

```bash
npm run test
```

* A pasta `__tests__` contém testes unitários e de integração usando **Jest** e **Supertest**.
* Abrange:

  * Criação de tarefas
  * Criação de listas
  * Atualização, exclusão e validação de erros
  * Autenticação e validação de tokens

---

## Observações

* Sempre valide datas enviadas para a API (`yyyy-mm-dd`) para evitar erros de conversão.
* Se quiser usar MongoDB Atlas, adicione seu IP na whitelist.
* Para desenvolvimento, recomenda-se usar `.env` com `MONGO_URI` e `JWT_SECRET` locais.

