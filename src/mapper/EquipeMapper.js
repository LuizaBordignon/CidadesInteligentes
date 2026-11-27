// CAMADA: Mapper
// RESPONSABILIDADE: Converter os dados entre DTO, Model e Banco de Dados para equipes.
// REGRAS: Nenhuma regra de negócio nesta classe, apenas conversão de estruturas.
// ROTAS ATENDIDAS: As rotas de /equipes.
// SITUAÇÃO: implementada.

import { EquipeResponseDTO } from "../dto/EquipeResponseDTO.js";

export class EquipeMapper {
    toResponse(equipe) {
        return new EquipeResponseDTO(equipe);
    }

    toResponseList(equipes) {
        return equipes.map((equipe) => new EquipeResponseDTO(equipe));
    }
}
