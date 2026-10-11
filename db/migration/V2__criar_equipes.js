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