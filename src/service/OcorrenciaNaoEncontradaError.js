import { RecursoNaoEncontradoError } from "./RecursoNaoEncontradoError.js";

export class CategoriaNaoEncontradaError extends RecursoNaoEncontradoError {
    constructor(id) {
        super(`Categoria com ID ${id} não encontrada.`);
        this.name = "CategoriaNaoEncontradaError";
    }
}