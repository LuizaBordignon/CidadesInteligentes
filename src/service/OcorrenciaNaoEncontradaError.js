// CAMADA: Service
// RESPONSABILIDADE: Personaliza o erro caso Ocorrencia não existir com respectivo Id.
// REGRAS: Nenhuma. Apenas representa o erro 404 de ocorrência inexistente
// ROTAS ATENDIDAS: As rotas de /ocorrencias.
// SITUAÇÃO: implementada.

import { RecursoNaoEncontradoError } from "./RecursoNaoEncontradoError.js";

export class OcorrenciaNaoEncontradaError extends RecursoNaoEncontradoError {
    constructor(id) {
        super(`Ocorrencia com ID ${id} não encontrada.`);
        this.name = "OcorrenciaNaoEncontradaError";
    }
}