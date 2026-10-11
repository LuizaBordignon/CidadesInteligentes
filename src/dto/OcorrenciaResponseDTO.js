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
        this.data_criacao = ocorrenciaEntity.data_criacao;
    }
}