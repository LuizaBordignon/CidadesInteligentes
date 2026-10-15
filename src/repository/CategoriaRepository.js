// CAMADA: Repository
// RESPONSABILIDADE: Comunicar-se com o banco de dados para salvar e buscar categorias.
// REGRAS: Nenhuma regra de negócio nesta classe, apenas acesso a dados.
// ROTAS ATENDIDAS: Nenhuma diretamente.
// SITUAÇÃO: implementada.

import { CategoriaSchema } from "../model/Categoria.js";

export class CategoriaRepository {
  constructor(dataSource) {
    this.repository = dataSource.getRepository(CategoriaSchema);
  }

  async criar(categoriaData) {
    const categoria = this.repository.create(categoriaData);
    return await this.repository.save(categoria);
  }

  async listar() {
    return await this.repository.find();
  }

  async buscarPorId(id) {
    return await this.repository.findOneBy({ id });
  }

  async buscarPorNome(nome) {
    return await this.repository.findOneBy({ nome });
  }
}
