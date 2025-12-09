const ClienteModel = require("../models/clienteModel");
const bcrypt = require("bcrypt");

function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, "");

    if (cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false;

    let soma = 0, resto;

    for (let i = 1; i <= 9; i++)
        soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++)
        soma += parseInt(cpf.substring(i-1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;

    return resto === parseInt(cpf.substring(10, 11));
}

async function criarCliente(req, res) {
    try {
        const { nome, telefone, email, senha, cpf, endereco } = req.body;

        if (!validarCPF(cpf)) {
            return res.status(400).json({ erro: "CPF inválido" });
        }

        const hashSenha = await bcrypt.hash(senha, 10); //hash da senha usa função de módulo importado do express

        const usuarioData = { nome, telefone, email, hashSenha };
        const clienteData = { cpf, endereco };

        const novo = await ClienteModel.criarCliente(usuarioData, clienteData);

        res.json({ msg: "Cliente cadastrado", id: novo.id });

    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao criar cliente" });
    }
}

async function getClientePorEmail(req, res) {
    try {
        const email = req.params.email;
        const est = await ClienteModel.getPorEmail(email);

        if (!est) {
            return res.status(404).json({ erro: "Email não foi cadastrado" });
        }

        res.json(est);
    } catch (e) {
        console.error(e);
        res.status(500).json({ erro: "Erro ao buscar cliente" });
    }
}

async function loginCliente(req, res) {
    try {
        const { email, senha } = req.body;

        const cliente = await ClienteModel.getPorEmail(email);

        if (!cliente) {
            return res.status(404).json({ erro: "Email não cadastrado" });
        }

        const senhaCorreta = await bcrypt.compare(senha, cliente.hashSenha);

        if (!senhaCorreta) {
            return res.status(401).json({ erro: "Senha incorreta" });
        }

        //salva informações para manter cliente na sessao
        req.session.user = {
            id: cliente.id,
            tipo: "cliente",
            endereco: cliente.endereco,
            nome: cliente.nome
        };

        res.json({
            msg: "Login realizado",
            cliente: {
                id: cliente.id,
                nome: cliente.nome,
                email: cliente.email,
                telefone: cliente.telefone,
                cpf: cliente.cpf,
                endereco: cliente.endereco
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao fazer login" });
    }
}
function logoutCliente(req, res) {
    req.session.destroy(() => {
        res.json({ msg: "Logout realizado" });
    });
}

module.exports = { criarCliente, getClientePorEmail, loginCliente, logoutCliente };
