// CAMADA: Mapper
// RESPONSABILIDADE: Converter os dados entre o formato de DTO, Model e Banco de Dados.
// REGRAS: Nenhuma regra de negócio nesta classe, apenas conversão de estruturas.
// ROTAS ATENDIDAS: As rotas de ocorrências.
// SITUAÇÃO: implementada.

import { OcorrenciaResponseDTO } from "../dto/OcorrenciaResponseDTO.js";

export class OcorrenciaMapper {
    paraPersistencia(requestDTO) {
        return {
            titulo: requestDTO.titulo,
            descricao: requestDTO.descricao,
            endereco: requestDTO.endereco,
            dataCriacao: new Date(),
        }
    };

    paraResposta(ocorrenciaEntity) {
        return new OcorrenciaResponseDTO(ocorrenciaEntity);
    }

}
