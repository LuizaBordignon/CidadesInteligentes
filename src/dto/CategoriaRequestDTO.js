// CAMADA: DTO
// RESPONSABILIDADE: Validar e estruturar os dados enviados pelo cliente ao criar uma categoria.
// REGRAS: O campo nome é obrigatório.
// ROTAS ATENDIDAS: POST /categorias
// SITUAÇÃO: implementada.

import { z } from "zod";

export const CategoriaRequestSchema = z.object({
  nome: z.string({
    required_error: "O nome é obrigatório.",
    invalid_type_error: "O nome deve ser um texto.",
  }).min(1, "O nome não pode estar vazio."),
});