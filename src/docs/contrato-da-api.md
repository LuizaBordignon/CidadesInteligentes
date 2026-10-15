# Contrato da API

Base: `http://localhost:8080`. Corpo e resposta em JSON.
O contrato interativo está no Swagger UI: `http://localhost:8080/api-docs`.

## Ocorrências

### POST /ocorrencias

Registra uma ocorrência. Ela nasce sempre `ABERTA` (R1).

Corpo:

```json
{
  "titulo": "Poste apagado",
  "descricao": "Poste sem luz há 3 dias",
  "endereco": "Rua das Flores, 100",
  "categoria_id": 1
}
```

| Campo | Regra |
| --- | --- |
| titulo | Texto obrigatório, de 1 a 150 caracteres |
| descricao | Texto obrigatório |
| endereco | Texto obrigatório, de 1 a 255 caracteres |
| categoria_id | Número inteiro positivo, de uma categoria existente |

O campo `status` não é aceito: se enviado, é ignorado.

Resposta `201 Created`:

```json
{
  "id": 1,
  "titulo": "Poste apagado",
  "descricao": "Poste sem luz há 3 dias",
  "endereco": "Rua das Flores, 100",
  "status": "ABERTA",
  "data_criacao": "2026-10-15T19:30:00.000Z",
  "categoria_id": 1
}
```

Erros: `400` (campo inválido ou R4) e `404` (categoria não existe).

### GET /ocorrencias

Lista as ocorrências. Resposta `200 OK`: lista de objetos como o abaixo.

### GET /ocorrencias/:id

Consulta uma ocorrência. Resposta `200 OK`:

```json
{
  "id": 1,
  "titulo": "Poste apagado",
  "descricao": "Poste sem luz há 3 dias",
  "endereco": "Rua das Flores, 100",
  "status": "ABERTA",
  "data_criacao": "2026-10-15T19:30:00.000Z",
  "categoria_id": 1,
  "categoria": { "id": 1, "nome": "Iluminação pública" }
}
```

O objeto `categoria` aparece em GET e PATCH, e não aparece na resposta do POST.
Erros: `400` (id inválido) e `404` (não existe).

### PATCH /ocorrencias/:id/status

Atualiza o status (R2 e R3). Corpo:

```json
{ "status": "EM_ATENDIMENTO" }
```

Valores aceitos: `ABERTA`, `EM_ATENDIMENTO`, `CONCLUIDA`.
Resposta `200 OK`: a ocorrência atualizada, no formato do GET.
Erros: `400` (status inválido ou transição não permitida) e `404` (não existe).

## Categorias

### POST /categorias

Corpo: `{ "nome": "Iluminação pública" }`
Resposta `201 Created`: `{ "id": 1, "nome": "Iluminação pública" }`
Erros: `400` (nome vazio ou já existente).

### GET /categorias

Resposta `200 OK`: lista de `{ "id": 1, "nome": "..." }`.

### GET /categorias/:id

Resposta `200 OK`: `{ "id": 1, "nome": "..." }`. Erro: `404`.

## Equipes (planejadas)

As classes de Equipe estão **montadas** nesta etapa e as rotas ainda **não funcionam**.
O contrato proposto:

| Verbo | Caminho | O que fará |
| --- | --- | --- |
| POST | /equipes | Cadastrar equipe. Corpo: `{ "nome": "Equipe Elétrica", "descricao": "Atende iluminação" }` (`descricao` opcional) |
| GET | /equipes | Listar equipes |
| GET | /equipes/:id | Consultar uma equipe |

## Regras de negócio e seus erros

Toda violação de regra devolve `400`.

| Regra | Mensagem |
| --- | --- |
| R1 | Não gera erro: o status é sempre `ABERTA` na criação |
| R2 | `R2: uma ocorrência só pode passar para EM_ATENDIMENTO se estiver ABERTA (status atual: CONCLUIDA).` |
| R3 | `R3: uma ocorrência só pode passar para CONCLUIDA se estiver EM_ATENDIMENTO (status atual: ABERTA).` |
| R4 | `R4: Já existe uma ocorrência ABERTA com este mesmo endereço e categoria.` |

Voltar para `ABERTA`, ou repetir o status atual, devolve `400` com a mensagem
`Transição de status inválida: não é permitido mudar de 'X' para 'Y'.`

## Formato dos erros

Todo erro sai neste formato:

```json
{
  "timestamp": "2026-10-15T19:30:00.000Z",
  "status": 400,
  "error": "Regra de Negócio Violada",
  "message": "R4: Já existe uma ocorrência ABERTA com este mesmo endereço e categoria.",
  "path": "/ocorrencias"
}
```

| Situação | status | error |
| --- | --- | --- |
| Campo inválido | 400 | Erro de Validação |
| Regra violada | 400 | Regra de Negócio Violada |
| Não existe | 404 | Não Encontrado |
| Erro inesperado | 500 | Erro Interno do Servidor (sem detalhes internos) |

No erro de validação, o JSON traz também `fields`, com a lista dos campos a corrigir:

```json
{
  "timestamp": "2026-10-15T19:30:00.000Z",
  "status": 400,
  "error": "Erro de Validação",
  "message": "Dados inválidos fornecidos.",
  "path": "/ocorrencias",
  "fields": [
    { "campo": "titulo", "mensagem": "O título é obrigatório." }
  ]
}
```

## Limitações conhecidas

- Se duas requisições idênticas chegarem ao mesmo tempo, o índice único do banco
  recusa a segunda, mas esse erro do Postgres hoje sai como `500`.
- A listagem de ocorrências não tem paginação.
- Não há autenticação: os papéis (cidadão, agente, administrador) descrevem o uso,
  mas não são controlados no código.
