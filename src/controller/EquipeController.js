import { Router } from "express";

export class EquipeController {
    constructor(equipeService) {
        this.router = Router();
        this.equipeService = equipeService;
    }
}