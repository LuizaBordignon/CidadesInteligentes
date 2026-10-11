import { CategoriaResponseDTO } from "../dto/CategoriaResponseDTO.js";

export class CategoriaMapper {
  static toResponse(categoria) {
    return new CategoriaResponseDTO(categoria);
  }

  static toResponseList(categorias) {
    return categorias.map((cat) => new CategoriaResponseDTO(cat));
  }
}