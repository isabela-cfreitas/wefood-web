const pool = require("../db");

class ClienteModel {
    static async criarCliente(usuarioData, clienteData) {
        const conn = await pool.getConnection();

        try {
            await conn.beginTransaction();

            //tipo de query diferente da usada para select
            //primeiro insere na tabela usuário, pq todo cliente é um usuário
            const [result] = await conn.query(
                `INSERT INTO usuario (nome, numTelefone, email, hashSenha)
                 VALUES (?, ?, ?, ?)`,
                [usuarioData.nome, usuarioData.telefone, usuarioData.email, usuarioData.hashSenha]
            );

            const novoId = result.insertId;//guarda o id do usuário que acabou de ser inserido porque vai precisar dele para usar como chave estrangeira da tabela cliente para a de usuário

            //depois insere na tabela cliente
            await conn.query(
                `INSERT INTO cliente (id_cliente, cpf, endereco)
                 VALUES (?, ?, ?)`,
                [novoId, clienteData.cpf, clienteData.endereco]
            );

            await conn.commit();
            return { id: novoId };//se der certo a funçao retorna o id

        } catch (err) {
            await conn.rollback();
            throw err;

        } finally {
            conn.release();
        }
    }
    static async getPorEmail(email) {
        const [rows] = await pool.query(`
            SELECT 
                u.id_usuario AS id,
                u.nome,
                u.numTelefone AS telefone,
                u.email,
                u.hashSenha,
                c.cpf,
                c.endereco
            FROM usuario u
            JOIN cliente c ON u.id_usuario = c.id_cliente
            WHERE u.email = ?;
        `, [email]);

        if (rows.length === 0) return null;

        return rows[0];
    }
}

module.exports = ClienteModel;
