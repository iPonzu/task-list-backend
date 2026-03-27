import express from "express";
import router from "./routes/routes";
import { connectiondb } from "./database/database";

export const app = express();
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.method, req.url, req.body);
  next();
});

app.get("/", (_, res) => res.send("API rodando!"));

app.use("/", router);

connectiondb().then(() => {
  if (process.env.NODE_ENV !== "test") {
    app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
  }
});
