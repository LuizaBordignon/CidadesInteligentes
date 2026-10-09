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
- [Documentação](#documentação)

## Integrantes

| Nome | GitHub |
|---|---|
| Luiza Bordignon Moro | [@LuizaBordignon](https://github.com/LuizaBordignon) |
| Estér Frank Schulter Serafim | [@esterfrank](https://github.com/esterfrank) |
| Bruno Costa Ghisi| [@BrunoCGhisi](https://github.com/BrunoCGhisi) |

## O problema

**Tema sorteado:** Cidades Inteligentes

Problemas urbanos, como lâmpadas queimadas, acúmulo de lixo e semáforos com defeito, podem prejudicar a segurança e a qualidade de vida da população. Sem um sistema centralizado, torna-se mais difícil organizar essas ocorrências e acompanhar as providências tomadas. O Cidades Inteligentes propõe uma API para registrar os problemas, classificá-los por categoria e acompanhar seu atendimento pelas equipes responsáveis.

**Quem usa o sistema:**
| Quem | O que faz no sistema |
|---|---|
| Administrador | Gerencia as categorias e as equipes responsáveis |
| Agente responsável | Consulta as ocorrências e atualiza seu andamento |
| Cidadão | Registra ocorrências urbanas e consulta seu status

**Regras de negócio.** 
As regras abaixo são propostas para o projeto e deverão ser implementadas e verificadas no código.

| # | Regra | Onde está no código | Rota que usa |
|---|---|---|---|
| R1 | Toda ocorrência nova deve iniciar com o status ABERTA. | A confirmar | POST /ocorrencias |
| R2 | Uma ocorrência só pode passar para EM_ATENDIMENTO se estiver ABERTA. | A confirmar | A definir |
| R3 | Uma ocorrência só pode passar para CONCLUIDA se estiver EM_ATENDIMENTO. | A confirmar | A definir |

**Fora do escopo:**
aplicativo móvel, integração com sensores urbanos em tempo real, geolocalização automática e integração direta com sistemas da prefeitura.

## Tecnologias

| O quê | Qual |
|---|---|
| Linguagem | JavaScript |
| Runtime | Node.js |
| Banco de dados | PostgreSQL 16, em Docker |
| Migrations | Flyway |
| Documentação da API | springdoc-openapi (Swagger UI) |

## Arquitetura

A API é organizada em camadas. Uma requisição entra pelo Controller, passa pelo Service, que aplica as regras de negócio, e chega ao banco pelo Repository. A resposta faz o caminho de volta. O Mapper converte DTOs em entidades e entidades em DTOs de resposta.


**Mapa da estrutura.**
As classes e a situação de cada componente devem ser confirmadas após a análise do código.

| Entidade | Migration | Model | Repository | DTOs | Mapper | Service | Controller |
|---|---|---|---|---|---|---|---|
| Ocorrência | `V1__criar_livros.sql`, pronta | `Livro`, pronta | `LivroRepository`, pronto | `LivroRequestDTO`, `LivroResponseDTO`, prontos | `LivroMapper`, implementado | `LivroService`, implementado | `LivroController`, implementado |
| Categoria | ... | ... | ... | ... | ... | ... | ... |
| Equipe responsável | ... | ... | ... | ... | ... | ... | ... |


## Entidades

| Entidade | O que representa | Como se relaciona |
|---|---|---|
| Ocorrência | Um problema urbano registrado no sistema. | Pertence a uma categoria e pode ser atribuída a uma equipe responsável. |
| Categoria | O tipo de problema urbano, como iluminação, trânsito ou coleta de lixo. | Pode classificar várias ocorrências |
| Equipe responsável | O grupo encarregado de atender determinadas ocorrências | Pode ser responsável por várias ocorrências. |

Atributos, tipos e o diagrama das tabelas estão em [docs/modelo-de-dominio.md](docs/modelo-de-dominio.md).

## Rotas

As rotas abaixo são uma proposta inicial de contrato. A existência e o funcionamento de cada endpoint precisam ser conferidos no código.

### As que já funcionam

As rotas implementadas serão listadas aqui após os testes da API.

| Verbo | Caminho | O que faz | Regra | Sucesso | Erros |
|---|---|---|---|---|---|
| `POST` *(exemplo)* | `/livros` | Cadastra um livro | Nenhuma | `201` | `400` |
| `POST` *(exemplo)* | `/emprestimos` | Registra um empréstimo | R1 e R2 | `201` | `400`, `404` |
| ... | ... | ... | ... | ... | ... |

Exemplo de requisição *(exemplo: troque por uma rota do grupo)*:

```http
POST /livros
Content-Type: application/json

{
  "titulo": "Dom Casmurro",
  "isbn": "978-85-359-0277-5"
}
```

Resposta, `201 Created`:

```json
{
  "id": 1,
  "titulo": "Dom Casmurro",
  "isbn": "978-85-359-0277-5",
  "disponivel": true
}
```
### As planejadas
| Verbo | Caminho proposto | O que vai fazer |
|---|---|---|---|---|---|
| POST | /ocorrencias | Registrar uma ocorrência urbana. |
| GET | /ocorrencias | Listar ocorrências cadastradas. |
| GET | /ocorrencias/{id} | Consultar uma ocorrência específica. |
| PATCH | /ocorrencias/{id}/status | Atualizar o status conforme as regras de negócio. |
| GET | /categorias | Listar categorias disponíveis. |
| GET | /equipes | Listar equipes responsáveis. |

O contrato completo, com as rotas definitivas, DTOs e exemplos de JSON, estará em docs/contrato-da-api.md.

### Erros

Todo erro sai no mesmo formato. Este é o `400` de uma regra de negócio violada *(exemplo)*:

```json
{
  "status": 400,
  "erro": "Bad Request",
  "mensagem": "R2: o livro já está emprestado",
  "caminho": "/emprestimos",
  "timestamp": "2026-10-06T19:30:00",
  "campos": []
}
```

Um campo inválido também devolve `400`, com a lista `campos` dizendo qual campo corrigir. Um id que não existe devolve `404`.

## Como executar

Pré-requisitos: JDK 25, Docker Desktop aberto e Git.

```bash
git clone https://github.com/{{usuario}}/{{repositorio}}.git
cd {{repositorio}}

docker compose up -d          # sobe o PostgreSQL na porta 5437
./mvnw spring-boot:run        # Windows: .\mvnw.cmd spring-boot:run
```

Com a API no ar:

| Endereço | O que é |
|---|---|
| <http://localhost:8080/swagger-ui.html> | Swagger UI: as rotas, com **Try it out** para enviar requisições |
| <http://localhost:8080/v3/api-docs> | O contrato OpenAPI em JSON |

Para testar as rotas, use o Swagger UI ou o **Postman**. No Postman, importe todas as rotas de uma vez: **Import** → **Link** → `http://localhost:8080/v3/api-docs`.

Para parar: `Ctrl+C` na API e `docker compose stop` no banco. Para apagar o banco e rodar as migrations do zero: `docker compose down -v` e suba de novo.

## Situação do projeto

| Parte | Situação |
|---|---|
| Desenho | {{ex.: completo: problema e regras neste README, modelo e contrato em docs/}} |
| Estrutura | {{ex.: as 3 entidades têm migration, entidade, Repository, DTOs, Mapper, Service e Controller}} |
| API e regras | {{ex.: as rotas de livros funcionam; R1, R2 e R3 estão implementadas}} |

**Ainda não funciona:** {{as rotas planejadas que ainda não respondem}}

## Documentação

| Documento | O que tem |
|---|---|
| [Modelo de domínio](docs/modelo-de-dominio.md) | Entidades, relacionamentos, diagrama das tabelas, migrations |
| [Contrato da API](docs/contrato-da-api.md) | Todas as rotas, os DTOs, exemplos de JSON e erros |
| [Autoavaliação](docs/autoavaliacao.md) | Os critérios da revisão do código, marcados pelo grupo |