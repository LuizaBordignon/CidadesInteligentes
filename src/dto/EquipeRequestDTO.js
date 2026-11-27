// CAMADA: DTO
// RESPONSABILIDADE: Definir e validar o formato dos dados enviados pelo cliente nas rotas de equipe.
// REGRAS: O nome é obrigatório; a descrição é opcional.
// ROTAS ATENDIDAS: POST /equipes, PUT /equipes/:id, GET /equipes (filtros), GET /equipes/:id, DELETE /equipes/:id
// SITUAÇÃO: implementada.

import { z } from "zod";
import { paginacaoSchema } from "./PaginacaoDTO.js";

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

export const EquipeIdSchema = z.coerce
    .number({ invalid_type_error: "O id deve ser um número." })
    .int("O id deve ser um número inteiro.")
    .positive("O id deve ser positivo.");

export const EquipeFiltroSchema = paginacaoSchema(["id", "nome"]).extend({
    nome: z.string().trim().min(1).optional(),
});
