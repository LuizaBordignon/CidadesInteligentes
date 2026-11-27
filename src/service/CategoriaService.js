// CAMADA: Service
// RESPONSABILIDADE: Conter as regras de negócio relacionadas às categorias.
// REGRAS: Impedir nomes duplicados e impedir a exclusão de categoria que possui ocorrências.
// ROTAS ATENDIDAS: /categorias
// SITUAÇÃO: implementada.

import { CategoriaNaoEncontradaError } from "./CategoriaNaoEncontradaError.js";
import { RegraDeNegocioError } from "./RegraDeNegocioError.js";
import { PaginaDTO } from "../dto/PaginacaoDTO.js";
import { logger as loggerPadrao } from "../config/logger.js";

export class CategoriaService {
  constructor(categoriaRepository, categoriaMapper, logger = loggerPadrao) {
    this.categoriaRepository = categoriaRepository;
    this.categoriaMapper = categoriaMapper;
    this.logger = logger;
  }

  async criar(data) {
    // Exemplo de regra de negócio: verificar se já existe uma categoria com o mesmo nome
    const existente = await this.categoriaRepository.buscarPorNome(data.nome);
    if (existente) {
      this.logger.warn({ nome: data.nome }, "Categoria duplicada: criação recusada");
      throw new RegraDeNegocioError("Já existe uma categoria cadastrada com este nome.");
    }

    const salva = await this.categoriaRepository.criar(data);
    this.logger.info({ categoriaId: salva.id }, "Categoria criada");
    return this.categoriaMapper.toResponse(salva);
  }

  async listar(filtros) {
    const { itens, total } = await this.categoriaRepository.listar(filtros);
    return new PaginaDTO(this.categoriaMapper.toResponseList(itens), total, filtros.page, filtros.limit);
  }

  async buscarPorId(id) {
    const categoria = await this.categoriaRepository.buscarPorId(id);
    if (!categoria) {
      throw new CategoriaNaoEncontradaError(id);
    }
    return this.categoriaMapper.toResponse(categoria);
  }

  async atualizar(id, data) {
    const categoria = await this.categoriaRepository.buscarPorId(id);
    if (!categoria) {
      this.logger.warn({ categoriaId: id }, "Categoria não encontrada para atualização");
      throw new CategoriaNaoEncontradaError(id);
    }

    const existente = await this.categoriaRepository.buscarPorNome(data.nome);
    if (existente && existente.id !== id) {
      this.logger.warn({ categoriaId: id, nome: data.nome }, "Categoria duplicada: atualização recusada");
      throw new RegraDeNegocioError("Já existe uma categoria cadastrada com este nome.");
    }

    categoria.nome = data.nome;
    const salva = await this.categoriaRepository.salvar(categoria);
    this.logger.info({ categoriaId: id }, "Categoria atualizada");
    return this.categoriaMapper.toResponse(salva);
  }

  async remover(id) {
    const categoria = await this.categoriaRepository.buscarPorId(id);
    if (!categoria) {
      this.logger.warn({ categoriaId: id }, "Categoria não encontrada para exclusão");
      throw new CategoriaNaoEncontradaError(id);
    }

    const ocorrencias = await this.categoriaRepository.contarOcorrencias(id);
    if (ocorrencias > 0) {
      this.logger.warn({ categoriaId: id, ocorrencias }, "Exclusão recusada: categoria possui ocorrências");
      throw new RegraDeNegocioError("Não é possível excluir uma categoria que possui ocorrências.");
    }

    await this.categoriaRepository.remover(id);
    this.logger.info({ categoriaId: id }, "Categoria excluída");
  }
}
