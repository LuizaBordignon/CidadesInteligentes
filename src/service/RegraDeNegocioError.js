export class RegraDeNegocioError extends Error {
  constructor(message) {
    super(message);
    this.name = "RegraDeNegocioError";
  }
}