const express = require('express');
const app = express();
const path = require('path');
const session = require("express-session");

app.use(express.json()); 

const estRoutes = require("./routes/estabelecimentoRoutes");//recebe requisição e joga para rotas de estabelecimento
const produtoRoutes = require("./routes/produtoRoutes"); //joga a requisição para rotas de produto
const clienteRoutes = require("./routes/clienteRoutes");
const carrinhoRoutes = require("./routes/carrinhoRoutes");

// app.use(express.json()); 
// app.use(express.static(path.join(__dirname, 'public')));

app.use(session({//requisicao de criar sessao
    secret: "senhadeautenticarcookie",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 2 //2h tempo de vida
    }
}));


app.use((req, res, next) => {//verifica quando abre a aplicaçao de já tem uma sessao ativa e olha se é de cliente ou estabeleciemnto
    if (req.path.startsWith("/api")) return next();

    if (req.session && req.session.user) {
        if (req.session.user.tipo === "cliente" && req.path === "/") {
            return res.redirect("/HomeCliente");
        }
        if (req.session.user.tipo === "estabelecimento" && req.path === "/") {
            return res.redirect("/HomeEstabelecimento");
        }
    }
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

//cria apis
app.use("/api/estabelecimentos", estRoutes);
app.use("/api/produtos", produtoRoutes);
app.use("/api/carrinho", carrinhoRoutes);

app.get("/CadastroCliente", (req,res) => {
    res.sendFile(path.join(__dirname,"public","cadastroCliente.html"));
});

app.get("/CadastroEstabelecimento", (req,res) => {
    res.sendFile(path.join(__dirname,"public","cadastroEstabelecimento.html"));
});

app.get("/HomeCliente", (req,res) => {
    res.sendFile(path.join(__dirname,"public","index.html"));
});

app.get("/HomeEstabelecimento", (req,res) => {
    res.sendFile(path.join(__dirname,"public","HomepageEstabelecimento.html"));
});

app.use("/api/clientes", clienteRoutes);

app.get("/LoginCliente", (req,res) => {
    res.sendFile(path.join(__dirname,"public","loginCliente.html"));
});

app.get("/LoginEstabelecimento", (req,res) => {
    res.sendFile(path.join(__dirname,"public","loginEstabelecimento.html"));
});

app.get("/LoginGeral", (req,res) => {
    res.sendFile(path.join(__dirname,"public","loginGeral.html"));
});

app.get("/api/logado", (req, res) => {
  if (req.session && req.session.user) {
    return res.json({
      logado: true,
      nome: req.session.user.nome,
      endereco: req.session.user.endereco || null,
      tipo: req.session.user.tipo
    });
  }
  res.json({ logado: false });
});


// app.get("/LoginEstabelecimento", (req,res) => {
//     res.sendFile(path.join(__dirname,"public","loginCliente.html"));
// });


app.listen(1504, ()=> {
    console.log('servidor no ar: http://localhost:1504');
});
