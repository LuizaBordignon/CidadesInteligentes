import "reflect-metadata";
import app from "./app.js";
import { AppDataSource } from "./config/datasource.js";
import { logger } from "./config/logger.js";

const PORT = process.env.PORT || 8080;

async function main() {
  try {
    // Inicializa a conexão com o banco de dados
    await AppDataSource.initialize();
    logger.info("Conexão com o Banco de Dados estabelecida");

    // Inicia o servidor Express
    app.listen(PORT, () => {
      logger.info({ port: PORT }, "Servidor iniciado");
    });
  } catch (error) {
    logger.error({ err: error }, "Erro ao iniciar o servidor");
  }
}

main();