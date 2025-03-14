// src/public/js/addTask.js

document.getElementById('addTaskForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const titulo = document.getElementById('titulo').value;
    const descricao = document.getElementById('descricao').value;
    const status = document.getElementById('status').value;

    try {
        const response = await fetch('/tarefas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ titulo, descricao, status }),
        });

        if (response.ok) {
            alert('Tarefa adicionada com sucesso!');
            window.location.href = '/views/tasks.html'; // Redireciona para o Kanban
        } else {
            alert('Erro ao adicionar tarefa.');
        }
    } catch (error) {
        console.error('Erro ao adicionar tarefa:', error);
        alert('Erro ao adicionar tarefa.');
    }
});