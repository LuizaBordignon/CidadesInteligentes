import { z } from "zod";

export const EquipeRequestSchema = z.object({
    nome: z
        .string({
            required_error: "O nome é obrigatório.",
            invalid_type_error: "O nome deve ser um texto.",
        })
        .trim()
        .min(1, "O nome não pode estar vazio.")
        .max(100, "O nome deve ter no máximo 100 caracteres."),
    descricao: z
        .string({ invalid_type_error: "A descrição deve ser um texto." })
        .trim()
        .max(255, "A descrição deve ter no máximo 255 caracteres.")
        .optional(),
});