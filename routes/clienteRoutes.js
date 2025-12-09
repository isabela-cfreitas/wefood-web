const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/clienteController");
const verificaLogin = require("../middleware/verificaLogin"); //importa função do middleware entre a sessao e o backend

//método post, diferente dos gets
//post: envia dados
//get: recupera dados
router.post("/", ctrl.criarCliente);//chama função do controller

router.get("/:email", ctrl.getClientePorEmail)

router.post("/login", ctrl.loginCliente);

router.get("/perfil", verificaLogin, ctrl.getClientePorEmail);//nao sabia que dava para chamar duas funções na rota. a segunda só funciona pq a funçao verificaLogin tem o "next()" sendo chamado
//como só avança para a segunda funçao se rodar o next no final da primeira(que é um middleware), entao a segunda só executa quando o servidor percebe que não tem uma sessao ativa baseada nos cookies que ele recebeu do navegador

router.post("/logout", ctrl.logoutCliente);


module.exports = router;
