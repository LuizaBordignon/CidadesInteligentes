import { EntitySchema } from "typeorm";

export const CategoriaSchema = new EntitySchema({
  name: "Categoria",
  tableName: "categorias",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    nome: {
      type: "varchar",
      nullable: false,
    },
  },
});