import { ErroDTO } from "../dto/ErroDTO.js";
import { RegraDeNegocioError } from "../service/RegraDeNegocioError.js";
import { RecursoNaoEncontradoError } from "../service/RecursoNaoEncontradoError.js";
import { ZodError } from "zod";

export function ApiExceptionHandler(err, req, res, next) {
  const path = req.originalUrl;

  // 1. Erro de validação do Zod (vira 400 com os campos)
  if (err instanceof ZodError) {
    const fields = err.errors.map((e) => ({
      campo: e.path.join("."),
      mensagem: e.message,
    }));
    const erroDTO = new ErroDTO(400, "Erro de Validação", "Dados inválidos fornecidos.", path, fields);
    return res.status(400).json(erroDTO);
  }

  // 2. Erro de Regra de Negócio (vira 400)
  if (err instanceof RegraDeNegocioError) {
    const erroDTO = new ErroDTO(400, "Regra de Negócio Violada", err.message, path);
    return res.status(400).json(erroDTO);
  }

  // 3. Erro de Recurso Não Encontrado (vira 404)
  if (err instanceof RecursoNaoEncontradoError) {
    const erroDTO = new ErroDTO(404, "Não Encontrado", err.message, path);
    return res.status(404).json(erroDTO);
  }

  // 4. Qualquer outro erro inesperado (vira 500, sem vazar detalhes internos)
  console.error("Erro interno não tratado:", err);
  const erroDTO = new ErroDTO(500, "Erro Interno do Servidor", "Ocorreu um erro interno no servidor.", path);
  return res.status(500).json(erroDTO);
}