// CAMADA: DTO
// RESPONSABILIDADE: Definir o formato padrão da resposta de erro da API.
// REGRAS: Nenhuma.
// ROTAS ATENDIDAS: Nenhuma diretamente (usado pelo ApiExceptionHandler).
// SITUAÇÃO: implementada.

export class ErroDTO {
  constructor(status, error, message, path, fields = null) {
    this.timestamp = new Date().toISOString();
    this.status = status;
    this.error = error;
    this.message = message;
    this.path = path;
    if (fields) {
      this.fields = fields;
    }
  }
}