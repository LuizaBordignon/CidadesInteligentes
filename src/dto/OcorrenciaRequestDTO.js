// CAMADA: DTO
// RESPONSABILIDADE: Definir e validar o formato dos dados enviados pelo cliente ao criar uma ocorrência.
// REGRAS: Garantir que os campos obrigatórios venham preenchidos e que o status não seja enviado (regra R1).
// ROTAS ATENDIDAS: POST /ocorrencias
// SITUAÇÃO: implementada.

export class OcorrenciaRequestDTO {
    constructor(dados) {
        this.titulo = dados.titulo;
        this.descricao = dados.descricao;
        this.endereco = dados.endereco;
        this.categoria_id = dados.categoria_id;
    }

    validar() {
        if (!this.titulo || this.titulo.trim() === ''){
            throw new Error('O título é obrigatório.');
        }
        if (!this.descricao || this.descricao.trim() === ''){
            throw new Error('A descrição é obrigatória.');
        }
        if (!this.endereco || this.endereco.trim() === ''){
            throw new Error('O endereço é obrigatório.');
        }
        if (!this.categoria_id) {
            throw new Error('A categoria é obrigatória.');
        }
    }
}