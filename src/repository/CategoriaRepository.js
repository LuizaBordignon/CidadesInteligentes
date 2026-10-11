import { AppDataSource } from "../config/datasource.js";
import { CategoriaSchema } from "../model/Categoria.js";

export const CategoriaRepository = AppDataSource.getRepository(CategoriaSchema);