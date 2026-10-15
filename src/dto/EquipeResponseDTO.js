export class EquipeResponseDTO {
    constructor(equipeEntity) {
        this.id = equipeEntity.id;
        this.nome = equipeEntity.nome;
        this.descricao = equipeEntity.descricao;
    }
}