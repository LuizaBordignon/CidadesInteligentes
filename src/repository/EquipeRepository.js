// CAMADA: Repository
// RESPONSABILIDADE: Comunicar-se com o banco de dados para salvar e buscar equipes.
// REGRAS: Nenhuma regra de negócio nesta classe, apenas acesso a dados.
// ROTAS ATENDIDAS: Nenhuma diretamente.
// SITUAÇÃO: implementada.

export class EquipeRepository {
    constructor(dataSource) {
        this.repository = dataSource.getRepository("Equipe");
    }

    async criar(equipeData) {
        const equipe = this.repository.create(equipeData);
        return await this.repository.save(equipe);
    }

    async listar() {
        return await this.repository.find();
    }

    async buscarPorId(id) {
        return await this.repository.findOneBy({ id });
    }

    async buscarPorNome(nome) {
        return await this.repository.findOneBy({ nome });
    }
}