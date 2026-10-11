// CAMADA: Migration
// RESPONSABILIDADE: Criar a tabela de equipes responsáveis, referenciada por ocorrencias.equipe_id.
// REGRAS: Nenhuma lógica de negócio aqui, apenas a estrutura da tabela.
// ROTAS ATENDIDAS: Nenhuma diretamente (base para GET /equipes).
// SITUAÇÃO: implementada.

export class CriarEquipes1760000000002 {
  name = 'CriarEquipes1760000000002';

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TABLE equipes (
        id    SERIAL PRIMARY KEY,
        nome  VARCHAR(100) NOT NULL
      )
    `);
  }

  async down(queryRunner) {
    await queryRunner.query('DROP TABLE equipes');
  }
}