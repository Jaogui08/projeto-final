import { Usuario } from "@/src/models/Usuario";

export class UsuarioService {
    constructor(repository) {
        this.repository = repository;
    }

    async cadastrar(nome, email, senha, tipo) {
        if (!nome || nome.length < 2)
            throw new Error("O nome deve ter no mínimo 2 caracteres");

        if (!email)
            throw new Error("O email é obrigatório");

        if (!senha || senha.length < 6)
            throw new Error("A senha deve ter no mínimo 6 caracteres");

        if (!tipo)
            throw new Error("O tipo de usuário é obrigatório");

        return await this.repository.salvar(
            new Usuario(nome, email, senha, tipo)
        );
    }

    async listar() {
        return await this.repository.listarTodos();
    }

    async buscarPorId(id) {
        const usuario = await this.repository.buscarPorId(id);

        if (!usuario)
            throw new Error("Usuário não encontrado");

        return usuario;
    }

    async atualizar(id, nome, email, senha, tipo) {
        if (!id)
            throw new Error("ID é obrigatório para atualização");

        if (!nome || !email || !senha || !tipo)
            throw new Error("Nome, email, senha e tipo são obrigatórios");

        await this.buscarPorId(id);

        const usuarioAtualizado = new Usuario(
            nome,
            email,
            senha,
            tipo,
            id
        );

        return await this.repository.atualizar(id, usuarioAtualizado);
    }

    async excluir(id) {
        await this.buscarPorId(id);

        return await this.repository.excluir(id);
    }
}