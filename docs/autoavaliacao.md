# Autoavaliação

Os 10 critérios que serão avaliados na revisão do código, descritos em `Aula 10-11/AVALIACAO.md`, no repositório da disciplina. Para cada um, a marca do grupo e onde está a evidência. O projeto é em Node.js: a seção "Como o projeto atende aos critérios da revisão" do `README.md` mostra o equivalente de cada nome do Java.

- ✅ atende
- ◐ atende em parte (diga o que falta)
- ❌ não atende

| Critério | Marca | Evidência |
|---|---|---|
| P1 A API sobe seguindo o README | ✅ | `README.md`, seção "Como executar". `npm run dev` roda as migrations (`npm run migration:run`) e depois sobe a API |
| P2 Cada classe no pacote da sua camada | ✅ | `src/controller/`, `src/service/`, `src/mapper/`, `src/repository/`, `src/model/` e `src/dto/` |
| P3 Migrations e entidades de todas as tabelas, e a API sobe | ◐ | `V1` a `V3` em `db/migration/` (as chaves estrangeiras estão na `V3`); `Categoria`, `Equipe` e `Ocorrencia` em `src/model/`, com `synchronize: false`. Falta: o model `Ocorrencia` não mapeia a coluna `equipe_id`, que existe na `V3` |
| P4 DTOs de entrada e de saída de todas as entidades | ✅ | Seis DTOs em `src/dto/`, com validação Zod nos de entrada. Nenhum controller importa de `src/model/` |
| P5 Repository, Mapper, Service e Controller de todas, com o comentário no topo, e o mapa da estrutura | ✅ | As classes das quatro pastas, ligadas pelo construtor em `src/app.js`; as de Equipe estão montadas. Mapa no `README.md`, seção "Arquitetura" |
| P6 API simples: `POST`, `GET` e `GET /{id}`, com `400` e `404` | ✅ | `CategoriaController`; o `404` vem de `CategoriaNaoEncontradaError`, filha de `RecursoNaoEncontradoError` |
| P7 No mínimo 3 regras de negócio implementadas, com `400` quando violadas | ✅ | R1, R2, R3 e R4 em `OcorrenciaService`, usadas por `POST /ocorrencias` e `PATCH /ocorrencias/:id/status`; a transição de status está em `StatusOcorrencia` |
| P8 As regras atendem ao problema e ao tema | ✅ | `README.md`, seção "O problema": as regras organizam o atendimento das ocorrências urbanas e evitam chamados duplicados para o mesmo problema |
| P9 Código igual ao desenho | ◐ | `docs/modelo-de-dominio.md` e `docs/contrato-da-api.md`. Falta: o contrato não cita o `400` para JSON inválido nem o `400` para id inválido em `GET /categorias/:id` |
| P10 README completo e bem escrito | ✅ | `README.md`, conferido no GitHub |

**Pontos que o grupo espera no projeto:** 4,5

A apresentação vale os outros 5,0 pontos: são 3 perguntas, feitas na Aula 11.
