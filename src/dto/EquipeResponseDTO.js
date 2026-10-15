// CAMADA: DTO
// RESPONSABILIDADE: Definir o formato dos dados da equipe devolvidos na resposta da API.
// REGRAS: Expor apenas o que o cliente pode ver.
// ROTAS ATENDIDAS: POST /equipes, GET /equipes, GET /equipes/:id (planejadas).
// SITUAÇÃO: implementada.

export class EquipeResponseDTO {
    constructor(equipeEntity) {
        this.id = equipeEntity.id;
        this.nome = equipeEntity.nome;
        this.descricao = equipeEntity.descricao;
    }
}