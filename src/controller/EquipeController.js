// CAMADA: Controller
// RESPONSABILIDADE: Receber as requisições HTTP de equipes, repassar para o service e devolver a resposta.
// REGRAS: Nenhuma lógica de negócio; apenas validação de formato e roteamento.
// ROTAS ATENDIDAS: POST /equipes, GET /equipes, GET /equipes/:id, PUT /equipes/:id, DELETE /equipes/:id
// SITUAÇÃO: implementada.

import { Router } from "express";
import { EquipeRequestSchema, EquipeIdSchema, EquipeFiltroSchema } from "../dto/EquipeRequestDTO.js";

export class EquipeController {
    constructor(equipeService) {
        this.router = Router();
        this.equipeService = equipeService;
        this.configurarRotas();
    }

    configurarRotas() {
        this.router.post("/", async (req, res, next) => {
            try {
                const dados = EquipeRequestSchema.parse(req.body);
                return res.status(201).json(await this.equipeService.criar(dados));
            } catch (erro) {
                next(erro);
            }
        });

        this.router.get("/", async (req, res, next) => {
            try {
                const filtros = EquipeFiltroSchema.parse(req.query);
                return res.json(await this.equipeService.listar(filtros));
            } catch (erro) {
                next(erro);
            }
        });

        this.router.get("/:id", async (req, res, next) => {
            try {
                const id = EquipeIdSchema.parse(req.params.id);
                return res.json(await this.equipeService.buscarPorId(id));
            } catch (erro) {
                next(erro);
            }
        });

        this.router.put("/:id", async (req, res, next) => {
            try {
                const id = EquipeIdSchema.parse(req.params.id);
                const dados = EquipeRequestSchema.parse(req.body);
                return res.json(await this.equipeService.atualizar(id, dados));
            } catch (erro) {
                next(erro);
            }
        });

        this.router.delete("/:id", async (req, res, next) => {
            try {
                const id = EquipeIdSchema.parse(req.params.id);
                await this.equipeService.remover(id);
                return res.status(204).send();
            } catch (erro) {
                next(erro);
            }
        });
    }
}
