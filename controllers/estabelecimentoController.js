const EstabelecimentoModel = require("../models/EstabelecimentoModel");
const bcrypt = require("bcrypt");

async function listarEstabelecimentos(req, res) {
    try {
        const lista = await EstabelecimentoModel.getTodos();
        res.json(lista);
    } catch (e) {
        console.error(e);
        res.status(500).json({ erro: "Erro ao buscar estabelecimentos" });
    }
}

async function getEstabelecimentoPorId(req, res) {
    try {
        const id = req.params.id;
        const est = await EstabelecimentoModel.getPorId(id);

        if (!est) {
            return res.status(404).json({ erro: "Estabelecimento não encontrado" });
        }

        res.json(est);
    } catch (e) {
        console.error(e);
        res.status(500).json({ erro: "Erro ao buscar estabelecimento" });
    }
}

async function criarEstabelecimento(req, res) {
    try {
        const { nome, telefone, email, senha, cnpj, endereco, imagem, distancia, avaliacao, frete } = req.body;

        const hashSenha = await bcrypt.hash(senha, 10); //hash da senha usa função de módulo importado do express

        const usuarioData = { nome, telefone, email, hashSenha };
        const estabelecimentoData = { cnpj, endereco, imagem, distancia, avaliacao, frete };

        const novo = await EstabelecimentoModel.criarEstabelecimento(usuarioData, estabelecimentoData);

        res.json({ msg: "Estabelecimento cadastrado", id: novo.id });

    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao criar estabelecimento" });
    }
}

async function getEstabelecimentoPorEmail(req, res) {
    try {
        const email = req.params.email;
        const est = await EstabelecimentoModel.getPorEmail(email);

        if (!est) {
            return res.status(404).json({ erro: "Email não foi cadastrado" });
        }

        res.json(est);
    } catch (e) {
        console.error(e);
        res.status(500).json({ erro: "Erro ao buscar estabelecimento" });
    }
}

async function loginEstabelecimento(req, res) {
    try {
        const { email, senha } = req.body;

        //busca usuário pelo email
        const estabelecimento = await EstabelecimentoModel.getPorEmail(email);

        if (!estabelecimento) {
            return res.status(404).json({ erro: "Email não cadastrado" });
        }

        //compara a senha enviada com o hash do banco
        const senhaCorreta = await bcrypt.compare(senha, estabelecimento.hashSenha);

        if (!senhaCorreta) {
            return res.status(401).json({ erro: "Senha incorreta" });
        }

        //salva informações para manter estabelecimento na sessao
        req.session.user = {
            id: estabelecimento.id,
            tipo: "estabelecimento",
            nome: estabelecimento.nome
        };

        res.json({
            msg: "Login realizado",
            estabelecimento: {
                id: estabelecimento.id,
                nome: estabelecimento.nome,
                email: estabelecimento.email,
                telefone: estabelecimento.telefone,
                cnpj: estabelecimento.cnpj,
                endereco: estabelecimento.endereco,
                imagem: estabelecimento.imagem,
                distancia: estabelecimento.distancia,
                avaliacao: estabelecimento.avaliacao,
                frete: estabelecimento.frete
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao fazer login" });
    }
}

function logoutEstabelecimento(req, res) {
    req.session.destroy(() => {
        res.json({ msg: "Logout realizado" });
    });
}

module.exports = {
    listarEstabelecimentos,
    getEstabelecimentoPorId,
    criarEstabelecimento,
    getEstabelecimentoPorEmail,
    loginEstabelecimento,
    logoutEstabelecimento
};
