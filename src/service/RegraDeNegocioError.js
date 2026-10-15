// CAMADA: Service
// RESPONSABILIDADE: Representar erros de violação de regras de negócio (gera status 400).
// REGRAS: Centralizar exceções de negócio.
// ROTAS ATENDIDAS: Nenhuma diretamente.
// SITUAÇÃO: implementada.

export class RegraDeNegocioError extends Error {
  constructor(message) {
    super(message);
    this.name = "RegraDeNegocioError";
  }
}