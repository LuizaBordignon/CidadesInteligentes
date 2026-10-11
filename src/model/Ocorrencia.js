// CAMADA: Model
// RESPONSABILIDADE: Descrever a estrutura da tabela de ocorrências no banco de dados.
// REGRAS: Nenhuma lógica de negócio aqui, apenas o mapeamento dos campos.
// ROTAS ATENDIDAS: Nenhuma diretamente.
// SITUAÇÃO: implementada.

import { EntitySchema } from 'typeorm';

export const OcorrenciaSchema = new EntitySchema({
  name: 'Ocorrencia',
  tableName: 'ocorrencias',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    titulo: {
      type: 'varchar',
      nullable: false,
    },
    descricao: {
      type: 'text',
      nullable: false,
    },
    endereco: {
      type: 'varchar',
      nullable: false,
    },
    status: {
      type: 'varchar',
      nullable: false,
    },
    data_criacao: {
      type: 'timestamp',
      createDate: true,
    },
    categoria_id: {
      type: 'int',
      nullable: false,
    },
  },
  relations: {
    categoria: {
      type: 'many-to-one',
      target: 'Categoria',
      joinColumn: { name: 'categoria_id' },
      nullable: false,
    },
  },
});