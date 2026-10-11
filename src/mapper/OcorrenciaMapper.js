// CAMADA: Mapper
// RESPONSABILIDADE: Converter os dados entre o formato de DTO, Model e Banco de Dados.
// REGRAS: Nenhuma regra de negócio nesta classe, apenas conversão de estruturas.
// ROTAS ATENDIDAS: As rotas de ocorrências.
// SITUAÇÃO: implementada.

import { OcorrenciaResponseDTO } from "../dto/OcorrenciaResponseDTO.js";

export class OcorrenciaMapper {
  paraPersistencia(dadosValidados) {
    return {
      titulo: dadosValidados.titulo,
      descricao: dadosValidados.descricao,
      endereco: dadosValidados.endereco,
      categoria_id: dadosValidados.categoria_id,
    };
  }

  paraResposta(ocorrenciaEntity) {
    return new OcorrenciaResponseDTO(ocorrenciaEntity);
  }
}