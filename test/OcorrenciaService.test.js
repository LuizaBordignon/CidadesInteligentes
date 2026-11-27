import test from 'node:test';
import assert from 'node:assert';
import { OcorrenciaService } from '../src/service/OcorrenciaService.js';
import { OcorrenciaNaoEncontradaError } from '../src/service/OcorrenciaNaoEncontradaError.js';
import { RegraDeNegocioError } from '../src/service/RegraDeNegocioError.js';

const mockLogger = {
  info: () => {},
  error: () => {},
  warn: () => {},
  debug: () => {}
};

test('OcorrenciaService - Testes Unitários Completos', async (t) => {

  // --- TESTES DE SUCESSO ---

  await t.test('Sucesso: criar deve definir status ABERTA (R1)', async () => {
    const mockRepository = {
      criar: async (ocorrencia) => ({ id: 1, ...ocorrencia }),
      buscarPorFiltros: async () => [],
      buscarAbertaPorEnderecoECategoria: async () => null
    };
    const mockMapper = {
      toModel: (dto) => ({ ...dto, status: 'ABERTA' }),
      paraPersistencia: (dto) => ({ ...dto, status: 'ABERTA' }),
      paraResposta: (entity) => entity
    };
    const mockCategoriaService = {
      buscarPorId: async () => ({ id: 1, nome: 'Iluminação' })
    };

    const service = new OcorrenciaService(mockRepository, mockMapper, mockCategoriaService, mockLogger);
    const resultado = await service.criar({ titulo: 'Poste apagado', categoriaId: 1, descricao: 'Lâmpada queimada' });
    assert.strictEqual(resultado.status, 'ABERTA');
  });

  await t.test('Sucesso: atualizarStatus deve transicionar ABERTA -> EM_ATENDIMENTO e EM_ATENDIMENTO -> CONCLUIDA', async () => {
    let statusAtual = 'ABERTA';
    const mockRepository = {
      buscarPorId: async (id) => ({ id, status: statusAtual }),
      atualizarStatus: async (id, novoStatus) => {
        statusAtual = novoStatus;
        return { id, status: novoStatus };
      },
      salvar: async (ocorrencia) => {
        statusAtual = ocorrencia.status;
        return ocorrencia;
      }
    };
    const mockMapper = {
      paraResposta: (entity) => entity
    };
    const service = new OcorrenciaService(mockRepository, mockMapper, {}, mockLogger);

    const res1 = await service.atualizarStatus(1, 'EM_ATENDIMENTO');
    assert.strictEqual(res1.status, 'EM_ATENDIMENTO');

    const res2 = await service.atualizarStatus(1, 'CONCLUIDA');
    assert.strictEqual(res2.status, 'CONCLUIDA');
  });

  // --- TESTES DE ERRO ---

  await t.test('Erro: R4 - Impedir criação de ocorrência duplicada', async () => {
    const mockRepository = {
      buscarPorFiltros: async () => [],
      buscarAbertaPorEnderecoECategoria: async () => ({ id: 1, titulo: 'Buraco na rua' })
    };
    const mockCategoriaService = {
      buscarPorId: async () => ({ id: 1, nome: 'Ruas' })
    };
    const service = new OcorrenciaService(mockRepository, {}, mockCategoriaService, mockLogger);

    await assert.rejects(async () => {
      await service.criar({ titulo: 'Buraco na rua', categoriaId: 1 });
    }, RegraDeNegocioError);
  });

  await t.test('Erro: R2 e R3 - Validações de negócio e categoria inválida', async () => {
    const mockRepository = {
      buscarPorFiltros: async () => [],
      buscarAbertaPorEnderecoECategoria: async () => null
    };
    const mockCategoriaService = {
      buscarPorId: async () => { throw new RegraDeNegocioError('Categoria não encontrada'); }
    };

    const service = new OcorrenciaService(mockRepository, {}, mockCategoriaService, mockLogger);

    await assert.rejects(async () => {
      await service.criar({ titulo: 'Teste', categoriaId: 999 });
    }, RegraDeNegocioError);
  });

  await t.test('Erro: OcorrenciaNaoEncontradaError em buscarPorId e atualizarStatus', async () => {
    const mockRepository = {
      buscarPorId: async () => null
    };
    const service = new OcorrenciaService(mockRepository, {}, {}, mockLogger);

    await assert.rejects(async () => {
      await service.buscarPorId(999);
    }, OcorrenciaNaoEncontradaError);

    await assert.rejects(async () => {
      await service.atualizarStatus(999, 'EM_ATENDIMENTO');
    }, OcorrenciaNaoEncontradaError);
  });

  await t.test('Erro: Transição de status inválida', async () => {
    const mockRepository = {
      buscarPorId: async () => ({ id: 1, status: 'ABERTA' }),
      salvar: async (o) => o
    };
    const service = new OcorrenciaService(mockRepository, {}, {}, mockLogger);

    await assert.rejects(async () => {
      await service.atualizarStatus(1, 'CONCLUIDA');
    }, RegraDeNegocioError);
  });

});