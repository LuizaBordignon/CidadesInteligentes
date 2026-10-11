// CAMADA: Service
// RESPONSABILIDADE: Regras de negócio das ocorrências.
// REGRAS: R1 (status inicial ABERTA), R2 (só vai para EM_ATENDIMENTO se estiver ABERTA),
// R3 (só vai para CONCLUIDA se estiver EM_ATENDIMENTO) e R4 (duplicidade no mesmo endereço e categoria).
// ROTAS ATENDIDAS: As rotas de /ocorrencias.
// SITUAÇÃO: implementada.

import { RegraDeNegocioError } from './RegraDeNegocioError.js';
import { RecursoNaoEncontradoError } from './RecursoNaoEncontradoError.js';
import { StatusOcorrencia, ValidadorStatusOcorrencia } from '../model/StatusOcorrencia.js';

export class OcorrenciaService {
  constructor(ocorrenciaRepository, ocorrenciaMapper, categoriaService) {
    this.ocorrenciaRepository = ocorrenciaRepository;
    this.ocorrenciaMapper = ocorrenciaMapper;
    this.categoriaService = categoriaService;
  }

  async criar(requestDTO) {
    requestDTO.validar();

    await this.categoriaService.buscarEntidadePorId(requestDTO.categoria_id);

    const duplicada = await this.ocorrenciaRepository.buscarAbertaPorEnderecoECategoria(
      requestDTO.endereco,
      requestDTO.categoria_id
    );

    if (duplicada) {
      throw new RegraDeNegocioError(
        'R4: Já existe uma ocorrência ABERTA com este mesmo endereço e categoria.'
      );
    }

    const dadosParaSalvar = this.ocorrenciaMapper.paraPersistencia(requestDTO);
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
      throw new RecursoNaoEncontradoError(`Ocorrência com ID ${id} não encontrada.`);
    }
    return this.ocorrenciaMapper.paraResposta(ocorrencia);
  }

  async atualizarStatus(id, novoStatus) {
    const ocorrencia = await this.ocorrenciaRepository.buscarPorId(id);
    if (!ocorrencia) {
      throw new RecursoNaoEncontradoError(`Ocorrência com ID ${id} não encontrada.`);
    }

    const ehPermitida = ValidadorStatusOcorrencia.ehPermitida(
      ocorrencia.status,
      novoStatus
    );

    if (!ehPermitida) {
      throw new RegraDeNegocioError(
        `Transição de status inválida: não é permitido mudar de '${ocorrencia.status}' para '${novoStatus}'.`
      );
    }

    ocorrencia.status = novoStatus;
    const atualizada = await this.ocorrenciaRepository.salvar(ocorrencia);
    return this.ocorrenciaMapper.paraResposta(atualizada);
  }
}