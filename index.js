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

// Rota para buscar uma pessoa específica com base no ID
app.get('/pessoas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.selectCustomer(id);  // Usando a função para buscar uma pessoa pelo ID
        if (result.length === 0) {
            return res.status(404).json({ message: 'Pessoa não encontrada' });
        }
        res.json(result);
    } catch (error) {
        console.error('Erro ao buscar pessoa:', error);
        res.status(500).json({ message: 'Erro no servidor ao buscar pessoa' });
    }
});
 

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

// Rota para deletar uma pessoa com base no ID
app.delete('/pessoas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.deleteCustomer(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Pessoa não encontrada' });
        }
        res.sendStatus(204); // Retorna 204 (Sem conteúdo) quando a deleção for bem-sucedida
    } catch (error) {
        console.error('Erro ao deletar pessoa:', error);
        res.status(500).json({ message: 'Erro no servidor ao deletar pessoa' });
    }
});

// Inicia o servidor na porta configurada, permitindo que ele comece a escutar as requisições
app.listen(port, () => {
    console.log('API funcionando!');
});
