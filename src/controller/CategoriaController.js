// CAMADA: Controller
// RESPONSABILIDADE: Gerenciar os endpoints HTTP para o recurso de categorias.
// REGRAS: Validação de entrada via Zod e tratamento de erros via next().
// ROTAS ATENDIDAS: POST /categorias, GET /categorias, GET /categorias/:id, PUT /categorias/:id, DELETE /categorias/:id
// SITUAÇÃO: implementada.

import { Router } from "express";
import { CategoriaRequestSchema, CategoriaIdSchema, CategoriaFiltroSchema } from "../dto/CategoriaRequestDTO.js";

export class CategoriaController {
  constructor(categoriaService) {
    this.router = Router();
    this.categoriaService = categoriaService;
    this.configurarRotas();
  }

  configurarRotas() {
    // POST /categorias
    this.router.post("/", async (req, res, next) => {
      try {
        // Valida os dados usando o Zod
        const dadosValidados = CategoriaRequestSchema.parse(req.body);
        const novaCategoria = await this.categoriaService.criar(dadosValidados);
        return res.status(201).json(novaCategoria);
      } catch (error) {
        next(error);
      }
    });

    // GET /categorias
    this.router.get("/", async (req, res, next) => {
      try {
        const filtros = CategoriaFiltroSchema.parse(req.query);
        const categorias = await this.categoriaService.listar(filtros);
        return res.json(categorias);
      } catch (error) {
        next(error);
      }
    });

    // GET /categorias/:id
    this.router.get("/:id", async (req, res, next) => {
      try {
        const id = CategoriaIdSchema.parse(req.params.id);
        const categoria = await this.categoriaService.buscarPorId(id);
        return res.json(categoria);
      } catch (error) {
        next(error);
      }
    });

    // PUT /categorias/:id
    this.router.put("/:id", async (req, res, next) => {
      try {
        const id = CategoriaIdSchema.parse(req.params.id);
        const dadosValidados = CategoriaRequestSchema.parse(req.body);
        const categoria = await this.categoriaService.atualizar(id, dadosValidados);
        return res.json(categoria);
      } catch (error) {
        next(error);
      }
    });

    // DELETE /categorias/:id
    this.router.delete("/:id", async (req, res, next) => {
      try {
        const id = CategoriaIdSchema.parse(req.params.id);
        await this.categoriaService.remover(id);
        return res.status(204).send();
      } catch (error) {
        next(error);
      }
    });
  }
}
