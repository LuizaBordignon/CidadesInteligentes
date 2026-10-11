// CAMADA: DTO
// RESPONSABILIDADE: Definir e validar o formato dos dados enviados pelo cliente nas rotas de ocorrência.
// REGRAS: Campos obrigatórios preenchidos; o status NÃO é aceito na criação (regra R1: a ocorrência nasce ABERTA).
// ROTAS ATENDIDAS: POST /ocorrencias, GET /ocorrencias/:id, PATCH /ocorrencias/:id/status
// SITUAÇÃO: implementada.

import { z } from "zod";
import { StatusOcorrencia } from "../model/StatusOcorrencia.js";

const textoObrigatorio = (nomeDoCampo, tamanhoMaximo) =>
  z
    .string({
      required_error: `${nomeDoCampo} é obrigatório.`,
      invalid_type_error: `${nomeDoCampo} deve ser um texto.`,
    })
    .trim()
    .min(1, `${nomeDoCampo} não pode estar vazio.`)
    .max(tamanhoMaximo, `${nomeDoCampo} deve ter no máximo ${tamanhoMaximo} caracteres.`);

// Corpo do POST /ocorrencias. Campos extras (como "status") são descartados pelo Zod.
export const OcorrenciaRequestSchema = z.object({
  titulo: textoObrigatorio("O título", 150),
  descricao: z
    .string({
      required_error: "A descrição é obrigatória.",
      invalid_type_error: "A descrição deve ser um texto.",
    })
    .trim()
    .min(1, "A descrição não pode estar vazia."),
  endereco: textoObrigatorio("O endereço", 255),
  categoria_id: z
    .number({
      required_error: "A categoria é obrigatória.",
      invalid_type_error: "A categoria deve ser um número (id).",
    })
    .int("A categoria deve ser um número inteiro.")
    .positive("A categoria deve ser um id válido."),
});

// Parâmetro :id da URL (chega como texto, vira número).
export const OcorrenciaIdSchema = z.coerce
  .number({ invalid_type_error: "O id deve ser um número." })
  .int("O id deve ser um número inteiro.")
  .positive("O id deve ser positivo.");

// Corpo do PATCH /ocorrencias/:id/status.
export const OcorrenciaStatusRequestSchema = z.object({
  status: z.enum(Object.values(StatusOcorrencia), {
    required_error: "O status é obrigatório.",
    invalid_type_error: "O status deve ser um texto.",
    message: `O status deve ser um destes: ${Object.values(StatusOcorrencia).join(", ")}.`,
  }),
});