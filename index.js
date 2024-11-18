// Carrega as variáveis de ambiente do arquivo .env
require("dotenv").config();

// Importa o framework Express
const express = require('express');

// Cria uma instância do Router do Express
const router = express.Router();

// Importa o módulo de banco de dados (db.js), que contém a lógica de consulta
const db = require('./db');

// Middleware para fazer o parse do corpo da requisição como JSON
router.use(express.json());

// Rota de teste para garantir que o servidor está funcionando corretamente
router.get('/', (req, res) => res.json({ message: 'Funcionando!' }));

// Rota para buscar um ramal específico com base no ID
router.get('/ramais/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.selectCustomer(id);
        if (result.length === 0) {
            return res.status(404).json({ message: 'Ramal não encontrado' });
        }
        res.json(result[0]);
    } catch (error) {
        console.error('Erro ao buscar ramal:', error);
        res.status(500).json({ message: 'Erro no servidor ao buscar ramal' });
    }
});

// Rota GET para buscar todos os ramais no banco de dados
router.get('/ramais', async (req, res) => {
    try {
        const results = await db.selectCustomers();
        res.json(results);
    } catch (error) {
        console.error('Erro ao buscar ramais:', error);
        res.status(500).json({ message: 'Erro no servidor ao buscar ramais' });
    }
});

// Rota para "deletar" um ramal, alterando status_ramal para 0
router.delete('/ramais/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.softDeleteCustomer(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Ramal não encontrado' });
        }
        res.json({ message: 'Ramal desativado com sucesso!' });
    } catch (error) {
        console.error('Erro ao desativar ramal:', error);
        res.status(500).json({ message: 'Erro no servidor ao desativar ramal' });
    }
});

// Rota POST para criar um novo ramal
router.post('/ramais', async (req, res) => {
    try {
        const { nome_ramal, numero_ramal, setor_ramal, status_ramal, uf_ramal } = req.body;
        await db.insertCustomer({ nome_ramal, numero_ramal, setor_ramal, status_ramal, uf_ramal });
        res.status(201).json({ message: 'Ramal criado com sucesso!' });
    } catch (error) {
        console.error('Erro ao criar ramal:', error);
        res.status(500).json({ message: 'Erro no servidor ao criar ramal' });
    }
});

// Rota PATCH para atualizar os dados de um ramal
router.patch('/ramais/:id', async (req, res) => {
    try {
        await db.updateCustomer(req.params.id, req.body);
        res.status(200).json({ message: 'Ramal atualizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar ramal:', error);
        res.status(500).json({ message: 'Erro no servidor ao atualizar ramal' });
    }
});

// Exporta as rotas como um módulo
module.exports = router;
