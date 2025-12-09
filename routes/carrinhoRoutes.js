//dupla: isabela de castro freitas(112692) e pedro henrique coura pereira(112693)
const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/carrinhoController");

router.get("/meu-carrinho", ctrl.getCarrinhoDoCliente);
router.post("/adicionar", ctrl.adicionarAoCarrinho);
router.delete("/remover", ctrl.removerItem);

module.exports = router;
