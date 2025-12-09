const pool = require('../db');
const Estabelecimento = require('./estabelecimento');
class EstabelecimentoModel {
    static async getTodos() {
        const [rows] = await pool.query(`
            SELECT 
                u.id_usuario AS id,
                u.nome,
                u.numTelefone,
                u.email,
                u.hashSenha,
                e.cnpj,
                e.endereco,
                e.imagem,
                e.distancia,
                e.avaliacao,
                e.frete
            FROM usuario u
            JOIN estabelecimento e ON u.id_usuario = e.id_estabelecimento;
        `);

        return rows.map(r => 
            new Estabelecimento(
                r.id,
                r.nome,
                r.numTelefone,
                r.email,
                r.hashSenha,
                r.cnpj,
                r.endereco,
                r.imagem,
                r.distancia,
                r.avaliacao,
                r.frete
            )
        );
    }

    static async getPorId(id) {
        const [rows] = await pool.query(`
            SELECT 
                u.id_usuario AS id,
                u.nome,
                u.numTelefone,
                u.email,
                u.hashSenha,
                e.cnpj,
                e.endereco,
                e.imagem,
                e.distancia,
                e.avaliacao,
                e.frete
            FROM usuario u
            JOIN estabelecimento e ON u.id_usuario = e.id_estabelecimento
            WHERE u.id_usuario = ?;
        `, [id]);

        if (rows.length === 0) return null;

        const r = rows[0];

        return new Estabelecimento(
            r.id,
            r.nome,
            r.numTelefone,
            r.email,
            r.hashSenha,
            r.cnpj,
            r.endereco,
            r.imagem,
            r.distancia,
            r.avaliacao,
            r.frete
        );
    }

    static async criarEstabelecimento(usuarioData, estabelecimentoData) {
        const conn = await pool.getConnection();

        try {
            await conn.beginTransaction();

            //tipo de query diferente da usada para select
            //primeiro insere na tabela usuário, pq todo estabelecimento é um usuário
            const [result] = await conn.query(
                `INSERT INTO usuario (nome, numTelefone, email, hashSenha)
                 VALUES (?, ?, ?, ?)`,
                [usuarioData.nome, usuarioData.telefone, usuarioData.email, usuarioData.hashSenha]
            );

            const novoId = result.insertId;//guarda o id do usuário que acabou de ser inserido porque vai precisar dele para usar como chave estrangeira da tabela estabelecimento para a de usuário
            //id, nome, telefone, email, senha, cnpj, endereco, imagem, distancia, avaliacao, frete
            //depois insere na tabela estabelecimento
            await conn.query(
                `INSERT INTO estabelecimento (id_estabelecimento, cnpj, endereco, imagem, distancia, avaliacao, frete)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [novoId, estabelecimentoData.cnpj, estabelecimentoData.endereco, estabelecimentoData.imagem, estabelecimentoData.distancia, estabelecimentoData.avaliacao, estabelecimentoData.frete]
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
                e.cnpj,
                e.endereco,
                e.imagem,
                e.distancia,
                e.avaliacao,
                e.frete
            FROM usuario u
            JOIN estabelecimento e ON u.id_usuario = e.id_estabelecimento
            WHERE u.email = ?;
        `, [email]);

        if (rows.length === 0) return null;

        return rows[0];
    }
}

module.exports = EstabelecimentoModel;
