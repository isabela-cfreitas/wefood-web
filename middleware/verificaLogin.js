module.exports = function verificaLogin(req, res, next) {//função middleware, pois tem next, roda antes de algum handle
    //valida se tem sessao ativa com o sessionid fornecido pelo cookie ou nao
    if (!req.session.user) {
        return res.status(401).json({ erro: "Usuário não logado" });
    }
    //esse função next é do express, ele passa ela automaticamente quando um middleware é definido
    next();//fala tipo que terminou a pode ir pro próximo. se não chamar ele a requisição fica travada dps dessa função e não chama a próxima estabelecida pela rota
    //programa só chega no next para avançar para a proxima se o req.session.user for encontrado, ou seja existe uma sessao
};
