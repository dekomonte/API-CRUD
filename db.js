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

// Função que usa o pool de conexões para realizar a consulta
async function selectCustomers() {
    const [rows] = await pool.query("SELECT * FROM Pessoas");
    return rows;
}

// Exporta a função selectCustomers
module.exports = { selectCustomers };
