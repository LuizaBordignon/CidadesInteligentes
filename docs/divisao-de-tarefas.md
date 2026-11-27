# Divisão de tarefas — Projeto Final (N3), carta C2 Caixa de Vidro

Critérios da carta C2 (3 para cumprir):

1. Operações críticas (criar, atualizar, excluir) geram log com nível INFO/WARN/ERROR.
2. Suíte de testes cobrindo um Service, com casos de sucesso e de erro.
3. Testes rodam por comando único, sem intervenção manual (`npm test`).

Decisões propostas (a confirmar): logger `pino`, runner `node:test` nativo, Service testado `OcorrenciaService`.

## Luiza — Logging estruturado (critério 1)

- Instalar `pino`; criar `src/config/logger.js` exportando uma instância única.
- Logar em `OcorrenciaService.criar` e `atualizarStatus`: INFO no sucesso (com `id`, `status`), WARN quando lançar `RegraDeNegocioError` (R2, R3, R4) ou 404.
- Logar em `CategoriaService.criar`: INFO no sucesso, WARN na duplicidade.
- Em `ApiExceptionHandler`: trocar `console.error` por `logger.error` (500); `logger.warn` para 400/404.
- Em `server.js`: trocar `console.log`/`console.error` pelo logger.
- Injetar o logger por construtor nos Services (para os testes conseguirem simular).

Pronto quando: ao criar e mudar status de uma ocorrência, o terminal mostra linhas JSON com nível correto.

## Bruno — Testes do OcorrenciaService (critérios 2 e 3)

- Criar `test/OcorrenciaService.test.js` com `node:test` e `assert`, usando mocks de repository, mapper e categoriaService.
- Sucesso: `criar` define status ABERTA (R1); `atualizarStatus` ABERTA→EM_ATENDIMENTO; EM_ATENDIMENTO→CONCLUIDA.
- Erro: R4 (duplicada), R2, R3, transição inválida, `OcorrenciaNaoEncontradaError` em `buscarPorId`/`atualizarStatus`.
- Adicionar em `package.json`: `"test": "node --test"`.
- Depende da Luiza apenas para passar o logger simulado no construtor; combinar a assinatura antes.

Pronto quando: `npm test` roda sozinho e passa, com casos de sucesso e de erro.

## Ester — Testes do CategoriaService + documentação

- Criar `test/CategoriaService.test.js`: criar com sucesso, nome duplicado (400), `buscarPorId` inexistente (404).
- Atualizar `readme.md`: carta sorteada (C2) e como foi implementada, como rodar `npm test`, tecnologias novas (pino, node:test), limitações.
- Escrever a Entrega 01 (Plano da Carta) em `docs/plano-da-carta.md`: carta, entidades/rotas afetadas, dependências novas, maior risco.

Pronto quando: README cobre o item "Qual carta-desafio foi sorteada e como foi implementada" e o plano está no repo.

## Pendências fora do C2 (verificadas no código atual, a decidir quem pega)

- Listagem sem paginação/ordenação e sem filtros (`listar()` nos três Services).
- Sem `PUT` e sem `DELETE` em nenhuma entidade (exigência de CRUD completo e de logs de atualizar/excluir).
- Aplicação prática (IoT, visualização, tempo real ou simulação): não conferi se existe.
- Seção "Limitações" e exemplos de erros HTTP no README.

## Ordem

1. Todos: confirmar as 3 decisões propostas.
2. Luiza e Bruno combinam a assinatura do construtor (logger) e trabalham em paralelo.
3. Ester em paralelo; no fim, README com o resultado real do `npm test`.
