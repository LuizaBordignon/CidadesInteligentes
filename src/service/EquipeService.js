// CAMADA: Service
// RESPONSABILIDADE: Regras de negócio das equipes responsáveis.
// REGRAS: Nenhuma nesta etapa.
// ROTAS ATENDIDAS: As rotas de /equipes (planejadas).
// SITUAÇÃO: montada.

export class EquipeService {
    constructor(equipeRepository, equipeMapper) {
        this.equipeRepository = equipeRepository;
        this.equipeMapper = equipeMapper;
    }
}