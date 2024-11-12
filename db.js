// db.js
const mysql = require('mysql2/promise');
require("dotenv").config();

// Cria o pool de conexões
const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Flamengo_2019$@',
  database: 'api_crud'
});

// Função que usa o pool de conexões para realizar a consulta de todos os clientes
async function selectCustomers() {
    const [rows] = await pool.query("SELECT * FROM pessoas");
    return rows;
}

// Função para buscar uma pessoa específica pelo ID
async function selectCustomer(id) {
    const [rows] = await pool.query('SELECT * FROM pessoas WHERE ID=?', [id]);
    return rows;
}

async function insertCustomer(customerData) {
    const { Nome, Ramal, UF } = customerData;

    // Verifique se os campos obrigatórios foram fornecidos
    if (!Nome || !Ramal || !UF) {
        throw new Error('Faltando dados obrigatórios');
    }

    // SQL para inserir os dados
    const query = 'INSERT INTO Pessoas (Nome, Ramal, UF) VALUES (?, ?, ?)';
    try {
        const [result] = await pool.query(query, [Nome, Ramal, UF]);
        return result; // Retorna o resultado da inserção
    } catch (error) {
        console.error('Erro ao inserir pessoa:', error); // Log detalhado
        throw new Error('Erro ao inserir pessoa no banco de dados: ' + error.message);
    }
}


async function deleteCustomer(id) {
    const [rows] = await pool.query('DELETE FROM pessoas WHERE ID=?', [id]);
    return rows;
}

module.exports = { selectCustomers, selectCustomer, deleteCustomer, insertCustomer }

 
