import 'dotenv/config'; // Carrega as variáveis de ambiente
import { neon } from '@neondatabase/serverless'; // Importa a função neon do módulo @neondatabase/serverless

// Conecta ao banco de dados usando a URL do .env
export const sql = neon(process.env.DATABASE_URL);