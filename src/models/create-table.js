import { sql } from '../config/db.js'; // Importe a configuração do banco de dados

sql`
    CREATE TABLE tarefas (
        id INT PRIMARY KEY,  
        titulo VARCHAR(255) NOT NULL,       
        descricao TEXT,                     
        status VARCHAR(50) NOT NULL DEFAULT 'nao_iniciada'
        CHECK (status IN ('nao_iniciada', 'em_progresso', 'concluida'))
    );
`.then(() => {
    console.log('Tabela criada com sucesso!');
})