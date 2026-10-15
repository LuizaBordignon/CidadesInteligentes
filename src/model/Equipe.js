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