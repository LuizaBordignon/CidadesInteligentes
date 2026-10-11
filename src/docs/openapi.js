// CAMADA: Documentação
// RESPONSABILIDADE: Descrever o contrato da API (OpenAPI 3) exibido no Swagger UI.
// REGRAS: Nenhuma lógica de negócio aqui, apenas a descrição das rotas.
// ROTAS ATENDIDAS: Todas (documenta GET/POST /ocorrencias, GET /ocorrencias/{id}, PATCH /ocorrencias/{id}/status, GET /categorias).
// SITUAÇÃO: implementada.

const erro = {
  type: 'object',
  properties: {
    status: { type: 'integer', example: 400 },
    erro: { type: 'string', example: 'Bad Request' },
    mensagem: { type: 'string' },
    caminho: { type: 'string', example: '/ocorrencias' },
    timestamp: { type: 'string', format: 'date-time' },
    campos: { type: 'array', items: { type: 'object' } },
  },
};

const respostaErro = (descricao) => ({
  description: descricao,
  content: { 'application/json': { schema: { $ref: '#/components/schemas/Erro' } } },
});

export const openapi = {
  openapi: '3.0.3',
  info: {
    title: 'CidadeAtiva API',
    version: '1.0.0',
    description: 'API para registrar, categorizar e acompanhar ocorrências urbanas.',
  },
  servers: [{ url: 'http://localhost:8080' }],
  tags: [
    { name: 'Ocorrências' },
    { name: 'Categorias' },
  ],
  paths: {
    '/ocorrencias': {
      get: {
        tags: ['Ocorrências'],
        summary: 'Lista as ocorrências',
        responses: {
          200: {
            description: 'Lista de ocorrências',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/OcorrenciaResponse' } },
              },
            },
          },
        },
      },
      post: {
        tags: ['Ocorrências'],
        summary: 'Registra uma ocorrência (nasce ABERTA - R1)',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/OcorrenciaRequest' } } },
        },
        responses: {
          201: {
            description: 'Ocorrência criada',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/OcorrenciaResponse' } } },
          },
          400: respostaErro('Campo inválido ou regra de negócio violada'),
          404: respostaErro('Categoria não encontrada'),
        },
      },
    },
    '/ocorrencias/{id}': {
      get: {
        tags: ['Ocorrências'],
        summary: 'Consulta uma ocorrência',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: {
            description: 'Ocorrência encontrada',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/OcorrenciaResponse' } } },
          },
          404: respostaErro('Ocorrência não encontrada'),
        },
      },
    },
    '/ocorrencias/{id}/status': {
      patch: {
        tags: ['Ocorrências'],
        summary: 'Atualiza o status (R2 e R3)',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['status'],
                properties: { status: { $ref: '#/components/schemas/Status' } },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Status atualizado',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/OcorrenciaResponse' } } },
          },
          400: respostaErro('Transição de status não permitida'),
          404: respostaErro('Ocorrência não encontrada'),
        },
      },
    },
    '/categorias': {
      get: {
        tags: ['Categorias'],
        summary: 'Lista as categorias',
        responses: {
          200: {
            description: 'Lista de categorias',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Categoria' } },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Status: { type: 'string', enum: ['ABERTA', 'EM_ATENDIMENTO', 'CONCLUIDA'] },
      Categoria: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          nome: { type: 'string', example: 'Iluminação pública' },
        },
      },
      OcorrenciaRequest: {
        type: 'object',
        required: ['titulo', 'descricao', 'endereco', 'categoriaId'],
        properties: {
          titulo: { type: 'string', example: 'Poste apagado' },
          descricao: { type: 'string', example: 'Poste sem luz há 3 dias' },
          endereco: { type: 'string', example: 'Rua das Flores, 100' },
          categoriaId: { type: 'integer', example: 1 },
        },
      },
      OcorrenciaResponse: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          titulo: { type: 'string' },
          descricao: { type: 'string' },
          endereco: { type: 'string' },
          status: { $ref: '#/components/schemas/Status' },
          dataCriacao: { type: 'string', format: 'date-time' },
          categoria: { $ref: '#/components/schemas/Categoria' },
        },
      },
      Erro: erro,
    },
  },
};