// CAMADA: Service
// RESPONSABILIDADE: Personaliza o erro caso Ocorrencia não existir com respectivo Id.
// REGRAS: Caso classe seja convocada, personaliza o erro 404 genérico
// ROTAS ATENDIDAS: As rotas de /ocorrencias.
// SITUAÇÃO: implementada.

import { RecursoNaoEncontradoError } from "./RecursoNaoEncontradoError.js";

export class OcorrenciaNaoEncontradaError extends RecursoNaoEncontradoError {
    constructor(id) {
        super(`Ocorrencia com ID ${id} não encontrada.`);
        this.name = "OcorrenciaNaoEncontradaError";
    }
}