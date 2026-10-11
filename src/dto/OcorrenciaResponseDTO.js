// CAMADA: DTO
// RESPONSABILIDADE: Definir o formato dos dados da ocorrência que serão devolvidos na resposta da API.
// REGRAS: Ocultar dados internos desnecessários e expor apenas o que o cliente pode ver.
// ROTAS ATENDIDAS: POST /ocorrencias, GET /ocorrencias, GET /ocorrencias/:id, PATCH /ocorrencias/:id/status
// SITUAÇÃO: implementada.

export class OcorrenciaResponseDTO {
  constructor(ocorrenciaEntity) {
    this.id = ocorrenciaEntity.id;
    this.titulo = ocorrenciaEntity.titulo;
    this.descricao = ocorrenciaEntity.descricao;
    this.endereco = ocorrenciaEntity.endereco;
    this.status = ocorrenciaEntity.status;
    this.data_criacao = ocorrenciaEntity.data_criacao;
    this.categoria_id = ocorrenciaEntity.categoria_id;

    // A categoria só vem preenchida quando a consulta carregou a relação (listar e buscarPorId).
    if (ocorrenciaEntity.categoria) {
      this.categoria = {
        id: ocorrenciaEntity.categoria.id,
        nome: ocorrenciaEntity.categoria.nome,
      };
    }
  }
}