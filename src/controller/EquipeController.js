// CAMADA: Controller
// RESPONSABILIDADE: Receber as requisições HTTP de equipes, repassar para o service e devolver a resposta.
// REGRAS: Nenhuma lógica de negócio; apenas validação de formato e roteamento.
// ROTAS ATENDIDAS: As rotas de /equipes (planejadas, ainda não declaradas).
// SITUAÇÃO: montada.

import { Router } from "express";

export class EquipeController {
    constructor(equipeService) {
        this.router = Router();
        this.equipeService = equipeService;
    }
}