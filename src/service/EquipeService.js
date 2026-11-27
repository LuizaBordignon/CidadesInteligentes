// CAMADA: Service
// RESPONSABILIDADE: Regras de negócio das equipes responsáveis.
// REGRAS: Impedir nomes de equipe duplicados.
// ROTAS ATENDIDAS: As rotas de /equipes.
// SITUAÇÃO: implementada.

import { RegraDeNegocioError } from "./RegraDeNegocioError.js";
import { RecursoNaoEncontradoError } from "./RecursoNaoEncontradoError.js";
import { PaginaDTO } from "../dto/PaginacaoDTO.js";
import { logger as loggerPadrao } from "../config/logger.js";

export class EquipeService {
    constructor(equipeRepository, equipeMapper, logger = loggerPadrao) {
        this.equipeRepository = equipeRepository;
        this.equipeMapper = equipeMapper;
        this.logger = logger;
    }

    async criar(dados) {
        const existente = await this.equipeRepository.buscarPorNome(dados.nome);
        if (existente) {
            this.logger.warn({ nome: dados.nome }, "Equipe duplicada: criação recusada");
            throw new RegraDeNegocioError("Já existe uma equipe cadastrada com este nome.");
        }

        const salva = await this.equipeRepository.criar(dados);
        this.logger.info({ equipeId: salva.id }, "Equipe criada");
        return this.equipeMapper.toResponse(salva);
    }

    async listar(filtros) {
        const { itens, total } = await this.equipeRepository.listar(filtros);
        return new PaginaDTO(this.equipeMapper.toResponseList(itens), total, filtros.page, filtros.limit);
    }

    async buscarPorId(id) {
        const equipe = await this.equipeRepository.buscarPorId(id);
        if (!equipe) {
            throw new RecursoNaoEncontradoError(`Equipe com ID ${id} não encontrada.`);
        }
        return this.equipeMapper.toResponse(equipe);
    }

    async atualizar(id, dados) {
        const equipe = await this.equipeRepository.buscarPorId(id);
        if (!equipe) {
            this.logger.warn({ equipeId: id }, "Equipe não encontrada para atualização");
            throw new RecursoNaoEncontradoError(`Equipe com ID ${id} não encontrada.`);
        }

        const existente = await this.equipeRepository.buscarPorNome(dados.nome);
        if (existente && existente.id !== id) {
            this.logger.warn({ equipeId: id, nome: dados.nome }, "Equipe duplicada: atualização recusada");
            throw new RegraDeNegocioError("Já existe uma equipe cadastrada com este nome.");
        }

        equipe.nome = dados.nome;
        equipe.descricao = dados.descricao ?? null;
        const salva = await this.equipeRepository.salvar(equipe);
        this.logger.info({ equipeId: id }, "Equipe atualizada");
        return this.equipeMapper.toResponse(salva);
    }

    async remover(id) {
        const equipe = await this.equipeRepository.buscarPorId(id);
        if (!equipe) {
            this.logger.warn({ equipeId: id }, "Equipe não encontrada para exclusão");
            throw new RecursoNaoEncontradoError(`Equipe com ID ${id} não encontrada.`);
        }

        await this.equipeRepository.remover(id);
        this.logger.info({ equipeId: id }, "Equipe excluída");
    }
}
