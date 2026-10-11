export class CriarCategorias1700000000000 {
  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TABLE "categorias" (
        "id" SERIAL PRIMARY KEY,
        "nome" VARCHAR NOT NULL
      )
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE "categorias"`);
  }
}