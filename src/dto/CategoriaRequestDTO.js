import { z } from "zod";

export const CategoriaRequestSchema = z.object({
  nome: z.string({
    required_error: "O nome é obrigatório.",
    invalid_type_error: "O nome deve ser um texto.",
  }).min(1, "O nome não pode estar vazio."),
});