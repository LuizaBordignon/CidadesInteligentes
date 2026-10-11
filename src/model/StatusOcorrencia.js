// CAMADA: Model / Utilitário de Negócio
// RESPONSABILIDADE: Centralizar os estados possíveis e as regras de transição.
// REGRAS: Define que o fluxo é sequencial e não permite pular etapas.
// SITUAÇÃO: implementada.

export const StatusOcorrencia = {
    ABERTA: 'ABERTA',
    EM_ATENDIMENTO: 'EM_ATENDIMENTO',
    CONCLUIDA: 'CONCLUIDA',
};

const transicoesPermitidas = {
    [StatusOcorrencia.ABERTA]: [StatusOcorrencia.EM_ATENDIMENTO],
    [StatusOcorrencia.EM_ATENDIMENTO]: [StatusOcorrencia.CONCLUIDA],
    [StatusOcorrencia.CONCLUIDA]: [],
};

export class ValidadorStatusOcorrencia {
    static ehPermitida(statusAtual, novoStatus){
        const permitidos = transicoesPermitidas[statusAtual] || [];
        return permitidos.includes(novoStatus);
    }
}