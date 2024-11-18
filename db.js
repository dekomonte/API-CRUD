// db.js
const mysql = require('mysql2/promise');
require("dotenv").config();

// Cria o pool de conexões
const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Flamengo_2019$@',
  database: 'db_ramais'
});

// Função que usa o pool de conexões para realizar a consulta de todos os clientes
async function selectCustomers() {
    const [rows] = await pool.query("SELECT * FROM tb_ramal WHERE status_ramal = 1");
    return rows;
}

// Função para buscar uma pessoa específica pelo ID
async function selectCustomer(id) {
    const [rows] = await pool.query("SELECT * FROM tb_ramal WHERE id_ramal=?", [id]);
    return rows;
}

async function insertCustomer(customerData) {
    const { numero_ramal, nome_ramal, setor_ramal, status_ramal, uf_ramal } = customerData;

    // Verifique se os campos obrigatórios foram fornecidos
    if (!numero_ramal || !nome_ramal || !setor_ramal || !status_ramal || !uf_ramal) {
        throw new Error('Faltando dados obrigatórios');
    }

    // SQL para inserir os dados
    const query = 'INSERT INTO tb_ramal (numero_ramal, nome_ramal, setor_ramal, status_ramal, uf_ramal) VALUES (?, ?, ?, ?, ?)';
    try {
        const [result] = await pool.query(query, [numero_ramal, nome_ramal, setor_ramal, status_ramal, uf_ramal]);
        return result; // Retorna o resultado da inserção
    } catch (error) {
        console.error('Erro ao inserir ramal:', error); // Log detalhado
        throw new Error('Erro ao inserir ramal no banco de dados: ' + error.message);
    }
}


async function deleteCustomer(id) {
    const [rows] = await pool.query('DELETE FROM tb_ramal WHERE id_ramal=?', [id]);
    return rows;
}

async function updateCustomer(id, customer) {
    // Inicializa um array de valores
    const values = [];

    // Cria a consulta SQL com base nos campos passados
    let sql = 'UPDATE tb_ramal SET ';

    // Adiciona apenas os campos que têm valores válidos
    let fieldsToUpdate = [];
    
    if (customer.numero_ramal !== undefined && customer.numero_ramal !== null) {
        fieldsToUpdate.push('numero_ramal=?');
        values.push(customer.numero_ramal);
    }
    if (customer.nome_ramal) {
        fieldsToUpdate.push('nome_ramal=?');
        values.push(customer.nome_ramal);
    }
    if (customer.setor_ramal) {
        fieldsToUpdate.push('setor_ramal=?');
        values.push(customer.setor_ramal);
    }
    if (customer.status_ramal !== undefined && customer.status_ramal !== null) {
        fieldsToUpdate.push('status_ramal=?');
        values.push(customer.status_ramal);
    }
    if (customer.uf_ramal) {
        fieldsToUpdate.push('uf_ramal=?');
        values.push(customer.uf_ramal);
    }

    // Verifica se há campos para atualizar
    if (fieldsToUpdate.length === 0) {
        throw new Error('Nenhum campo fornecido para atualização');
    }

    // Junta os campos a serem atualizados
    sql += fieldsToUpdate.join(', ');

    // Adiciona a condição WHERE
    sql += ' WHERE id_ramal=?';
    values.push(id);

    // Executa a consulta
    await pool.query(sql, values);
}

async function softDeleteCustomer(id) {
    // Define o SQL para atualizar o status_ramal para 0
    const sql = 'UPDATE tb_ramal SET status_ramal = 0 WHERE id_ramal = ?';

    try {
        // Executa a consulta, passando o ID para identificar o registro
        const [result] = await pool.query(sql, [id]);

        // Verifica se algum registro foi atualizado
        if (result.affectedRows === 0) {
            throw new Error('Registro não encontrado para deleção');
        }

        return { message: 'Registro marcado como deletado com sucesso!' };
    } catch (error) {
        console.error('Erro ao marcar registro como deletado:', error);
        throw new Error('Erro ao tentar deletar o registro');
    }
}


module.exports = { selectCustomers, selectCustomer, deleteCustomer, insertCustomer, updateCustomer, softDeleteCustomer}

 
