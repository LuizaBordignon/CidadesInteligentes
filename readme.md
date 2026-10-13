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

**Regras de negócio.** As regras abaixo são propostas para o projeto e deverão ser implementadas e verificadas no código. Quando uma regra é violada, a API devolve `400` com uma mensagem que explica a regra.

| #   | Regra                                                                   | Onde está no código                                                                             | Rota que usa                    |
| --- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------- |
| R1  | Toda ocorrência nova deve iniciar com o status ABERTA.                  | `src/service/OcorrenciaService.js` (método `criar`)                                              | `POST /ocorrencias`             |
| R2  | Uma ocorrência só pode passar para EM_ATENDIMENTO se estiver ABERTA.    | `src/service/OcorrenciaService.js` (método `atualizarStatus`) e `src/model/StatusOcorrencia.js` | `PATCH /ocorrencias/:id/status` |
| R3  | Uma ocorrência só pode passar para CONCLUIDA se estiver EM_ATENDIMENTO. | `src/service/OcorrenciaService.js` (método `atualizarStatus`) e `src/model/StatusOcorrencia.js` | `PATCH /ocorrencias/:id/status` |
| R4  | Não pode existir mais de uma ocorrência ABERTA com o mesmo endereço e a mesma categoria. Assim a mesma lâmpada queimada não gera vários chamados. | `src/service/OcorrenciaService.js` (método `criar`) e `src/repository/OcorrenciaRepository.js` (consulta de ocorrência aberta) | `POST /ocorrencias` |

**Fora do escopo:** aplicativo móvel, integração com sensores urbanos em tempo real, geolocalização automática e integração direta com sistemas da prefeitura. Também não fazem parte desta etapa as rotas `PUT` e `DELETE` e o frontend.

## Tecnologias

| O quê               | Qual                               |
| ------------------- | ---------------------------------- |
| Linguagem           | JavaScript                         |
| Runtime             | Node.js 22 (LTS)                   |
| Framework web       | Express 5                          |
| Banco de dados      | PostgreSQL 16, em Docker           |
| ORM e repositórios  | TypeORM (entidades com `EntitySchema`) |
| Migrations          | Migrations do TypeORM, versionadas em `db/migration/` |
| Validação           | Zod                                |
| Documentação da API | swagger-ui-express + swagger-jsdoc |

O projeto usa Node.js em vez de Java + Spring Boot. A tabela da seção [Como o projeto atende aos critérios da revisão](#como-o-projeto-atende-aos-critérios-da-revisão) mostra o equivalente de cada peça.

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
cidadeativa/
├── README.md                     # problema, regras, mapa da estrutura, como executar
├── docker-compose.yml            # PostgreSQL
├── .env
├── .env.example
├── package-lock.json
├── package.json
├── docs/                         # o desenho
│   ├── modelo-de-dominio.md
│   ├── contrato-da-api.md
│   └── autoavaliacao.md
├── db/migration/                 # V1__..., V2__..., V3__...
│   ├── V1__criar_categorias.js
│   ├── V2__criar_equipes.js
│   └── V3__criar_ocorrencias.js
├── node_modules/
└── src/                          # o código
    ├── server.js                 # sobe o servidor
    ├── app.js                    # monta o Express e liga as classes pelo construtor
    ├── config/                   # conexão com o banco e Swagger
    ├── controller/               # rotas HTTP + ApiExceptionHandler
    ├── service/                  # regras de negócio + exceções do domínio
    ├── mapper/                   # DTO ⇄ entidade
    ├── repository/               # acesso ao banco
    ├── model/                    # entidades e enum StatusOcorrencia
    └── dto/                      # DTOs de entrada e de saída + ErroDTO
```

Toda classe tem um comentário no topo com a camada, a responsabilidade, as regras e rotas que atende e a situação (`montada` ou `implementada`).

**Mapa da estrutura.** Todas as classes do projeto, por entidade e por camada. Cada classe fica na pasta da sua camada, em `src/`, exceto a migration, que fica em `db/migration/`.

| Entidade           | Migration                          | Model                | Repository                    | DTOs                                                     | Mapper                    | Service                    | Controller                    |
| ------------------ | ---------------------------------- | -------------------- | ----------------------------- | -------------------------------------------------------- | ------------------------- | -------------------------- | ----------------------------- |
| Ocorrência         | `V3__criar_ocorrencias.js`, planejada | `Ocorrencia.js`, planejada | `OcorrenciaRepository.js`, planejada | `OcorrenciaRequestDTO.js` e `OcorrenciaResponseDTO.js`, planejados | `OcorrenciaMapper.js`, planejado | `OcorrenciaService.js`, planejado | `OcorrenciaController.js`, planejado |
| Categoria          | `V1__criar_categorias.js`, planejada | `Categoria.js`, planejada | `CategoriaRepository.js`, planejada | `CategoriaRequestDTO.js` e `CategoriaResponseDTO.js`, planejados | `CategoriaMapper.js`, planejado | `CategoriaService.js`, planejado | `CategoriaController.js`, planejado |
| Equipe responsável | `V2__criar_equipes.js`, planejada  | `Equipe.js`, planejada | `EquipeRepository.js`, planejada | `EquipeRequestDTO.js` e `EquipeResponseDTO.js`, planejados | `EquipeMapper.js`, planejado | `EquipeService.js`, planejado | `EquipeController.js`, planejado |

Peças de apoio: `StatusOcorrencia.js` (enum e regra de transição, em `model/`), `ErroDTO.js` (em `dto/`), `RegraDeNegocioError.js` e `RecursoNaoEncontradoError.js` (em `service/`, com uma exceção própria por entidade, como `OcorrenciaNaoEncontradaError`) e `ApiExceptionHandler.js` (em `controller/`).

Ao implementar cada componente, troque "planejada" por "montada" ou "implementada".

## Entidades

| Entidade           | O que representa                                                        | Como se relaciona                                                       |
| ------------------ | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Ocorrência         | Um problema urbano registrado no sistema.                               | Pertence a uma categoria e pode ser atribuída a uma equipe responsável. |
| Categoria          | O tipo de problema urbano, como iluminação, trânsito ou coleta de lixo. | Pode classificar várias ocorrências.                                    |
| Equipe responsável | O grupo encarregado de atender determinadas ocorrências.                | Pode ser responsável por várias ocorrências.                            |

Atributos, tipos e o diagrama das tabelas estão em [docs/modelo-de-dominio.md](docs/modelo-de-dominio.md).

## Rotas

As rotas abaixo são uma proposta inicial de contrato. A existência e o funcionamento de cada endpoint precisam ser conferidos no código.

### As que já funcionam

Nenhuma rota foi implementada ainda. Esta tabela será preenchida conforme as rotas passarem a funcionar.

| Verbo | Caminho | O que faz | Regra | Sucesso | Erros |
| ----- | ------- | --------- | ----- | ------- | ----- |
| ...   | ...     | ...       | ...   | ...     | ...   |

Exemplo de requisição *(contrato proposto, ainda não implementado)*:

```
POST /ocorrencias
Content-Type: application/json

{
  "titulo": "Poste sem iluminação",
  "descricao": "A lâmpada do poste em frente ao número 120 está queimada há uma semana.",
  "endereco": "Rua das Flores, 120",
  "categoriaId": 1
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
  "categoriaId": 1,
  "equipeId": null
}
```

O cliente não envia o campo `status`. Ele é definido pelo sistema (R1).

### As planejadas

| Verbo | Caminho proposto        | O que vai fazer                                        | Regra   |
| ----- | ----------------------- | ------------------------------------------------------ | ------- |
| POST  | /ocorrencias            | Registrar uma ocorrência urbana.                       | R1 e R4 |
| GET   | /ocorrencias            | Listar ocorrências cadastradas.                        | Nenhuma |
| GET   | /ocorrencias/:id        | Consultar uma ocorrência específica.                   | Nenhuma |
| PATCH | /ocorrencias/:id/status | Atualizar o status conforme as regras de negócio.      | R2 e R3 |
| POST  | /categorias             | Cadastrar uma categoria, necessária para registrar ocorrências. | Nenhuma |
| GET   | /categorias             | Listar categorias disponíveis.                         | Nenhuma |
| GET   | /categorias/:id         | Consultar uma categoria.                               | Nenhuma |
| POST  | /equipes                | Cadastrar uma equipe responsável.                      | Nenhuma |
| GET   | /equipes                | Listar equipes responsáveis.                           | Nenhuma |
| GET   | /equipes/:id            | Consultar uma equipe responsável.                      | Nenhuma |

As rotas de `/equipes` ficam no contrato, mas as classes da entidade Equipe ficam apenas montadas nesta etapa, porque nenhuma regra de negócio depende delas.

O contrato completo, com as rotas definitivas, DTOs e exemplos de JSON, estará em [docs/contrato-da-api.md](docs/contrato-da-api.md).

### Erros

Todo erro sai no mesmo formato. Este é o `400` de uma regra de negócio violada *(exemplo)*:

```
{
  "status": 400,
  "erro": "Bad Request",
  "mensagem": "R2: a ocorrência só pode ir para EM_ATENDIMENTO se estiver ABERTA",
  "caminho": "/ocorrencias/1/status",
  "timestamp": "2026-10-06T19:30:00",
  "campos": []
}
```

A violação de R4 também devolve `400`, com a mensagem `R4: já existe uma ocorrência ABERTA com este endereço e esta categoria`.

Um campo inválido também devolve `400`, com a lista `campos` dizendo qual campo corrigir. Um id que não existe devolve `404`. Um erro inesperado devolve `500`, sem expor detalhes internos.

## Como executar

Pré-requisitos: Node.js 22, Docker Desktop aberto e Git.

```
git clone https://github.com/LuizaBordignon/CidadesInteligentes.git
cd CidadesInteligentes
cp .env.example .env

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

Para parar: `Ctrl+C` na API e `docker compose stop` no banco. Para apagar o banco e rodar as migrations do zero: `docker compose down -v` e suba de novo.

## Situação do projeto

| Parte        | Situação                                                                                                  |
| ------------ | --------------------------------------------------------------------------------------------------------- |
| Desenho      | Em andamento: problema, regras e arquitetura neste README; modelo e contrato em `docs/`.                  |
| Estrutura    | Planejada: as 3 entidades ainda não têm migration, entidade, Repository, DTOs, Mapper, Service e Controller. |
| API e regras | Não iniciadas: a API simples e as regras R1, R2, R3 e R4 ainda não estão implementadas.                       |

**Ainda não funciona:** todas as rotas planejadas.

## Como o projeto atende aos critérios da revisão

Os critérios da revisão citam nomes do Java e do Spring. Como o projeto é em Node.js, esta seção diz onde cada critério aparece.

**Equivalência de ferramentas:**

| Na disciplina (Java)                    | Neste projeto (Node.js)                                              |
| --------------------------------------- | -------------------------------------------------------------------- |
| Spring Web (`@RestController`)          | Express 5, com os Controllers em `src/controller/`                   |
| Bean Validation (`@Valid`)              | Schemas Zod nos DTOs de entrada, em `src/dto/`                       |
| Spring Data JPA e `@Entity`             | TypeORM: entidade (`EntitySchema`) em `src/model/` e Repository em `src/repository/` |
| Flyway                                  | Migrations do TypeORM em `db/migration/`                             |
| `record` como DTO                       | DTOs de entrada (schema Zod) e de saída (objeto só de dados), separados da entidade |
| springdoc-openapi                       | swagger-ui-express + swagger-jsdoc, em `src/config/`                 |
| `@RestControllerAdvice`                 | `ApiExceptionHandler`, middleware de erro em `src/controller/`       |
| `RecursoNaoEncontradoException`         | `RecursoNaoEncontradoError` (e uma exceção própria por entidade)     |
| `RegraDeNegocioException`               | `RegraDeNegocioError`, que vira `400`                                |

**Critérios:**

| Critério                            | Como o projeto atende                                                                                                  |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| P1 Sobe pelo README                 | Os comandos de [Como executar](#como-executar) sobem o banco e a API. `npm run dev` roda as migrations antes de iniciar. |
| P2 Camadas                          | Cada classe está na pasta da sua camada (`controller`, `service`, `mapper`, `repository`, `model`, `dto`), com o nome `Entidade` + camada. |
| P3 Banco e entidades                | As migrations de `db/migration/` criam as 3 tabelas, com as chaves estrangeiras. Cada tabela tem a sua entidade em `src/model/`. O ORM não cria tabelas (`synchronize` desligado). |
| P4 DTOs                             | Cada entidade tem DTO de entrada, com validação Zod, e DTO de saída. O Controller e o JSON só usam DTO.               |
| P5 Estrutura completa e documentada | Cada entidade tem Repository, Mapper, Service e Controller, ligados pelo construtor em `src/app.js`. Toda classe tem comentário no topo. O mapa da estrutura acima bate com as classes. |
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
