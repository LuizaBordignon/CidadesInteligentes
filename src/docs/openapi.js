// CAMADA: Documentação
// RESPONSABILIDADE: Descrever o contrato da API (OpenAPI 3) exibido no Swagger UI.
// REGRAS: Nenhuma lógica de negócio aqui, apenas a descrição das rotas.
// ROTAS ATENDIDAS: /ocorrencias, /categorias e /equipes (CRUD, listagem paginada com filtros) e /ocorrencias/estatisticas.
// SITUAÇÃO: implementada.

const json = (schema) => ({ 'application/json': { schema } });
const ref = (nome) => ({ $ref: `#/components/schemas/${nome}` });
const erro = (descricao) => ({ description: descricao, content: json(ref('Erro')) });
const idNoCaminho = { name: 'id', in: 'path', required: true, schema: { type: 'integer', example: 1 } };
const parametrosPaginacao = (camposOrdenaveis) => [
  { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1, default: 1 } },
  { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 } },
  { name: 'sort', in: 'query', schema: { type: 'string', enum: camposOrdenaveis, default: 'id' } },
  { name: 'order', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'], default: 'asc' } },
];
const filtroNome = { name: 'nome', in: 'query', schema: { type: 'string' }, description: 'Busca parcial, sem diferenciar maiúsculas.' };
const pagina = (schema) => json({
  type: 'object',
  properties: {
    conteudo: { type: 'array', items: schema },
    pagina: { type: 'integer', example: 1 },
    limite: { type: 'integer', example: 10 },
    total: { type: 'integer', example: 25 },
    totalPaginas: { type: 'integer', example: 3 },
  },
});
const semConteudo = { 204: { description: 'Excluído' } };

export const openapi = {
  openapi: '3.0.3',
  info: {
    title: 'CidadeAtiva API',
    version: '1.0.0',
    description: 'API para registrar, categorizar e acompanhar ocorrências urbanas.',
  },
  servers: [{ url: 'http://localhost:8080' }],
  tags: [{ name: 'Ocorrências' }, { name: 'Categorias' }, { name: 'Equipes' }],
  paths: {
    '/ocorrencias': {
      get: {
        tags: ['Ocorrências'],
        summary: 'Lista as ocorrências (paginada, com filtros)',
        parameters: [
          ...parametrosPaginacao(['id', 'titulo', 'status', 'data_criacao']),
          { name: 'status', in: 'query', schema: ref('Status') },
          { name: 'categoria_id', in: 'query', schema: { type: 'integer' } },
          { name: 'endereco', in: 'query', schema: { type: 'string' }, description: 'Busca parcial, sem diferenciar maiúsculas.' },
        ],
        responses: {
          200: { description: 'Página de ocorrências', content: pagina(ref('OcorrenciaResponse')) },
          400: erro('Parâmetro de consulta inválido'),
        },
      },
      post: {
        tags: ['Ocorrências'],
        summary: 'Registra uma ocorrência (nasce ABERTA - R1; duplicada aberta é recusada - R4)',
        requestBody: { required: true, content: json(ref('OcorrenciaRequest')) },
        responses: {
          201: { description: 'Ocorrência criada', content: json(ref('OcorrenciaResponse')) },
          400: erro('Campo inválido (com a lista "fields") ou regra R4 violada'),
          404: erro('Categoria não encontrada'),
        },
      },
    },
    '/ocorrencias/estatisticas': {
      get: {
        tags: ['Ocorrências'],
        summary: 'Estatísticas: total, contagem por status e por categoria',
        responses: {
          200: {
            description: 'Agregações das ocorrências',
            content: json({
              type: 'object',
              properties: {
                total: { type: 'integer', example: 2 },
                por_status: {
                  type: 'array',
                  items: { type: 'object', properties: { status: ref('Status'), total: { type: 'integer', example: 1 } } },
                },
                por_categoria: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      categoria_id: { type: 'integer', example: 1 },
                      categoria: { type: 'string', example: 'Iluminação pública' },
                      total: { type: 'integer', example: 1 },
                    },
                  },
                },
              },
            }),
          },
        },
      },
    },
    '/ocorrencias/{id}': {
      get: {
        tags: ['Ocorrências'],
        summary: 'Consulta uma ocorrência',
        parameters: [idNoCaminho],
        responses: {
          200: { description: 'Ocorrência encontrada', content: json(ref('OcorrenciaResponse')) },
          400: erro('Id inválido'),
          404: erro('Ocorrência não encontrada'),
        },
      },
      put: {
        tags: ['Ocorrências'],
        summary: 'Atualiza os dados da ocorrência (não altera o status; R4 vale para ocorrências ABERTAS)',
        parameters: [idNoCaminho],
        requestBody: { required: true, content: json(ref('OcorrenciaRequest')) },
        responses: {
          200: { description: 'Ocorrência atualizada', content: json(ref('OcorrenciaResponse')) },
          400: erro('Campo inválido ou regra R4 violada'),
          404: erro('Ocorrência ou categoria não encontrada'),
        },
      },
      delete: {
        tags: ['Ocorrências'],
        summary: 'Exclui a ocorrência',
        parameters: [idNoCaminho],
        responses: { ...semConteudo, 400: erro('Id inválido'), 404: erro('Ocorrência não encontrada') },
      },
    },
    '/ocorrencias/{id}/status': {
      patch: {
        tags: ['Ocorrências'],
        summary: 'Atualiza o status (R2: ABERTA -> EM_ATENDIMENTO; R3: EM_ATENDIMENTO -> CONCLUIDA)',
        parameters: [idNoCaminho],
        requestBody: {
          required: true,
          content: json({ type: 'object', required: ['status'], properties: { status: ref('Status') } }),
        },
        responses: {
          200: { description: 'Status atualizado', content: json(ref('OcorrenciaResponse')) },
          400: erro('Status inválido ou transição não permitida (R2/R3)'),
          404: erro('Ocorrência não encontrada'),
        },
      },
    },
    '/categorias': {
      get: {
        tags: ['Categorias'],
        summary: 'Lista as categorias (paginada, com filtro por nome)',
        parameters: [...parametrosPaginacao(['id', 'nome']), filtroNome],
        responses: {
          200: { description: 'Página de categorias', content: pagina(ref('Categoria')) },
          400: erro('Parâmetro de consulta inválido'),
        },
      },
      post: {
        tags: ['Categorias'],
        summary: 'Cadastra uma categoria',
        requestBody: { required: true, content: json(ref('CategoriaRequest')) },
        responses: {
          201: { description: 'Categoria criada', content: json(ref('Categoria')) },
          400: erro('Nome inválido ou categoria já existente'),
        },
      },
    },
    '/categorias/{id}': {
      get: {
        tags: ['Categorias'],
        summary: 'Consulta uma categoria',
        parameters: [idNoCaminho],
        responses: {
          200: { description: 'Categoria encontrada', content: json(ref('Categoria')) },
          404: erro('Categoria não encontrada'),
        },
      },
      put: {
        tags: ['Categorias'],
        summary: 'Atualiza o nome da categoria',
        parameters: [idNoCaminho],
        requestBody: { required: true, content: json(ref('CategoriaRequest')) },
        responses: {
          200: { description: 'Categoria atualizada', content: json(ref('Categoria')) },
          400: erro('Nome inválido ou já existente'),
          404: erro('Categoria não encontrada'),
        },
      },
      delete: {
        tags: ['Categorias'],
        summary: 'Exclui a categoria (recusada se tiver ocorrências)',
        parameters: [idNoCaminho],
        responses: { ...semConteudo, 400: erro('Id inválido ou categoria com ocorrências'), 404: erro('Categoria não encontrada') },
      },
    },
    '/equipes': {
      get: {
        tags: ['Equipes'],
        summary: 'Lista as equipes (paginada, com filtro por nome)',
        parameters: [...parametrosPaginacao(['id', 'nome']), filtroNome],
        responses: {
          200: { description: 'Página de equipes', content: pagina(ref('Equipe')) },
          400: erro('Parâmetro de consulta inválido'),
        },
      },
      post: {
        tags: ['Equipes'],
        summary: 'Cadastra uma equipe',
        requestBody: { required: true, content: json(ref('EquipeRequest')) },
        responses: {
          201: { description: 'Equipe criada', content: json(ref('Equipe')) },
          400: erro('Campo inválido ou equipe já existente'),
        },
      },
    },
    '/equipes/{id}': {
      get: {
        tags: ['Equipes'],
        summary: 'Consulta uma equipe',
        parameters: [idNoCaminho],
        responses: {
          200: { description: 'Equipe encontrada', content: json(ref('Equipe')) },
          400: erro('Id inválido'),
          404: erro('Equipe não encontrada'),
        },
      },
      put: {
        tags: ['Equipes'],
        summary: 'Atualiza uma equipe',
        parameters: [idNoCaminho],
        requestBody: { required: true, content: json(ref('EquipeRequest')) },
        responses: {
          200: { description: 'Equipe atualizada', content: json(ref('Equipe')) },
          400: erro('Campo inválido ou nome já existente'),
          404: erro('Equipe não encontrada'),
        },
      },
      delete: {
        tags: ['Equipes'],
        summary: 'Exclui uma equipe',
        parameters: [idNoCaminho],
        responses: { ...semConteudo, 400: erro('Id inválido'), 404: erro('Equipe não encontrada') },
      },
    },
  },
  components: {
    schemas: {
      Status: { type: 'string', enum: ['ABERTA', 'EM_ATENDIMENTO', 'CONCLUIDA'] },
      Categoria: {
        type: 'object',
        properties: { id: { type: 'integer', example: 1 }, nome: { type: 'string', example: 'Iluminação pública' } },
      },
      CategoriaRequest: {
        type: 'object',
        required: ['nome'],
        properties: { nome: { type: 'string', example: 'Iluminação pública' } },
      },
      Equipe: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          nome: { type: 'string', example: 'Equipe Elétrica' },
          descricao: { type: 'string', nullable: true, example: 'Manutenção de iluminação' },
        },
      },
      EquipeRequest: {
        type: 'object',
        required: ['nome'],
        properties: {
          nome: { type: 'string', maxLength: 100, example: 'Equipe Elétrica' },
          descricao: { type: 'string', maxLength: 255, example: 'Manutenção de iluminação' },
        },
      },
      OcorrenciaRequest: {
        type: 'object',
        required: ['titulo', 'descricao', 'endereco', 'categoria_id'],
        properties: {
          titulo: { type: 'string', maxLength: 150, example: 'Poste apagado' },
          descricao: { type: 'string', example: 'Poste sem luz há 3 dias' },
          endereco: { type: 'string', maxLength: 255, example: 'Rua das Flores, 100' },
          categoria_id: { type: 'integer', example: 1 },
        },
      },
      OcorrenciaResponse: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          titulo: { type: 'string', example: 'Poste apagado' },
          descricao: { type: 'string', example: 'Poste sem luz há 3 dias' },
          endereco: { type: 'string', example: 'Rua das Flores, 100' },
          status: ref('Status'),
          data_criacao: { type: 'string', format: 'date-time' },
          categoria_id: { type: 'integer', example: 1 },
          categoria: { ...ref('Categoria'), description: 'Presente em GET e PATCH; ausente na resposta do POST.' },
        },
      },
      Erro: {
        type: 'object',
        properties: {
          timestamp: { type: 'string', format: 'date-time' },
          status: { type: 'integer', example: 400 },
          error: { type: 'string', example: 'Erro de Validação' },
          message: { type: 'string', example: 'Dados inválidos fornecidos.' },
          path: { type: 'string', example: '/ocorrencias' },
          fields: {
            type: 'array',
            description: 'Só aparece em erro de validação.',
            items: {
              type: 'object',
              properties: {
                campo: { type: 'string', example: 'categoria_id' },
                mensagem: { type: 'string', example: 'A categoria é obrigatória.' },
              },
            },
          },
        },
      },
    },
  },
};