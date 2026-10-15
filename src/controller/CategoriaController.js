// CAMADA: Controller
// RESPONSABILIDADE: Gerenciar os endpoints HTTP para o recurso de categorias.
// REGRAS: Validação de entrada via Zod e tratamento de erros via next().
// ROTAS ATENDIDAS: POST /categorias, GET /categorias, GET /categorias/:id
// SITUAÇÃO: implementada.

import { Router } from "express";
import { CategoriaRequestSchema, CategoriaIdSchema } from "../dto/CategoriaRequestDTO.js";

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
        const categorias = await this.categoriaService.listar();
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
  }
}
