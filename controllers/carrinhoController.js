const CarrinhoModel = require("../models/carrinhoModel");

async function getCarrinhoDoCliente(req, res) {
    try {
        if (!req.session.user) {
            return res.status(401).json({ erro: "Não logado" });
        }

        const idCliente = req.session.user.id;
        const itens = await CarrinhoModel.buscarCarrinhoCliente(idCliente);

        res.json(itens);

    } catch (erro) {
        console.error("ERRO NO CARRINHO:", erro);
        res.status(500).json({ erro: "Erro no servidor." });
    }
}

async function adicionarAoCarrinho(req, res) {
    try {
        if (!req.session.user) {
            return res.status(401).json({ erro: "Não logado" });
        }

        const idCliente = req.session.user.id;
        const { id_produto, quantidade } = req.body;

        if (!id_produto || !quantidade) {
            return res.status(400).json({ erro: "Dados incompletos" });
        }

        await CarrinhoModel.adicionarItem(idCliente, id_produto, quantidade);

        res.json({ sucesso: true });
        
    } catch (erro) {
        console.error("ERRO AO ADICIONAR AO CARRINHO:", erro);
        res.status(500).json({ erro: "Erro no servidor." });
    }
}

async function removerItem(req, res) {
    try {
        if (!req.session.user) {
            return res.status(401).json({ erro: "Não logado" });
        }

        const { idItem } = req.body;

        if (!idItem) {
            return res.status(400).json({ erro: "idItem ausente" });
        }

        await CarrinhoModel.removerItem(idItem);

        res.json({ sucesso: true });

    } catch (erro) {
        console.error("ERRO AO REMOVER ITEM:", erro);
        res.status(500).json({ erro: "Erro no servidor." });
    }
}


module.exports = {
    getCarrinhoDoCliente,
    adicionarAoCarrinho, removerItem
};
