export class RecursoNaoEncontradoError extends Error {
  constructor(message) {
    super(message);
    this.name = "RecursoNaoEncontradoError";
  }
}

