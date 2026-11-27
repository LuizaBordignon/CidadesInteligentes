// CAMADA: DTO
// RESPONSABILIDADE: Validar os parâmetros de paginação e ordenação e montar a resposta paginada.
// REGRAS: page >= 1, limit entre 1 e 100, order asc ou desc.
// ROTAS ATENDIDAS: GET /categorias, GET /equipes, GET /ocorrencias
// SITUAÇÃO: implementada.

import { z } from "zod";

export const paginacaoSchema = (camposOrdenaveis) =>
  z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    sort: z.enum(camposOrdenaveis).default("id"),
    order: z.enum(["asc", "desc"]).default("asc"),
  });

export class PaginaDTO {
  constructor(conteudo, total, page, limit) {
    this.conteudo = conteudo;
    this.pagina = page;
    this.limite = limit;
    this.total = total;
    this.totalPaginas = Math.ceil(total / limit);
  }
}
