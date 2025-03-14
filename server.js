import { fastify } from 'fastify';
import { DatabasePostgres } from './src/services/database-postgres.js';
import fastifyCors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import path from 'path';
import { fileURLToPath } from 'url';

const server = fastify();

const database = new DatabasePostgres();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Configuração do CORS
server.register(fastifyCors, {
    origin: true, // Permite todas as origens
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
});

// Configuração do fastify-static para enviar arquivos
server.register(fastifyStatic, {
    root: path.join(__dirname, 'src', 'views'),
    prefix: '/views/', // prefixo opcional para acessar os arquivos estáticos
});

server.register(fastifyStatic, {
    root: path.join(__dirname, 'src', 'public'), // Caminho para a pasta "public"
    prefix: '/public/', // Prefixo para acessar os arquivos da pasta "public"
    decorateReply: false, // Evita conflitos com outros plugins fastify-static
});

// Rota para enviar o arquivo AddTask.html
server.get('/', async (request, response) => {
    return response.sendFile('AddTask.html');
});

// =========================
// Rotas da API de tarefas
// =========================

// Rota para listar todas as tarefas (com busca opcional)
server.get('/tarefas', async (request) => {
    const search = request.query.search; // Parâmetro de busca opcional

    const tarefas = await database.list(search); // Lista as tarefas
    return tarefas;
});

server.get('/detalhes-tarefa/:id', async (req, res) => {
    try {
        const tarefaId = req.params.id;
        const tarefa = await database.buscarTarefaPorId(tarefaId); // Busca a tarefa

        if (!tarefa) {
            return res.status(404).send({ error: 'Tarefa não encontrada' });
        }

        return tarefa; // Envia os detalhes da tarefa como JSON
    } catch (error) {
        return res.status(500).send({ error: 'Erro ao buscar detalhes da tarefa' });
    }
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