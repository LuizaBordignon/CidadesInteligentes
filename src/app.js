import express from "express";

import categoriaController from "./controller/CategoriaController.js";
import { ApiExceptionHandler } from "./controller/ApiExceptionHandler.js";
import { AppDataSource } from "./config/datasource.js";
import { CategoriaService } from "./service/CategoriaService.js";

import { EquipeRepository } from "./repository/EquipeRepository.js";
import { EquipeMapper } from "./mapper/EquipeMapper.js";
import { EquipeService } from "./service/EquipeService.js";
import { EquipeController } from "./controller/EquipeController.js";

import { OcorrenciaRepository } from './repository/OcorrenciaRepository.js';
import { OcorrenciaMapper } from './mapper/OcorrenciaMapper.js';
import { OcorrenciaService } from './service/OcorrenciaService.js';
import { OcorrenciaController } from './controller/OcorrenciaController.js';
import swaggerUi from "swagger-ui-express";
import { openapi } from "./docs/openapi.js";

const app = express();

app.use(express.json());

app.get("/api-docs.json", (req, res) => res.json(openapi));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapi));

// Rota de teste simples
app.get("/", (req, res) => {
    res.json({ mensagem: "API do Cidades Inteligentes rodando com sucesso! 🚀" });
});

// ===== CATEGORIA =====
app.use("/categorias", categoriaController);
const categoriaService = new CategoriaService();

// ===== EQUIPE (montada: sem rotas ativas nesta etapa) =====
const equipeRepository = new EquipeRepository(AppDataSource);
const equipeMapper = new EquipeMapper();
const equipeService = new EquipeService(equipeRepository, equipeMapper);
const equipeController = new EquipeController(equipeService);
app.use("/equipes", equipeController.router);

// ===== OCORRENCIA =====
const ocorrenciaRepository = new OcorrenciaRepository(AppDataSource);
const ocorrenciaMapper = new OcorrenciaMapper();
const ocorrenciaService = new OcorrenciaService(
    ocorrenciaRepository,
    ocorrenciaMapper,
    categoriaService
);
const ocorrenciaController = new OcorrenciaController(ocorrenciaService);
app.use('/ocorrencias', ocorrenciaController.router);

// Central de erros sempre por último
app.use(ApiExceptionHandler);

export default app;