import { Router } from "express";
import { CategoriaService } from "../service/CategoriaService.js";
import { CategoriaRequestSchema } from "../dto/CategoriaRequestDTO.js";

const router = Router();
const service = new CategoriaService();

// POST /categorias
router.post("/", async (req, res, next) => {
  try {
    // Valida os dados usando o Zod
    const dadosValidados = CategoriaRequestSchema.parse(req.body);
    const novaCategoria = await service.criar(dadosValidados);
    return res.status(201).json(novaCategoria);
  } catch (error) {
    next(error);
  }
});

// GET /categorias
router.get("/", async (req, res, next) => {
  try {
    const categorias = await service.listar();
    return res.json(categorias);
  } catch (error) {
    next(error);
  }
});

// GET /categorias/:id
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const categoria = await service.buscarPorId(id);
    return res.json(categoria);
  } catch (error) {
    next(error);
  }
});

export default router;