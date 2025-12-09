const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/produtoController");

router.get("/:cnpj", ctrl.listarPorCnpj);///chama função do controller de produto

module.exports = router;
