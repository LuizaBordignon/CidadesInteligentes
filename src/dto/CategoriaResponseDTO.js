// CAMADA: DTO
// RESPONSABILIDADE: Definir o formato dos dados de categoria devolvidos pela API.
// REGRAS: Nenhuma.
// ROTAS ATENDIDAS: /categorias
// SITUAÇÃO: implementada.

export class CategoriaResponseDTO {
  constructor(categoria) {
    this.id = categoria.id;
    this.nome = categoria.nome;
  }
}