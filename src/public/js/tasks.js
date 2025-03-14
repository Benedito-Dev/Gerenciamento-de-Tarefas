// src/public/js/kanban.js

// Função para buscar tarefas da API
const fetchTarefas = async () => {
    try {
        const response = await fetch('/tarefas');
        const tarefas = await response.json();
        return tarefas;
    } catch (error) {
        console.error('Erro ao buscar tarefas:', error);
        return [];
    }
};

// Função para renderizar as tarefas no Kanban
const renderizarKanban = (tarefas) => {
    const tasksNaoConcluidas = document.getElementById('tasks-nao-concluidas');
    const tasksEmProgresso = document.getElementById('tasks-em-progresso');
    const tasksConcluidas = document.getElementById('tasks-concluidas');

    // Limpa as colunas antes de renderizar
    tasksNaoConcluidas.innerHTML = '';
    tasksEmProgresso.innerHTML = '';
    tasksConcluidas.innerHTML = '';

    // Renderiza cada tarefa na coluna correspondente
    tarefas.forEach(tarefa => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task';
        taskElement.textContent = tarefa.titulo;
        taskElement.draggable = true; // Habilita o arrastar
        taskElement.dataset.id = tarefa.id; // Adiciona o ID da tarefa como atributo

        // Adiciona eventos de arrastar e soltar
        taskElement.addEventListener('dragstart', dragStart);
        taskElement.addEventListener('dragend', dragEnd);

        switch (tarefa.status) {
            case 'nao_iniciada':
                tasksNaoConcluidas.appendChild(taskElement);
                break;
            case 'em_progresso':
                tasksEmProgresso.appendChild(taskElement);
                break;
            case 'concluida':
                tasksConcluidas.appendChild(taskElement);
                break;
            default:
                console.warn(`Status desconhecido: ${tarefa.status}`);
        }
    });

    // Adiciona eventos de arrastar e soltar às colunas
    const columns = document.querySelectorAll('.column');
    columns.forEach(column => {
        column.addEventListener('dragover', dragOver);
        column.addEventListener('drop', drop);
    });
};

// Variável para armazenar a tarefa sendo arrastada
let tarefaArrastada = null;

// Função chamada quando o arrasto começa
const dragStart = (event) => {
    tarefaArrastada = event.target;
    event.target.classList.add('dragging'); // Adiciona estilo ao arrastar
};

// Função chamada quando o arrasto termina
const dragEnd = (event) => {
    event.target.classList.remove('dragging'); // Remove estilo ao soltar
    tarefaArrastada = null;
};

// Função chamada quando uma tarefa é arrastada sobre uma coluna
const dragOver = (event) => {
    event.preventDefault();
    event.target.classList.add('over'); // Adiciona estilo ao passar sobre a coluna
};

// Função chamada quando uma tarefa é solta em uma coluna
const drop = (event) => {
    event.preventDefault();
    event.target.classList.remove('over'); // Remove estilo ao soltar

    if (tarefaArrastada) {
        const column = event.target.closest('.column'); // Obtém a coluna onde a tarefa foi solta
        column.querySelector('.tasks').appendChild(tarefaArrastada); // Adiciona a tarefa à coluna
    }
};

// Função principal para carregar o Kanban
const carregarKanban = async () => {
    const tarefas = await fetchTarefas();
    renderizarKanban(tarefas);
};

// Inicia o carregamento do Kanban
carregarKanban();