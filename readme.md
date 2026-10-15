# CidadeAtiva

Sistema backend para registrar, categorizar e acompanhar ocorrências urbanas, como problemas de iluminação pública, acúmulo de lixo e falhas no trânsito. A plataforma organiza as solicitações e permite acompanhar o andamento do atendimento pelas equipes responsáveis.

Projeto Final da disciplina de Backend (Engenharia de Software, SATC). **Etapa 1: arquitetura do backend.**

## Índice

- [Integrantes](#integrantes)
- [O problema](#o-problema)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Entidades](#entidades)
- [Rotas](#rotas)
- [Como executar](#como-executar)
- [Situação do projeto](#situação-do-projeto)
- [Como o projeto atende aos critérios da revisão](#como-o-projeto-atende-aos-critérios-da-revisão)
- [Documentação](#documentação)

## Integrantes

| Nome                         | GitHub                                               |
| ---------------------------- | ---------------------------------------------------- |
| Luiza Bordignon Moro         | [@LuizaBordignon](https://github.com/LuizaBordignon) |
| Estér Frank Schulter Serafim | [@esterfrank](https://github.com/esterfrank)         |
| Bruno Costa Ghisi            | [@BrunoCGhisi](https://github.com/BrunoCGhisi)       |

## O problema

**Tema sorteado:** Cidades Inteligentes

Problemas urbanos, como lâmpadas queimadas, acúmulo de lixo e semáforos com defeito, podem prejudicar a segurança e a qualidade de vida da população. Sem um sistema centralizado, torna-se mais difícil organizar essas ocorrências e acompanhar as providências tomadas. O CidadeAtiva propõe uma API para registrar os problemas, classificá-los por categoria e acompanhar seu atendimento pelas equipes responsáveis.

**Quem usa o sistema:**

| Quem               | O que faz no sistema                               |
| ------------------ | -------------------------------------------------- |
| Administrador      | Gerencia as categorias e as equipes responsáveis   |
| Agente responsável | Consulta as ocorrências e atualiza seu andamento   |
| Cidadão            | Registra ocorrências urbanas e consulta seu status |

Os papéis descrevem o uso do sistema. Esta etapa não tem autenticação, então eles não são controlados no código.

**Regras de negócio.** Quando uma regra é violada, a API devolve `400` com uma mensagem que explica a regra.

| #   | Regra                                                                   | Onde está no código                                                                             | Rota que usa                    |
| --- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------- |
| R1  | Toda ocorrência nova deve iniciar com o status ABERTA.                  | `src/service/OcorrenciaService.js` (método `criar`)                                             | `POST /ocorrencias`             |
| R2  | Uma ocorrência só pode passar para EM_ATENDIMENTO se estiver ABERTA.    | `src/service/OcorrenciaService.js` (método `atualizarStatus`) e `src/model/StatusOcorrencia.js` | `PATCH /ocorrencias/:id/status` |
| R3  | Uma ocorrência só pode passar para CONCLUIDA se estiver EM_ATENDIMENTO. | `src/service/OcorrenciaService.js` (método `atualizarStatus`) e `src/model/StatusOcorrencia.js` | `PATCH /ocorrencias/:id/status` |
| R4  | Não pode existir mais de uma ocorrência ABERTA com o mesmo endereço e a mesma categoria. Assim a mesma lâmpada queimada não gera vários chamados. | `src/service/OcorrenciaService.js` (método `criar`), `src/repository/OcorrenciaRepository.js` (consulta) e índice único parcial na migration V3 | `POST /ocorrencias` |

**Fora do escopo:** aplicativo móvel, integração com sensores urbanos em tempo real, geolocalização automática e integração direta com sistemas da prefeitura. Também não fazem parte desta etapa as rotas `PUT` e `DELETE`, o frontend e a atribuição de equipe a uma ocorrência.

## Tecnologias

| O quê               | Qual                                                  |
| ------------------- | ----------------------------------------------------- |
| Linguagem           | JavaScript (ES Modules)                               |
| Runtime             | Node.js 22 (LTS)                                      |
| Framework web       | Express 5                                             |
| Banco de dados      | PostgreSQL 16, em Docker                              |
| ORM e repositórios  | TypeORM (entidades com `EntitySchema`)                |
| Migrations          | Migrations do TypeORM, versionadas em `db/migration/` |
| Validação           | Zod                                                   |
| Documentação da API | swagger-ui-express (contrato em `src/docs/openapi.js`) |

O projeto usa Node.js em vez de Java + Spring Boot. A seção [Como o projeto atende aos critérios da revisão](#como-o-projeto-atende-aos-critérios-da-revisão) mostra o equivalente de cada peça.

## Arquitetura

A API é organizada em camadas. Uma requisição entra pelo Controller, que valida o DTO de entrada e chama o Service, onde ficam as regras de negócio. O Service usa o Mapper para converter DTO em entidade e o Repository para ler e gravar no banco. A resposta volta como DTO de saída.

```
Cliente (Postman ou Swagger UI)
        │  HTTP + JSON
        ▼
Controller ──DTO──> Service ──entidade──> Repository ──SQL──> PostgreSQL (Docker)
                       │
                       └──DTO e entidade──> Mapper
```

**Três regras do desenho:**

1. **A entidade não sobe além do Service.** O Controller só enxerga DTO: nenhum arquivo de `controller/` importa algo de `model/`.
2. **Regra de negócio mora no Service.** O Controller recebe e devolve; o Repository lê e grava.
3. **O banco só muda por migration.** Nenhuma tabela é criada à mão nem pelo ORM (`synchronize` fica desligado): toda mudança é um arquivo novo em `db/migration/`, versionado no Git junto com o código.

**Estrutura de pastas:**

```
CidadesInteligentes/
├── readme.md
├── docker-compose.yml            # PostgreSQL
├── .env
├── .env.example
├── package.json
├── package-lock.json
├── docs/
│   ├── modelo-de-dominio.md
│   ├── contrato-da-api.md
│   └── autoavaliacao.md
├── db/migration/
│   ├── V1__criar_categorias.js
│   ├── V2__criar_equipes.js
│   └── V3__criar_ocorrencias.js
└── src/
    ├── server.js                 # conecta no banco e sobe o servidor
    ├── app.js                    # monta o Express e liga as classes
    ├── config/                   # conexão com o banco
    ├── docs/                     # contrato OpenAPI (Swagger)
    ├── controller/               # rotas HTTP + ApiExceptionHandler
    ├── service/                  # regras de negócio + exceções do domínio
    ├── mapper/                   # DTO ⇄ entidade
    ├── repository/               # acesso ao banco
    ├── model/                    # entidades e enum StatusOcorrencia
    └── dto/                      # DTOs de entrada e de saída + ErroDTO
```

Toda classe tem um comentário no topo com a camada, a responsabilidade, as regras e rotas que atende e a situação (`montada` ou `implementada`).

**Mapa da estrutura.** Todas as classes do projeto, por entidade e por camada. Cada classe fica na pasta da sua camada, em `src/`, exceto a migration, que fica em `db/migration/`.

| Entidade           | Migration                     | Model                      | Repository                           | DTOs                                                           | Mapper                       | Service                       | Controller                       |
| ------------------ | ----------------------------- | -------------------------- | ------------------------------------ | -------------------------------------------------------------- | ---------------------------- | ----------------------------- | -------------------------------- |
| Ocorrência         | `V3__criar_ocorrencias.js`, implementada | `Ocorrencia.js`, implementada | `OcorrenciaRepository.js`, implementada | `OcorrenciaRequestDTO.js` e `OcorrenciaResponseDTO.js`, implementados | `OcorrenciaMapper.js`, implementado | `OcorrenciaService.js`, implementado | `OcorrenciaController.js`, implementado |
| Categoria          | `V1__criar_categorias.js`, implementada | `Categoria.js`, implementada | `CategoriaRepository.js`, implementada | `CategoriaRequestDTO.js` e `CategoriaResponseDTO.js`, implementados | `CategoriaMapper.js`, implementado | `CategoriaService.js`, implementado | `CategoriaController.js`, implementado |
| Equipe responsável | `V2__criar_equipes.js`, implementada | `Equipe.js`, implementada | `EquipeRepository.js`, implementada | `EquipeRequestDTO.js` e `EquipeResponseDTO.js`, implementados | `EquipeMapper.js`, montado | `EquipeService.js`, montado | `EquipeController.js`, montado |

Peças de apoio: `StatusOcorrencia.js` (enum e regra de transição, em `model/`), `ErroDTO.js` (em `dto/`), `RegraDeNegocioError.js`, `RecursoNaoEncontradoError.js`, `OcorrenciaNaoEncontradaError.js` e `CategoriaNaoEncontradaError.js` (em `service/`) e `ApiExceptionHandler.js` (em `controller/`).

## Entidades

| Entidade           | O que representa                                                        | Como se relaciona                                                       |
| ------------------ | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Ocorrência         | Um problema urbano registrado no sistema.                               | Pertence a uma categoria e pode ser atribuída a uma equipe responsável. |
| Categoria          | O tipo de problema urbano, como iluminação, trânsito ou coleta de lixo. | Pode classificar várias ocorrências.                                    |
| Equipe responsável | O grupo encarregado de atender determinadas ocorrências.                | Pode ser responsável por várias ocorrências.                            |

Atributos, tipos e o diagrama das tabelas estão em [docs/modelo-de-dominio.md](docs/modelo-de-dominio.md).

## Rotas

O contrato completo, com JSON de entrada e saída, está em [docs/contrato-da-api.md](docs/contrato-da-api.md).

### As que já funcionam

| Verbo | Caminho                 | O que faz                                          | Regra   | Sucesso | Erros    |
| ----- | ----------------------- | -------------------------------------------------- | ------- | ------- | -------- |
| POST  | /ocorrencias            | Registra uma ocorrência.                           | R1 e R4 | 201     | 400, 404 |
| GET   | /ocorrencias            | Lista as ocorrências.                              | Nenhuma | 200     | -        |
| GET   | /ocorrencias/:id        | Consulta uma ocorrência.                           | Nenhuma | 200     | 400, 404 |
| PATCH | /ocorrencias/:id/status | Atualiza o status conforme as regras de negócio.   | R2 e R3 | 200     | 400, 404 |
| POST  | /categorias             | Cadastra uma categoria.                            | Nenhuma | 201     | 400      |
| GET   | /categorias             | Lista as categorias.                               | Nenhuma | 200     | -        |
| GET   | /categorias/:id         | Consulta uma categoria.                            | Nenhuma | 200     | 404      |

Exemplo de requisição:

```
POST /ocorrencias
Content-Type: application/json

{
  "titulo": "Poste sem iluminação",
  "descricao": "A lâmpada do poste em frente ao número 120 está queimada há uma semana.",
  "endereco": "Rua das Flores, 120",
  "categoria_id": 1
}
```

Resposta, `201 Created`:

```
{
  "id": 1,
  "titulo": "Poste sem iluminação",
  "descricao": "A lâmpada do poste em frente ao número 120 está queimada há uma semana.",
  "endereco": "Rua das Flores, 120",
  "status": "ABERTA",
  "data_criacao": "2026-10-15T19:30:00.000Z",
  "categoria_id": 1
}
```

O cliente não envia o campo `status`. Ele é definido pelo sistema (R1).

### As planejadas

| Verbo | Caminho proposto | O que vai fazer                  |
| ----- | ---------------- | -------------------------------- |
| POST  | /equipes         | Cadastrar uma equipe responsável. |
| GET   | /equipes         | Listar equipes responsáveis.     |
| GET   | /equipes/:id     | Consultar uma equipe responsável. |

As classes da entidade Equipe ficam apenas montadas nesta etapa, porque nenhuma regra de negócio depende delas. Por isso as rotas de `/equipes` ainda não funcionam.

### Erros

Todo erro sai no mesmo formato. Este é o `400` de uma regra de negócio violada:

```
{
  "timestamp": "2026-10-15T19:30:00.000Z",
  "status": 400,
  "error": "Regra de Negócio Violada",
  "message": "R2: uma ocorrência só pode passar para EM_ATENDIMENTO se estiver ABERTA (status atual: CONCLUIDA).",
  "path": "/ocorrencias/1/status"
}
```

A violação de R4 também devolve `400`, com a mensagem `R4: Já existe uma ocorrência ABERTA com este mesmo endereço e categoria.`

Um campo inválido também devolve `400`, com a lista `fields` dizendo qual campo corrigir. Um id que não existe devolve `404`. Um erro inesperado devolve `500`, sem expor detalhes internos.

## Como executar

Pré-requisitos: Node.js 22, Docker Desktop aberto e Git.

```
git clone https://github.com/LuizaBordignon/CidadesInteligentes.git
cd CidadesInteligentes
cp .env.example .env      # no Windows (PowerShell): copy .env.example .env

docker compose up -d      # sobe o PostgreSQL na porta 5437
npm install
npm run dev               # roda as migrations e sobe a API na porta 8080
```

Com a API no ar:

| Endereço                              | O que é                                                          |
| ------------------------------------- | ---------------------------------------------------------------- |
| <http://localhost:8080/api-docs>      | Swagger UI: as rotas, com **Try it out** para enviar requisições |
| <http://localhost:8080/api-docs.json> | O contrato OpenAPI em JSON                                       |

Para testar as rotas, use o Swagger UI ou o **Postman**. No Postman, importe todas as rotas de uma vez: **Import** → **Link** → `http://localhost:8080/api-docs.json`.

Para registrar uma ocorrência é preciso ter ao menos uma categoria cadastrada: comece com `POST /categorias`.

Para parar: `Ctrl+C` na API e `docker compose stop` no banco. Para apagar o banco e rodar as migrations do zero: `docker compose down -v` e suba de novo.

## Situação do projeto

| Parte        | Situação                                                                                                          |
| ------------ | ----------------------------------------------------------------------------------------------------------------- |
| Desenho      | Pronto: problema, regras e arquitetura neste README; modelo e contrato em `docs/`.                                |
| Estrutura    | Ocorrência e Categoria completas. Equipe com migration, model, repository e DTOs completos; mapper, service e controller montados. |
| API e regras | Funcionando: rotas de `/ocorrencias` e `/categorias`, com as regras R1, R2, R3 e R4.                              |

**Ainda não funciona:** as rotas de `/equipes` e a atribuição de equipe a uma ocorrência.

## Como o projeto atende aos critérios da revisão

Os critérios da revisão citam nomes do Java e do Spring. Como o projeto é em Node.js, esta seção diz onde cada critério aparece.

**Equivalência de ferramentas:**

| Na disciplina (Java)                    | Neste projeto (Node.js)                                                              |
| --------------------------------------- | ------------------------------------------------------------------------------------ |
| Spring Web (`@RestController`)          | Express 5, com os Controllers em `src/controller/`                                   |
| Bean Validation (`@Valid`)              | Schemas Zod nos DTOs de entrada, em `src/dto/`                                       |
| Spring Data JPA e `@Entity`             | TypeORM: entidade (`EntitySchema`) em `src/model/` e Repository em `src/repository/` |
| Flyway                                  | Migrations do TypeORM em `db/migration/`                                             |
| `record` como DTO                       | DTOs de entrada (schema Zod) e de saída (objeto só de dados), separados da entidade  |
| springdoc-openapi                       | swagger-ui-express, com o contrato em `src/docs/openapi.js`                          |
| `@RestControllerAdvice`                 | `ApiExceptionHandler`, middleware de erro em `src/controller/`                       |
| `RecursoNaoEncontradoException`         | `RecursoNaoEncontradoError` (e uma exceção própria por entidade)                     |
| `RegraDeNegocioException`               | `RegraDeNegocioError`, que vira `400`                                                |

**Critérios:**

| Critério                            | Como o projeto atende                                                                                                  |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| P1 Sobe pelo README                 | Os comandos de [Como executar](#como-executar) sobem o banco e a API. `npm run dev` roda as migrations antes de iniciar. |
| P2 Camadas                          | Cada classe está na pasta da sua camada (`controller`, `service`, `mapper`, `repository`, `model`, `dto`), com o nome `Entidade` + camada. |
| P3 Banco e entidades                | As migrations de `db/migration/` criam as 3 tabelas, com as chaves estrangeiras. Cada tabela tem a sua entidade em `src/model/`. O ORM não cria tabelas (`synchronize` desligado). A coluna opcional `equipe_id` existe no banco, mas o model de Ocorrência não a mapeia nesta etapa. |
| P4 DTOs                             | Cada entidade tem DTO de entrada, com validação Zod, e DTO de saída. O Controller e o JSON só usam DTO.               |
| P5 Estrutura completa e documentada | Cada entidade tem Repository, Mapper, Service e Controller. Ocorrência e Equipe são ligadas pelo construtor em `src/app.js`. Toda classe tem comentário no topo. O mapa da estrutura acima bate com as classes. |
| P6 API simples                      | `POST /ocorrencias`, `GET /ocorrencias` e `GET /ocorrencias/:id`. Campo inválido devolve `400`; id inexistente devolve `404`, com `OcorrenciaNaoEncontradaError` lançada no Service. |
| P7 Regras de negócio implementadas  | R1, R2, R3 e R4 ficam em `OcorrenciaService`. Cada violação lança `RegraDeNegocioError`, e a API devolve `400` com a regra na mensagem. |
| P8 Regras que atendem ao tema       | R1 a R3 controlam o ciclo de atendimento de uma ocorrência urbana. R4 evita chamados duplicados para o mesmo problema no mesmo lugar. |
| P9 Código igual ao desenho          | Entidades, colunas e rotas seguem [docs/modelo-de-dominio.md](docs/modelo-de-dominio.md) e [docs/contrato-da-api.md](docs/contrato-da-api.md). |
| P10 README                          | Este arquivo tem todas as seções, diz o que funciona e o que não funciona e explica como subir o projeto.             |

## Documentação

| Documento                                      | O que tem                                                    |
| ---------------------------------------------- | ------------------------------------------------------------ |
| [Modelo de domínio](docs/modelo-de-dominio.md) | Entidades, relacionamentos, diagrama das tabelas, migrations |
| [Contrato da API](docs/contrato-da-api.md)     | Todas as rotas, os DTOs, exemplos de JSON e erros            |
| [Autoavaliação](docs/autoavaliacao.md)         | Os critérios da revisão do código, marcados pelo grupo       |
