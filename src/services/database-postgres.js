import { randomUUID } from 'node:crypto'
import { sql } from '../config/db.js'; // Importe a configuração do banco de dados

export class DatabasePostgres {
    // Método para listar tarefas
    async list(search) {
        let tarefas;

        if (search) {
            // Busca tarefas onde o título ou a descrição contém o termo de pesquisa
            tarefas = await sql`
                SELECT * FROM tarefas 
                WHERE titulo ILIKE ${'%' + search + '%'} 
                   OR descricao ILIKE ${'%' + search + '%'}
            `;
        } else {
            // Busca todas as tarefas
            tarefas = await sql`SELECT * FROM tarefas`;
        }

        return tarefas;
    }

    // Método para criar uma nova tarefa
    async create(tarefa) {
        const { titulo, descricao, status } = tarefa;
        const id = randomUUID(); // Gera um UUID único

        // Insere a tarefa no banco de dados
        await sql`
            INSERT INTO tarefas (id, titulo, descricao, status) 
            VALUES (${id}, ${titulo}, ${descricao}, ${status})
        `;
    }

    // Método para atualizar uma tarefa existente
    async update(id, tarefa) {
        const { titulo, descricao, status } = tarefa;

        // Atualiza a tarefa no banco de dados
        await sql`
            UPDATE tarefas 
            SET titulo = ${titulo}, descricao = ${descricao}, status = ${status} 
            WHERE id = ${id}
        `;
    }

    // Método para deletar uma tarefa
    async delete(id) {
        // Remove a tarefa do banco de dados
        await sql`DELETE FROM tarefas WHERE id = ${id}`;
    }
}