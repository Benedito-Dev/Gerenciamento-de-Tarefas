import { fastify } from 'fastify';
import path from 'path';
import { fileURLToPath } from 'url';
import fastifyStatic from '@fastify/static';
import { DatabasePostgres } from './src/services/database-postgres.js';
import fastifyCors from '@fastify/cors';

const server = fastify();

// Obtém o diretório atual corretamente (equivalente a __dirname no ES6)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const database = new DatabasePostgres();

// Servindo arquivos estáticos da pasta "public"
server.register(fastifyStatic, {
    root: path.join(__dirname, 'src', 'public'), // Caminho atualizado
    prefix: '/public/',
});

server.register(fastifyCors, {
    origin: true, // Permite todas as origens (ou especifique a origem do seu frontend, como 'http://localhost:3001')
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

// Rota para servir a página home.html
server.get('/', async (request, reply) => {
    return reply.sendFile('home.html', path.join(__dirname, 'src', 'views'));
});

// Rota para servir a página admin.html
server.get('/views/admin', async (request, reply) => {
    return reply.sendFile('admin.html', path.join(__dirname, 'src', 'views'));
});

// =========================
// Rotas da API de tarefas
// =========================

// Listar todas as tarefas (com busca opcional)
server.get('/tarefas', async (request) => {
    const search = request.query.search;

    const tarefas = await database.list(search);
    console.log('Tarefas retornadas:', tarefas);
    return tarefas;
});

// Criar uma nova tarefa
server.post('/tarefas', async (request, response) => {
    const { titulo, descricao, status } = request.body;

    await database.create({
        titulo,
        descricao,
        status
    });

    console.log(database);

    return response.status(201).send();
});

// Atualizar uma tarefa existente
server.put('/tarefas/:id', async (request, response) => {
    const tarefaId = request.params.id;
    const { titulo, descricao, status } = request.body;

    await database.update(tarefaId, {
        titulo,
        descricao,
        status
    });

    return response.status(204).send();
});

// Deletar uma tarefa
server.delete('/tarefas/:id', async (request, response) => {
    const tarefaId = request.params.id;

    await database.delete(tarefaId);

    return response.status(204).send();
});

// Iniciar o servidor
server.listen({
    host: '0.0.0.0',
    port: process.env.PORT ?? 3000,
}, () => {
    console.log(`Servidor rodando em http://localhost:${process.env.PORT ?? 3000}`);
});