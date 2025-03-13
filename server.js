import { fastify } from 'fastify';
import { DatabasePostgres } from './src/services/database-postgres.js';
import fastifyCors from '@fastify/cors';

const server = fastify();

const database = new DatabasePostgres();

// Configuração do CORS
server.register(fastifyCors, {
    origin: true, // Permite todas as origens
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
});

// =========================
// Rotas da API de tarefas
// =========================

// Rota para listar todas as tarefas (com busca opcional)
server.get('/tarefas', async (request) => {
    const search = request.query.search; // Parâmetro de busca opcional

    const tarefas = await database.list(search); // Lista as tarefas
    console.log('Tarefas retornadas:', tarefas); // Log para depuração
    return tarefas;
});

// Rota para criar uma nova tarefa
server.post('/tarefas', async (request, response) => {
    const { titulo, descricao, status } = request.body;

    await database.create({
        titulo,
        descricao,
        status
    });

    return response.status(201).send(); // Retorna status 201 (Created)
});

// Rota para atualizar uma tarefa existente
server.put('/tarefas/:id', async (request, response) => {
    const tarefaId = request.params.id; // ID da tarefa a ser atualizada
    const { titulo, descricao, status } = request.body;

    await database.update(tarefaId, {
        titulo,
        descricao,
        status
    });

    return response.status(204).send(); // Retorna status 204 (No Content)
});

// Rota para deletar uma tarefa
server.delete('/tarefas/:id', async (request, response) => {
    const tarefaId = request.params.id; // ID da tarefa a ser deletada

    await database.delete(tarefaId);

    return response.status(204).send(); // Retorna status 204 (No Content)
});

// Iniciar o servidor
server.listen({
    host: '0.0.0.0', // Escuta em todas as interfaces de rede
    port: process.env.PORT ?? 3000, // Usa a porta definida no ambiente ou 3000
}, () => {
    console.log(`Servidor rodando em http://localhost:${process.env.PORT ?? 3000}`);
});