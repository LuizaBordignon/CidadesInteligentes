// CAMADA: Controller
// RESPONSABILIDADE: Receber as requisições HTTP, repassar para o service e devolver a resposta.
// REGRAS: O controller não tem lógica de negócio; apenas gerencia rotas e repassa erros para o handler.
// ROTAS ATENDIDAS: As rotas de ocorrências (/ocorrencias).
// SITUAÇÃO: implementada.

import { Router } from 'express';
import { OcorrenciaRequestDTO } from '../dto/OcorrenciaRequestDTO.js';

export class OcorrenciaController {
    constructor(ocorrenciaService) {
        this.router = Router();
        this.ocorrenciaService = ocorrenciaService;
        this.configurarRotas();
    }

    configurarRotas() {
        this.router.post('/', async (req, res, next) => {
            try {
                const requestDTO = new OcorrenciaRequestDTO(req.body);
                const novaOcorrencia = await this.ocorrenciaService.criar(requestDTO);
                return res.status(201).json(novaOcorrencia);
            } catch (erro) {
                next(erro);
            }
        });

        this.router.get('/', async (req, res, next) => {
            try {
                const ocorrencias = await this.ocorrenciaService.listar();
                return res.status(200).json(ocorrencias);
            } catch (erro) {
                next(erro);
            }
        });

        this.router.get('/:id', async (req, res, next) => {
            try {
                const { id } = req.params;
                const ocorrencia = await this.ocorrenciaService.buscarPorId(id);
                return res.status(200).json(ocorrencia);
            } catch (erro) {
                next(erro);
            }
        });

        this.router.patch('/:id/status', async (req, res, next) => {
            try {
                const { id } = req.params;
                const { status } = req.body;
                const ocorrenciaAtualizada = await this.ocorrenciaService.atualizarStatus(id, status);
                return res.status(200).json(ocorrenciaAtualizada);
            } catch (erro) {
                next(erro);
            }
        });
    }
}