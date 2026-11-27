// CAMADA: Controller
// RESPONSABILIDADE: Receber as requisições HTTP, repassar para o service e devolver a resposta.
// REGRAS: O controller não tem lógica de negócio; apenas valida o formato da entrada, gerencia rotas e repassa erros para o handler.
// ROTAS ATENDIDAS: POST, GET, GET /estatisticas, GET /:id, PUT /:id, PATCH /:id/status e DELETE /:id de /ocorrencias.
// SITUAÇÃO: implementada.

import { Router } from "express";
import {
  OcorrenciaRequestSchema,
  OcorrenciaIdSchema,
  OcorrenciaStatusRequestSchema,
  OcorrenciaFiltroSchema,
} from "../dto/OcorrenciaRequestDTO.js";

export class OcorrenciaController {
  constructor(ocorrenciaService) {
    this.router = Router();
    this.ocorrenciaService = ocorrenciaService;
    this.configurarRotas();
  }

  configurarRotas() {
    this.router.post("/", async (req, res, next) => {
      try {
        const dadosValidados = OcorrenciaRequestSchema.parse(req.body);
        const novaOcorrencia = await this.ocorrenciaService.criar(dadosValidados);
        return res.status(201).json(novaOcorrencia);
      } catch (erro) {
        next(erro);
      }
    });

    this.router.get("/", async (req, res, next) => {
      try {
        const filtros = OcorrenciaFiltroSchema.parse(req.query);
        const ocorrencias = await this.ocorrenciaService.listar(filtros);
        return res.status(200).json(ocorrencias);
      } catch (erro) {
        next(erro);
      }
    });

    this.router.get("/estatisticas", async (req, res, next) => {
      try {
        return res.status(200).json(await this.ocorrenciaService.estatisticas());
      } catch (erro) {
        next(erro);
      }
    });

    this.router.get("/:id", async (req, res, next) => {
      try {
        const id = OcorrenciaIdSchema.parse(req.params.id);
        const ocorrencia = await this.ocorrenciaService.buscarPorId(id);
        return res.status(200).json(ocorrencia);
      } catch (erro) {
        next(erro);
      }
    });

    this.router.patch("/:id/status", async (req, res, next) => {
      try {
        const id = OcorrenciaIdSchema.parse(req.params.id);
        const { status } = OcorrenciaStatusRequestSchema.parse(req.body);
        const ocorrenciaAtualizada = await this.ocorrenciaService.atualizarStatus(id, status);
        return res.status(200).json(ocorrenciaAtualizada);
      } catch (erro) {
        next(erro);
      }
    });

    this.router.put("/:id", async (req, res, next) => {
      try {
        const id = OcorrenciaIdSchema.parse(req.params.id);
        const dadosValidados = OcorrenciaRequestSchema.parse(req.body);
        const atualizada = await this.ocorrenciaService.atualizar(id, dadosValidados);
        return res.status(200).json(atualizada);
      } catch (erro) {
        next(erro);
      }
    });

    this.router.delete("/:id", async (req, res, next) => {
      try {
        const id = OcorrenciaIdSchema.parse(req.params.id);
        await this.ocorrenciaService.remover(id);
        return res.status(204).send();
      } catch (erro) {
        next(erro);
      }
    });
  }
}
