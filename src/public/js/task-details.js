document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const tarefaId = urlParams.get('id');

    if (!tarefaId) {
        document.getElementById('erro').textContent = 'ID da tarefa não encontrado na URL.';
        return;
    }

    try {
        // Busca os detalhes da tarefa
        const response = await fetch(`/detalhes-tarefa/${tarefaId}`);
        if (!response.ok) {
            throw new Error('Tarefa não encontrada');
        }

        const tarefa = await response.json();

        // Preenche os campos do formulário com os dados da tarefa
        document.getElementById('titulo').value = tarefa.titulo;
        document.getElementById('descricao').value = tarefa.descricao;
        document.getElementById('status').value = tarefa.status;
    } catch (error) {
        console.error('Erro ao carregar detalhes da tarefa:', error);
        document.getElementById('erro').textContent = error.message;
    }

    // Evento para salvar as alterações
    document.getElementById('form-editar-tarefa').addEventListener('submit', async (e) => {
        e.preventDefault();

        const dadosAtualizados = {
            titulo: document.getElementById('titulo').value,
            descricao: document.getElementById('descricao').value,
            status: document.getElementById('status').value,
        };

        try {
            const response = await fetch(`/atualizar-tarefa/${tarefaId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dadosAtualizados),
            });

            if (!response.ok) {
                throw new Error('Erro ao salvar alterações');
            }

            alert('Tarefa atualizada com sucesso!');
            window.location.href = '/views/tasks.html'; // Redireciona para a lista de tarefas
        } catch (error) {
            console.error('Erro ao salvar alterações:', error);
            document.getElementById('erro').textContent = error.message;
        }
    });

    // Evento para deletar a tarefa
    document.getElementById('deletar').addEventListener('click', async () => {
        if (confirm('Tem certeza que deseja deletar esta tarefa?')) {
            try {
                const response = await fetch(`/deletar-tarefa/${tarefaId}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Erro ao deletar tarefa');
                }

                alert('Tarefa deletada com sucesso!');
                window.location.href = '/views/tasks.html'; // Redireciona para a lista de tarefas
            } catch (error) {
                console.error('Erro ao deletar tarefa:', error);
                document.getElementById('erro').textContent = error.message;
            }
        }
    });
});