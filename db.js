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

async function deleteCustomer(id) {
    const [rows] = await pool.query('DELETE FROM pessoas WHERE ID=?', [id]);
    return rows;
}

module.exports = { selectCustomers, selectCustomer, deleteCustomer }

 
