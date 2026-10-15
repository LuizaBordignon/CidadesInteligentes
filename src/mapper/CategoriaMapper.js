// CAMADA: Mapper
// RESPONSABILIDADE: Converter instâncias de Categoria entre entidades de banco e DTOs de resposta.
// REGRAS: Nenhuma.
// ROTAS ATENDIDAS: /categorias
// SITUAÇÃO: implementada.

import { CategoriaResponseDTO } from "../dto/CategoriaResponseDTO.js";

export class CategoriaMapper {
  toResponse(categoria) {
    return new CategoriaResponseDTO(categoria);
  }

  toResponseList(categorias) {
    return categorias.map((cat) => new CategoriaResponseDTO(cat));
  }
}
