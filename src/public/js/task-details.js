// src/public/js/task-details.js

// Função para carregar os detalhes da tarefa
async function carregarDetalhesTarefa() {
    // Obtém o ID da tarefa da URL
    const urlParams = new URLSearchParams(window.location.search);
    const tarefaId = urlParams.get('id');

    if (!tarefaId) {
        document.getElementById('erro').textContent = 'ID da tarefa não encontrado na URL.';
        return;
    }

    try {
        // Faz a requisição para a API
        const response = await fetch(`/detalhes-tarefa/${tarefaId}`);
        if (!response.ok) {
            throw new Error('Tarefa não encontrada');
        }

        // Converte a resposta para JSON
        const tarefa = await response.json();

        // Exibe os detalhes da tarefa na página
        document.getElementById('titulo').textContent = tarefa.titulo;
        document.getElementById('descricao').textContent = tarefa.descricao;
        document.getElementById('status').textContent = tarefa.status;
    } catch (error) {
        console.error('Erro ao carregar detalhes da tarefa:', error);
        document.getElementById('erro').textContent = error.message;
    }
}

// Carrega os detalhes da tarefa quando a página é aberta
carregarDetalhesTarefa();