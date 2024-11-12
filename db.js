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

async function updateCustomer(id, customer) {
    // Inicializa um array de valores
    const values = [];

    // Cria a consulta SQL com base nos campos passados
    let sql = 'UPDATE pessoas SET ';

    // Adiciona apenas os campos que têm valores válidos
    let fieldsToUpdate = [];
    
    if (customer.Nome) {
        fieldsToUpdate.push('Nome=?');
        values.push(customer.Nome);
    }
    if (customer.Ramal !== undefined && customer.Ramal !== null) {
        fieldsToUpdate.push('Ramal=?');
        values.push(customer.Ramal);
    }
    if (customer.UF) {
        fieldsToUpdate.push('UF=?');
        values.push(customer.UF);
    }

    // Verifica se há campos para atualizar
    if (fieldsToUpdate.length === 0) {
        throw new Error('Nenhum campo fornecido para atualização');
    }

    // Junta os campos a serem atualizados
    sql += fieldsToUpdate.join(', ');

    // Adiciona a condição WHERE
    sql += ' WHERE ID=?';
    values.push(id);

    // Executa a consulta
    await pool.query(sql, values);
}


module.exports = { selectCustomers, selectCustomer, deleteCustomer, insertCustomer, updateCustomer}

 
