// CAMADA: Repository
// RESPONSABILIDADE: Comunicar-se com o banco de dados para salvar e buscar categorias.
// REGRAS: Nenhuma regra de negócio nesta classe, apenas acesso a dados.
// ROTAS ATENDIDAS: Nenhuma diretamente.
// SITUAÇÃO: implementada.

import { AppDataSource } from "../config/datasource.js";
import { CategoriaSchema } from "../model/Categoria.js";

export const CategoriaRepository = AppDataSource.getRepository(CategoriaSchema);