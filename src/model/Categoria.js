// CAMADA: Model
// RESPONSABILIDADE: Descrever a estrutura da tabela de categorias no banco de dados.
// REGRAS: Nenhuma regra de negócio nesta classe, apenas mapeamento de dados.
// ROTAS ATENDIDAS: Nenhuma diretamente.
// SITUAÇÃO: implementada.

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