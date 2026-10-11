// CAMADA: Documentação
// RESPONSABILIDADE: Descrever o contrato da API (OpenAPI 3) exibido no Swagger UI.
// REGRAS: Nenhuma lógica de negócio aqui, apenas a descrição das rotas.
// ROTAS ATENDIDAS: /ocorrencias (POST, GET, GET /{id}, PATCH /{id}/status) e /categorias (POST, GET, GET /{id}).
// SITUAÇÃO: implementada.

const json = (schema) => ({ 'application/json': { schema } });
const ref = (nome) => ({ $ref: `#/components/schemas/${nome}` });
const erro = (descricao) => ({ description: descricao, content: json(ref('Erro')) });
const idNoCaminho = { name: 'id', in: 'path', required: true, schema: { type: 'integer', example: 1 } };

export const openapi = {
  openapi: '3.0.3',
  info: {
    title: 'CidadeAtiva API',
    version: '1.0.0',
    description: 'API para registrar, categorizar e acompanhar ocorrências urbanas.',
  },
  servers: [{ url: 'http://localhost:8080' }],
  tags: [{ name: 'Ocorrências' }, { name: 'Categorias' }],
  paths: {
    '/ocorrencias': {
      get: {
        tags: ['Ocorrências'],
        summary: 'Lista as ocorrências',
        responses: {
          200: { description: 'Lista de ocorrências', content: json({ type: 'array', items: ref('OcorrenciaResponse') }) },
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
        summary: 'Lista as categorias',
        responses: {
          200: { description: 'Lista de categorias', content: json({ type: 'array', items: ref('Categoria') }) },
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