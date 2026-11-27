// CAMADA: Repository
// RESPONSABILIDADE: Comunicar-se com o banco de dados para salvar e buscar ocorrências.
// REGRAS: Implementar a consulta para a regra R4 (verificar duplicidade de ocorrência aberta).
// ROTAS ATENDIDAS: Nenhuma diretamente.
// SITUAÇÃO: implementada.

import { ILike } from "typeorm";

export class OcorrenciaRepository {
  constructor(dataSource) {
    this.repository = dataSource.getRepository('Ocorrencia');
  }

  async criar(ocorrenciaData) {
    const ocorrencia = this.repository.create(ocorrenciaData);
    return await this.repository.save(ocorrencia);
  }

  async buscarPorId(id) {
    return await this.repository.findOne({
      where: { id },
      relations: ['categoria'],
    });
  }

  async listar({ status, categoria_id, endereco, page, limit, sort, order }) {
    const where = {};
    if (status) where.status = status;
    if (categoria_id) where.categoria_id = categoria_id;
    if (endereco) where.endereco = ILike(`%${endereco}%`);

    const [itens, total] = await this.repository.findAndCount({
      where,
      relations: ["categoria"],
      order: { [sort]: order },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { itens, total };
  }

  async remover(id) {
    await this.repository.delete({ id });
  }

  async contarPorStatus() {
    const linhas = await this.repository
      .createQueryBuilder("o")
      .select("o.status", "status")
      .addSelect("COUNT(*)", "total")
      .groupBy("o.status")
      .getRawMany();
    return linhas.map((l) => ({ status: l.status, total: Number(l.total) }));
  }

  async contarPorCategoria() {
    const linhas = await this.repository
      .createQueryBuilder("o")
      .innerJoin("o.categoria", "c")
      .select("c.id", "categoria_id")
      .addSelect("c.nome", "categoria")
      .addSelect("COUNT(*)", "total")
      .groupBy("c.id")
      .addGroupBy("c.nome")
      .orderBy("c.id", "ASC")
      .getRawMany();
    return linhas.map((l) => ({
      categoria_id: l.categoria_id,
      categoria: l.categoria,
      total: Number(l.total),
    }));
  }

  async buscarAbertaPorEnderecoECategoria(endereco, categoriaId) {
    const enderecoFormatado = endereco.trim().toLowerCase();

    const ocorrencias = await this.repository.find({
      where: {
        status: 'ABERTA',
        categoria_id: categoriaId,
      },
    });

    return ocorrencias.find(
      (occ) => occ.endereco.trim().toLowerCase() === enderecoFormatado
    );
  }

  async salvar(ocorrencia) {
    return await this.repository.save(ocorrencia);
  }
}