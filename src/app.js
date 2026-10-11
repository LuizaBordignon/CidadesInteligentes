import express from "express";

import categoriaController from "./controller/CategoriaController.js";
import { ApiExceptionHandler } from "./controller/ApiExceptionHandler.js";
import { AppDataSource } from "./config/datasource.js"; 
import { CategoriaService } from "./service/CategoriaService.js";

import { OcorrenciaRepository } from './repository/OcorrenciaRepository.js';
import { OcorrenciaMapper } from './mapper/OcorrenciaMapper.js';
import { OcorrenciaService } from './service/OcorrenciaService.js';
import { OcorrenciaController } from './controller/OcorrenciaController.js';

const app = express();

app.use(express.json());

// Rota de teste simples
app.get("/", (req, res) => {
  res.json({ mensagem: "API do Cidades Inteligentes rodando com sucesso! 🚀" });
});

// Rotas da Pessoa 1
app.use("/categorias", categoriaController);

// Instanciação das dependências
const categoriaService = new CategoriaService();

const ocorrenciaRepository = new OcorrenciaRepository(AppDataSource);
const ocorrenciaMapper = new OcorrenciaMapper();
const ocorrenciaService = new OcorrenciaService(
  ocorrenciaRepository,
  ocorrenciaMapper,
  categoriaService 
);
const ocorrenciaController = new OcorrenciaController(ocorrenciaService);

// Registra as rotas da Ocorrência
app.use('/ocorrencias', ocorrenciaController.router);

// Central de erros sempre por último
app.use(ApiExceptionHandler);

export default app;