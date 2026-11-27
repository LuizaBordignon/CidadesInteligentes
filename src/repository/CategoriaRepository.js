// CAMADA: Repository
// RESPONSABILIDADE: Comunicar-se com o banco de dados para salvar e buscar categorias.
// REGRAS: Nenhuma regra de negócio nesta classe, apenas acesso a dados.
// ROTAS ATENDIDAS: Nenhuma diretamente.
// SITUAÇÃO: implementada.

import { ILike } from "typeorm";
import { CategoriaSchema } from "../model/Categoria.js";

export class CategoriaRepository {
  constructor(dataSource) {
    this.repository = dataSource.getRepository(CategoriaSchema);
    this.ocorrenciaRepository = dataSource.getRepository("Ocorrencia");
  }

  async criar(categoriaData) {
    const categoria = this.repository.create(categoriaData);
    return await this.repository.save(categoria);
  }

  async listar({ nome, page, limit, sort, order }) {
    const [itens, total] = await this.repository.findAndCount({
      where: nome ? { nome: ILike(`%${nome}%`) } : {},
      order: { [sort]: order },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { itens, total };
  }

  async salvar(categoria) {
    return await this.repository.save(categoria);
  }

  async remover(id) {
    await this.repository.delete({ id });
  }

  async contarOcorrencias(id) {
    return await this.ocorrenciaRepository.count({ where: { categoria_id: id } });
  }

  async buscarPorId(id) {
    return await this.repository.findOneBy({ id });
  }

  async buscarPorNome(nome) {
    return await this.repository.findOneBy({ nome });
  }
}
