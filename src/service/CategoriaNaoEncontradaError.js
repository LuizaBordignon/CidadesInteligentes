// CAMADA: Service
// RESPONSABILIDADE: Representar o erro específico quando uma categoria não é encontrada (vira 404).
// REgrAS: Herda de RecursoNaoEncontradoError.
// ROTAS ATENDIDAS: Nenhuma diretamente.
// SITUAÇÃO: implementada.

import { RecursoNaoEncontradoError } from "./RecursoNaoEncontradoError.js";

export class CategoriaNaoEncontradaError extends RecursoNaoEncontradoError {
  constructor(id) {
    super(`Categoria com ID ${id} não encontrada.`);
    this.name = "CategoriaNaoEncontradaError";
  }
}