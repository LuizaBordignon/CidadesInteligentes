// CAMADA: Service
// RESPONSABILIDADE: Classe-mãe para erros de recursos não encontrados (gera status 404).
// REGRAS: Nenhuma.
// ROTAS ATENDIDAS: Nenhuma diretamente.
// SITUAÇÃO: implementada.

export class RecursoNaoEncontradoError extends Error {
  constructor(message) {
    super(message);
    this.name = "RecursoNaoEncontradoError";
  }
}

