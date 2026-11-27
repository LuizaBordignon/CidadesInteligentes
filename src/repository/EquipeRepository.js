// CAMADA: Repository
// RESPONSABILIDADE: Comunicar-se com o banco de dados para salvar e buscar equipes.
// REGRAS: Nenhuma regra de negócio nesta classe, apenas acesso a dados.
// ROTAS ATENDIDAS: Nenhuma diretamente.
// SITUAÇÃO: implementada.

import { ILike } from "typeorm";

export class EquipeRepository {
    constructor(dataSource) {
        this.repository = dataSource.getRepository("Equipe");
    }

    async criar(equipeData) {
        const equipe = this.repository.create(equipeData);
        return await this.repository.save(equipe);
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

    async salvar(equipe) {
        return await this.repository.save(equipe);
    }

    async remover(id) {
        await this.repository.delete({ id });
    }

    async buscarPorId(id) {
        return await this.repository.findOneBy({ id });
    }

    async buscarPorNome(nome) {
        return await this.repository.findOneBy({ nome });
    }
}