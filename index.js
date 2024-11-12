// Carrega as variáveis de ambiente do arquivo .env
require("dotenv").config();

// Importa o framework Express
const express = require('express');

// Cria uma instância da aplicação Express
const app = express();

// Importa o módulo de banco de dados (db.js), que contém a lógica de consulta
const db = require('./db');

// Obtém a porta do servidor a partir da variável de ambiente PORT definida no .env
const port = process.env.PORT;

// Middleware para fazer o parse do corpo da requisição como JSON
app.use(express.json());

// Rota de teste para garantir que o servidor está funcionando corretamente
app.get('/', (req, res) => res.json({ message: 'Funcionando!' }));

// Rota GET para buscar todas as pessoas no banco de dados
app.get('/pessoas', async (req, res) => {
    try {
        // Chama a função selectCustomers do módulo db, que consulta o banco de dados
        const results = await db.selectCustomers();
        
        // Retorna os resultados como um JSON
        res.json(results);
    } catch (error) {
        // Caso haja um erro na consulta, imprime o erro no console e retorna um erro 500
        console.error('Erro ao buscar pessoas:', error);
        res.status(500).json({ message: 'Erro no servidor ao buscar pessoas' });
    }
});

// Inicia o servidor na porta configurada, permitindo que ele comece a escutar as requisições
app.listen(port, () => {
    // Mensagem de sucesso para o console
    console.log('API funcionando!');
});
