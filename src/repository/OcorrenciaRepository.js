// CAMADA: Repository
// RESPONSABILIDADE: Comunicar-se com o banco de dados para salvar e buscar ocorrências.
// REGRAS: Implementar a consulta para a regra R4 (verificar duplicidade de ocorrência aberta).
// ROTAS ATENDIDAS: Nenhuma diretamente.
// SITUAÇÃO: implementada.

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
      relations: ['categoria', 'equipe'],
    });
  }

  async listar() {
    return await this.repository.find({
      relations: ["categoria"]
    });
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