// CAMADA: Service
// RESPONSABILIDADE: Regras de negócio das ocorrências.
// REGRAS: R1 (status inicial ABERTA), R2 (só vai para EM_ATENDIMENTO se estiver ABERTA),
// R3 (só vai para CONCLUIDA se estiver EM_ATENDIMENTO) e R4 (duplicidade no mesmo endereço e categoria).
// ROTAS ATENDIDAS: As rotas de /ocorrencias.
// SITUAÇÃO: implementada.

import { RegraDeNegocioError } from './RegraDeNegocioError.js';
import { StatusOcorrencia, ValidadorStatusOcorrencia } from '../model/StatusOcorrencia.js';
import {OcorrenciaNaoEncontradaError} from "./OcorrenciaNaoEncontradaError.js";

export class OcorrenciaService {
  constructor(ocorrenciaRepository, ocorrenciaMapper, categoriaService) {
    this.ocorrenciaRepository = ocorrenciaRepository;
    this.ocorrenciaMapper = ocorrenciaMapper;
    this.categoriaService = categoriaService;
  }

  async criar(dadosValidados) {
    // Lança CategoriaNaoEncontradaError (404) se a categoria não existir.
    await this.categoriaService.buscarPorId(dadosValidados.categoria_id);

    const duplicada = await this.ocorrenciaRepository.buscarAbertaPorEnderecoECategoria(
      dadosValidados.endereco,
      dadosValidados.categoria_id
    );

    if (duplicada) {
      throw new RegraDeNegocioError(
        'R4: Já existe uma ocorrência ABERTA com este mesmo endereço e categoria.'
      );
    }

    const dadosParaSalvar = this.ocorrenciaMapper.paraPersistencia(dadosValidados);
    dadosParaSalvar.status = StatusOcorrencia.ABERTA;

    const salva = await this.ocorrenciaRepository.criar(dadosParaSalvar);
    return this.ocorrenciaMapper.paraResposta(salva);
  }


  async listar() {
    const ocorrencias = await this.ocorrenciaRepository.listar();
    return ocorrencias.map((occ) => this.ocorrenciaMapper.paraResposta(occ));
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
      throw new OcorrenciaNaoEncontradaError(id);
    }

    const ehPermitida = ValidadorStatusOcorrencia.ehPermitida(
      ocorrencia.status,
      novoStatus
    );

    if (!ehPermitida) {
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

    ocorrencia.status = novoStatus;
    const atualizada = await this.ocorrenciaRepository.salvar(ocorrencia);
    return this.ocorrenciaMapper.paraResposta(atualizada);
  }
}

