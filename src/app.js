import express from "express";
import categoriaController from "./controller/CategoriaController.js";
import { ApiExceptionHandler } from "./controller/ApiExceptionHandler.js";

const app = express();

app.use(express.json());

// Rota de teste simples para ver se a API está viva
app.get("/", (req, res) => {
  res.json({ mensagem: "API do Cidades Inteligentes rodando com sucesso! 🚀" });
});

app.use("/categorias",categoriaController);

app.use(ApiExceptionHandler);

export default app;