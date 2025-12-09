const pool = require("../db");

class CarrinhoModel {

    static async buscarCarrinhoCliente(idCliente) {
        try {
            const [rows] = await pool.query(
                `
                SELECT 
                    c.id AS idCarrinho,
                    c.id_cliente,
                    ic.id AS idItem,
                    ic.id_produto,
                    ic.quantidade,
                    p.nome AS nomeProduto,
                    p.valor AS precoProduto,
                    p.imagem
                FROM carrinho c
                LEFT JOIN item_carrinho ic 
                    ON c.id = ic.id_carrinho
                LEFT JOIN produtos p 
                    ON ic.id_produto = p.id_produto
                WHERE c.id_cliente = ? AND c.status = 'aberto';
                `,
                [idCliente]
            );

            return rows;
        } catch (err) {
            console.error("ERRO NO MODEL CARRINHO:", err);
            throw err;
        }
    }

    static async adicionarItem(idCliente, idProduto, quantidade) {

        const [carrinho] = await pool.query(
            "SELECT id FROM carrinho WHERE id_cliente = ? AND status = 'aberto'",
            [idCliente]
        );

        let idCarrinho;

        if (carrinho.length === 0) {
            const [res] = await pool.query(
                "INSERT INTO carrinho (id_cliente, id_estabelecimento, status) VALUES (?, ?, 'aberto')",
                [idCliente, 1]
            );
            idCarrinho = res.insertId;
        } else {
            idCarrinho = carrinho[0].id;
        }

        const [existe] = await pool.query(
            "SELECT * FROM item_carrinho WHERE id_carrinho = ? AND id_produto = ?",
            [idCarrinho, idProduto]
        );

        if (existe.length > 0) {
            return pool.query(
                "UPDATE item_carrinho SET quantidade = quantidade + ? WHERE id_carrinho = ? AND id_produto = ?",
                [quantidade, idCarrinho, idProduto]
            );
        } else {
            return pool.query(
                "INSERT INTO item_carrinho (id_carrinho, id_produto, quantidade) VALUES (?,?,?)",
                [idCarrinho, idProduto, quantidade]
            );
        }
    }

    static async removerItem(idItem) {
        return pool.query(
            "DELETE FROM item_carrinho WHERE id = ?",
            [idItem]
        );
    }

}

module.exports = CarrinhoModel;
