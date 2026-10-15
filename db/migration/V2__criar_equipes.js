export class CriarEquipes1760000000002 {
  name = 'CriarEquipes1760000000002';

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TABLE equipes (
        id    SERIAL PRIMARY KEY,
        nome  VARCHAR(100) NOT NULL,
        descricao VARCHAR(255) NULL,
        CONSTRAINT uq_equipes_nome UNIQUE (nome)
      )
    `);
  }

  async down(queryRunner) {
    await queryRunner.query('DROP TABLE equipes');
  }
}