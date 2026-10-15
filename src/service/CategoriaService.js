// CAMADA: Service
// RESPONSABILIDADE: Conter as regras de negócio relacionadas às categorias.
// REGRAS: Impedir cadastro de categorias com nomes duplicados.
// ROTAS ATENDIDAS: /categorias
// SITUAÇÃO: implementada.

import { CategoriaNaoEncontradaError } from "./CategoriaNaoEncontradaError.js";
import { RegraDeNegocioError } from "./RegraDeNegocioError.js";

export class CategoriaService {
  constructor(categoriaRepository, categoriaMapper) {
    this.categoriaRepository = categoriaRepository;
    this.categoriaMapper = categoriaMapper;
  }

  async criar(data) {
    // Exemplo de regra de negócio: verificar se já existe uma categoria com o mesmo nome
    const existente = await this.categoriaRepository.buscarPorNome(data.nome);
    if (existente) {
      throw new RegraDeNegocioError("Já existe uma categoria cadastrada com este nome.");
    }

    const salva = await this.categoriaRepository.criar(data);
    return this.categoriaMapper.toResponse(salva);
  }

  async listar() {
    const categorias = await this.categoriaRepository.listar();
    return this.categoriaMapper.toResponseList(categorias);
  }

  async buscarPorId(id) {
    const categoria = await this.categoriaRepository.buscarPorId(id);
    if (!categoria) {
      throw new CategoriaNaoEncontradaError(id);
    }
    return this.categoriaMapper.toResponse(categoria);
  }
}
