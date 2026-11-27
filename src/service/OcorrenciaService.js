// CAMADA: Service
// RESPONSABILIDADE: Regras de negócio das ocorrências.
// REGRAS: R1 (status inicial ABERTA), R2 (só vai para EM_ATENDIMENTO se estiver ABERTA),
// R3 (só vai para CONCLUIDA se estiver EM_ATENDIMENTO) e R4 (duplicidade no mesmo endereço e categoria).
// ROTAS ATENDIDAS: As rotas de /ocorrencias.
// SITUAÇÃO: implementada.

import { RegraDeNegocioError } from './RegraDeNegocioError.js';
import { StatusOcorrencia, ValidadorStatusOcorrencia } from '../model/StatusOcorrencia.js';
import {OcorrenciaNaoEncontradaError} from "./OcorrenciaNaoEncontradaError.js";
import { PaginaDTO } from "../dto/PaginacaoDTO.js";
import { logger as loggerPadrao } from "../config/logger.js";

export class OcorrenciaService {
  constructor(ocorrenciaRepository, ocorrenciaMapper, categoriaService, logger = loggerPadrao) {
    this.ocorrenciaRepository = ocorrenciaRepository;
    this.ocorrenciaMapper = ocorrenciaMapper;
    this.categoriaService = categoriaService;
    this.logger = logger;
  }

  async criar(dadosValidados) {
    // Lança CategoriaNaoEncontradaError (404) se a categoria não existir.
    await this.categoriaService.buscarPorId(dadosValidados.categoria_id);

    const duplicada = await this.ocorrenciaRepository.buscarAbertaPorEnderecoECategoria(
      dadosValidados.endereco,
      dadosValidados.categoria_id
    );

    if (duplicada) {
      this.logger.warn(
        { endereco: dadosValidados.endereco, categoriaId: dadosValidados.categoria_id },
        "R4: ocorrência duplicada, criação recusada"
      );
      throw new RegraDeNegocioError(
        'R4: Já existe uma ocorrência ABERTA com este mesmo endereço e categoria.'
      );
    }

    const dadosParaSalvar = this.ocorrenciaMapper.paraPersistencia(dadosValidados);
    dadosParaSalvar.status = StatusOcorrencia.ABERTA;

    const salva = await this.ocorrenciaRepository.criar(dadosParaSalvar);
    this.logger.info({ ocorrenciaId: salva.id, status: salva.status }, "Ocorrência criada");
    return this.ocorrenciaMapper.paraResposta(salva);
  }


  async listar(filtros) {
    const { itens, total } = await this.ocorrenciaRepository.listar(filtros);
    const conteudo = itens.map((occ) => this.ocorrenciaMapper.paraResposta(occ));
    return new PaginaDTO(conteudo, total, filtros.page, filtros.limit);
  }

  async estatisticas() {
    const porStatus = await this.ocorrenciaRepository.contarPorStatus();
    const porCategoria = await this.ocorrenciaRepository.contarPorCategoria();

    const contagemStatus = Object.fromEntries(porStatus.map((l) => [l.status, l.total]));
    const por_status = Object.values(StatusOcorrencia).map((status) => ({
      status,
      total: contagemStatus[status] ?? 0,
    }));

    return {
      total: por_status.reduce((soma, l) => soma + l.total, 0),
      por_status,
      por_categoria: porCategoria,
    };
  }

  async atualizar(id, dadosValidados) {
    const ocorrencia = await this.ocorrenciaRepository.buscarPorId(id);
    if (!ocorrencia) {
      this.logger.warn({ ocorrenciaId: id }, "Ocorrência não encontrada para atualização");
      throw new OcorrenciaNaoEncontradaError(id);
    }

    await this.categoriaService.buscarPorId(dadosValidados.categoria_id);

    if (ocorrencia.status === StatusOcorrencia.ABERTA) {
      const duplicada = await this.ocorrenciaRepository.buscarAbertaPorEnderecoECategoria(
        dadosValidados.endereco,
        dadosValidados.categoria_id
      );
      if (duplicada && duplicada.id !== id) {
        this.logger.warn({ ocorrenciaId: id }, "R4: ocorrência duplicada, atualização recusada");
        throw new RegraDeNegocioError(
          'R4: Já existe uma ocorrência ABERTA com este mesmo endereço e categoria.'
        );
      }
    }

    Object.assign(ocorrencia, this.ocorrenciaMapper.paraPersistencia(dadosValidados));
    delete ocorrencia.categoria;
    const atualizada = await this.ocorrenciaRepository.salvar(ocorrencia);
    this.logger.info({ ocorrenciaId: id }, "Ocorrência atualizada");
    return this.ocorrenciaMapper.paraResposta(await this.ocorrenciaRepository.buscarPorId(atualizada.id));
  }

  async remover(id) {
    const ocorrencia = await this.ocorrenciaRepository.buscarPorId(id);
    if (!ocorrencia) {
      this.logger.warn({ ocorrenciaId: id }, "Ocorrência não encontrada para exclusão");
      throw new OcorrenciaNaoEncontradaError(id);
    }

    await this.ocorrenciaRepository.remover(id);
    this.logger.info({ ocorrenciaId: id }, "Ocorrência excluída");
  }

  async buscarPorId(id) {
    const ocorrencia = await this.ocorrenciaRepository.buscarPorId(id);
    if (!ocorrencia) {
      throw new OcorrenciaNaoEncontradaError(id);
    }
    return this.ocorrenciaMapper.paraResposta(ocorrencia);
  }

  async atualizarStatus(id, novoStatus) {
    const ocorrencia = await this.ocorrenciaRepository.buscarPorId(id);
    if (!ocorrencia) {
      this.logger.warn({ ocorrenciaId: id }, "Ocorrência não encontrada para atualização de status");
      throw new OcorrenciaNaoEncontradaError(id);
    }

    const ehPermitida = ValidadorStatusOcorrencia.ehPermitida(
      ocorrencia.status,
      novoStatus
    );

    if (!ehPermitida) {
      this.logger.warn(
        { ocorrenciaId: id, de: ocorrencia.status, para: novoStatus },
        "Transição de status recusada"
      );
      if (novoStatus === StatusOcorrencia.EM_ATENDIMENTO) {
        throw new RegraDeNegocioError(
            `R2: uma ocorrência só pode passar para EM_ATENDIMENTO se estiver ABERTA (status atual: ${ocorrencia.status}).`
        );
      }

      if (novoStatus === StatusOcorrencia.CONCLUIDA) {
        throw new RegraDeNegocioError(
            `R3: Uma ocorrência só pode passar para CONCLUIDA se estiver EM_ATENDIMENTO (status atual: ${ocorrencia.status}).`
        );
      }

      throw new RegraDeNegocioError(
          `Transição de status inválida: não é permitido mudar de '${ocorrencia.status}' para '${novoStatus}'.`
      );
    }

    const statusAnterior = ocorrencia.status;
    ocorrencia.status = novoStatus;
    const atualizada = await this.ocorrenciaRepository.salvar(ocorrencia);
    this.logger.info(
      { ocorrenciaId: id, de: statusAnterior, para: novoStatus },
      "Status da ocorrência atualizado"
    );
    return this.ocorrenciaMapper.paraResposta(atualizada);
  }
}

