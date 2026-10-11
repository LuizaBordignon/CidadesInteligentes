export class CriarOcorrencias1760000000003 {
  name = 'CriarOcorrencias1760000000003';
 
  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TABLE ocorrencias (
        id            SERIAL PRIMARY KEY,
        titulo        VARCHAR(150) NOT NULL,
        descricao     TEXT         NOT NULL,
        endereco      VARCHAR(255) NOT NULL,
        status        VARCHAR(20)  NOT NULL DEFAULT 'ABERTA',
        data_criacao  TIMESTAMP    NOT NULL DEFAULT NOW(),
        categoria_id  INTEGER      NOT NULL REFERENCES categorias (id),
        equipe_id     INTEGER      NULL     REFERENCES equipes (id),
        CONSTRAINT ck_ocorrencias_status
          CHECK (status IN ('ABERTA', 'EM_ATENDIMENTO', 'CONCLUIDA'))
      )
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX ux_ocorrencias_aberta_endereco_categoria
        ON ocorrencias (categoria_id, LOWER(TRIM(endereco)))
        WHERE status = 'ABERTA'
    `);
  }
 
  async down(queryRunner) {
    await queryRunner.query('DROP TABLE ocorrencias');
  }
}