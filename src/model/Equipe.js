// CAMADA: Model
// RESPONSABILIDADE: Descrever a estrutura da tabela de equipes responsáveis no banco de dados.
// REGRAS: Nenhuma regra de negócio nesta classe, apenas mapeamento de dados.
// ROTAS ATENDIDAS: Nenhuma diretamente.
// SITUAÇÃO: implementada.

import { EntitySchema } from "typeorm";

export const EquipeSchema = new EntitySchema({
    name: "Equipe",
    tableName: "equipes",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true,
        },
        nome: {
            type: "varchar",
            length: 100,
            nullable: false,
            unique: true,
        },
        descricao: {
            type: "varchar",
            length: 255,
            nullable: true,
        },
    },
});