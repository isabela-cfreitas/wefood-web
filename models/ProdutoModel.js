const pool = require("../db");
const Produto = require("./produto");

class ProdutoModel {
    static async getPorCnpj(cnpj) {
        const [rows] = await pool.query(
            "SELECT * FROM produtos WHERE cnpj_estabelecimento = ?",//consulta no mysql qual estabelecimento tem aquele cnpj
            [cnpj]
        );

        return rows.map(p => 
            new Produto (
                p.id_produto,
                p.nome,
                Number(p.valor),
                p.cnpj_estabelecimento,
                p.imagem
            )
        );
    }
}

module.exports = ProdutoModel;
