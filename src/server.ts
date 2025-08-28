import express from "express";
import router from './routes/routes'

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.method, req.url, req.body);
  next();
});

app.get("/", (_, res) => res.send("API rodando! utilize /api/ para mais funcionalidades"));

app.use("/api", router);

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
