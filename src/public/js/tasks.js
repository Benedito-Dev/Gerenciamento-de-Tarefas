// Função para buscar tarefas da API
const fetchTarefas = async () => {
    try {
      const response = await fetch("/tarefas");
      const tarefas = await response.json();
      return tarefas;
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
      return [];
    }
  };
  
  // Função para atualizar o status da tarefa no backend
  const atualizarStatusTarefa = async (tarefaId, titulo, novoStatus) => {
    try {
      const response = await fetch(`/tarefas/${tarefaId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ titulo, status: novoStatus }), // Envia o título e o novo status
      });
  
      if (!response.ok) {
        throw new Error("Erro ao atualizar o status da tarefa");
      }
  
      const data = await response.json();
      console.log("Status da tarefa atualizado:", data);
    } catch (error) {
      console.error("Erro ao atualizar o status da tarefa:", error);
    }
  };
  
  // Função para renderizar as tarefas no Kanban
  const renderizarKanban = (tarefas) => {
    const tasksNaoConcluidas = document.getElementById("tasks-nao-concluidas");
    const tasksEmProgresso = document.getElementById("tasks-em-progresso");
    const tasksConcluidas = document.getElementById("tasks-concluidas");
  
    // Limpa as colunas antes de renderizar
    tasksNaoConcluidas.innerHTML = "";
    tasksEmProgresso.innerHTML = "";
    tasksConcluidas.innerHTML = "";
  
    // Renderiza cada tarefa na coluna correspondente
    tarefas.forEach((tarefa) => {
      const taskElement = document.createElement("div");
      taskElement.className = "task";
      taskElement.textContent = tarefa.titulo; // Exibe o título da tarefa
      taskElement.draggable = true; // Habilita o arrastar
      taskElement.dataset.id = tarefa.id; // Adiciona o ID da tarefa como atributo
      taskElement.dataset.titulo = tarefa.titulo; // Adiciona o título da tarefa como atributo
  
      // Adiciona eventos de arrastar e soltar
      taskElement.addEventListener("dragstart", dragStart);
      taskElement.addEventListener("dragend", dragEnd);
  
      // Adiciona evento de clique para redirecionar para detalhes da tarefa
      taskElement.addEventListener("click", () => {
        window.location.href = `/task-details?id=${tarefa.id}`;
      });
  
      switch (tarefa.status) {
        case "nao_iniciada":
          tasksNaoConcluidas.appendChild(taskElement);
          break;
        case "em_progresso":
          tasksEmProgresso.appendChild(taskElement);
          break;
        case "concluida":
          tasksConcluidas.appendChild(taskElement);
          break;
        default:
          console.warn(`Status desconhecido: ${tarefa.status}`);
      }
    });
  
    // Adiciona eventos de arrastar e soltar às colunas
    const columns = document.querySelectorAll(".column");
    columns.forEach((column) => {
      column.addEventListener("dragover", dragOver);
      column.addEventListener("drop", drop);
    });
  };
  
  let tarefaArrastada = null;
  
  const dragStart = (event) => {
    tarefaArrastada = event.target;
    event.target.classList.add("dragging");
  };
  
  const dragEnd = (event) => {
    event.target.classList.remove("dragging");
    tarefaArrastada = null;
  };
  
  const dragOver = (event) => {
    event.preventDefault();
    event.target.classList.add("over");
  };
  
  const drop = async (event) => {
    event.preventDefault();
    event.target.classList.remove("over");
  
    if (tarefaArrastada) {
      const column = event.target.closest(".column");
      column.querySelector(".tasks").appendChild(tarefaArrastada);
  
      // Obtém o ID da tarefa, o título e o novo status com base na coluna
      const tarefaId = tarefaArrastada.dataset.id;
      const titulo = tarefaArrastada.dataset.titulo; // Obtém o título da tarefa
      const columnId = column.id;
  
      // Mapeia o ID da coluna para o status correspondente
      let novoStatus;
      switch (columnId) {
        case "nao-concluidas":
          novoStatus = "nao_iniciada";
          break;
        case "em-progresso":
          novoStatus = "em_progresso";
          break;
        case "concluidas":
          novoStatus = "concluida";
          break;
        default:
          console.warn("Coluna desconhecida:", columnId);
          return;
      }
  
      // Atualiza o status da tarefa no backend, enviando o título e o novo status
      await atualizarStatusTarefa(tarefaId, titulo, novoStatus);
    }
  };
  
  // Função principal para carregar o Kanban
  const carregarKanban = async () => {
    const tarefas = await fetchTarefas();
    renderizarKanban(tarefas);
  };
  
  // Inicia o carregamento do Kanban
  carregarKanban();