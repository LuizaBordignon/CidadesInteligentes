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

export const CategoriaIdSchema = z.coerce
  .number({ invalid_type_error: "O id deve ser um número." })
  .int("O id deve ser um número inteiro.")
  .positive("O id deve ser positivo.");