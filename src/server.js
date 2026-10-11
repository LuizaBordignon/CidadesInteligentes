import "reflect-metadata";
import app from "./app.js";
import { AppDataSource } from "./config/datasource.js";

const PORT = process.env.PORT || 8080;

async function main() {
  try {
    // Inicializa a conexão com o banco de dados
    await AppDataSource.initialize();
    console.log("Conexão com o Banco de Dados estabelecida com sucesso!");

    // Inicia o servidor Express
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
      console.log(`Documentação disponível em http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error("Erro ao iniciar o servidor:", error);
  }
}

main();