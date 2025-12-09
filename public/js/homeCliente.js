"use strict";

let estabelecimentosCache = []; // guarda todos para aplicar filtros

//antes só tinha uma funçao, que era de renderizar estabelecimentos. o motivo de ter dividir entre carregar e renderizar foi pq agora com
//os filtros a de carregar já prepara a lista filtrada ou nao e a de renderizar não precisa ficar sabendo se é a lista original ou filtrada(abstração)

async function carregarEstabelecimentos() {
    const resposta = await fetch("/api/estabelecimentos");//fetch é get por padrão
    estabelecimentosCache = await resposta.json();
    renderizar(estabelecimentosCache);
}

function renderizar(lista) {
    const container = document.getElementById("listaRestaurantes");
    container.innerHTML = ""; //limpar se ja tinha algo lá

    lista.forEach(est => { //continua renderizando igual antes
        const card = document.createElement("div");
        card.classList.add("card");//adiciona classe cs à div

        const img = document.createElement("img");
        img.src = est.imagem;
        img.alt = est.nome;

        const titulo = document.createElement("h4");
        titulo.textContent = est.nome;

        const info = document.createElement("p");
        info.textContent =
            `${est.distancia} km • ⭐ ${est.avaliacao} • Frete R$ ${est.frete}`; //$ serve para usar variaveis na string

        card.appendChild(img);
        card.appendChild(titulo);
        card.appendChild(info);

        card.addEventListener("click", () => {
            window.location.href = `cardapio.html?id=${est.id}`;
        });

        container.appendChild(card);//container pega todos os cards
    });
}
async function verificarSessao() {
    const resp = await fetch("/api/logado");
    const dados = await resp.json();

    const areaLogin = document.getElementById("areaLogin");
    areaLogin.innerHTML = ""; // limpa nó

    if (dados.logado && dados.tipo === "cliente") {
        const local_div = document.createElement("div");
        local_div.classList.add("location");
        const local_spam = document.createElement("span");
        const partes = dados.endereco.split(",");
        const enderecoCurto = partes.length >= 2? `${partes[0].trim()}, ${partes[1].trim()}`: dados.endereco;
        local_spam.textContent = `📍 Entregar em ${enderecoCurto}`;
        local_div.appendChild(local_spam);
        areaLogin.appendChild(local_div);
        //só mostra botão de perfil e de carrinho se estiver logado
        const span = document.createElement("span");
        span.textContent = `👤  ${dados.nome}              `;
        areaLogin.appendChild(span);

        const carrinho = document.createElement("a");
        carrinho.href = "carrinho.html";
        carrinho.textContent = "🛒";
        areaLogin.appendChild(carrinho);

        const deslogar = document.createElement("button");
        deslogar.innerText = "Sair"
        deslogar.classList.add("btn-login")
        deslogar.addEventListener("click", async () => {
            await fetch("/api/clientes/logout", { method: "POST" });
            window.location.href = "/";
        });
        areaLogin.appendChild(deslogar)

    } else {
        //botao de login
        const botao = document.createElement("a");
        botao.href = "loginGeral";
        botao.classList.add("btn-login");
        botao.textContent = "Entrar";

        areaLogin.appendChild(botao);
    }
}
//filtros
function tirarFiltros(){
    renderizar(estabelecimentosCache);
}

function filtroFreteGratis() {
    const filtrados = estabelecimentosCache.filter(e => e.frete == 0); //filter cria um novo array que só tem os restaurantes com frete = 0
    renderizar(filtrados);
}

function filtroMelhoresAvaliacoes() {
    const top = [...estabelecimentosCache]
        .sort((a, b) => b.avaliacao - a.avaliacao)
        .slice(0, 5);
    renderizar(top);
}

function filtroMaisProximos() {
    const top = [...estabelecimentosCache]
        .sort((a, b) => a.distancia - b.distancia)
        .slice(0, 5);
    renderizar(top);
}

//fazer funções existirem no escopo global para poderem ser chamadas por onclick
window.tirarFiltros = tirarFiltros;
window.filtroFreteGratis = filtroFreteGratis;
window.filtroMelhoresAvaliacoes = filtroMelhoresAvaliacoes;
window.filtroMaisProximos = filtroMaisProximos;

document.addEventListener("DOMContentLoaded", () => {
    verificarSessao();
    carregarEstabelecimentos(); //por padrao quando abre a pagina vai carregar e renderizar todos os restaurantes, só se a pessoa apertar um botao de filtro que chama a renderizar para a lista filtrada
});
