import { CategoriaRepository } from "../repository/CategoriaRepository.js";
import { CategoriaNaoEncontradaError } from "./CategoriaNaoEncontradaError.js";
import { CategoriaMapper } from "../mapper/CategoriaMapper.js";
import { RegraDeNegocioError } from "./RegraDeNegocioError.js";

export class CategoriaService {
  async criar(data) {
    // Exemplo de regra de negócio: verificar se já existe uma categoria com o mesmo nome
    const existente = await CategoriaRepository.findOneBy({ nome: data.nome });
    if (existente) {
      throw new RegraDeNegocioError("Já existe uma categoria cadastrada com este nome.");
    }

    const novaCategoria = CategoriaRepository.create(data);
    const salva = await CategoriaRepository.save(novaCategoria);
    return CategoriaMapper.toResponse(salva);
  }

  async listar() {
    const categorias = await CategoriaRepository.find();
    return CategoriaMapper.toResponseList(categorias);
  }

  async buscarPorId(id) {
    const categoria = await CategoriaRepository.findOneBy({ id: Number(id) });
    if (!categoria) {
      throw new CategoriaNaoEncontradaError(id);
    }
    return CategoriaMapper.toResponse(categoria);
  }
}