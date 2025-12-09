"use strict";

function getIdDaUrl() {//pega o id daquele restaurante
    const params = new URLSearchParams(location.search);
    return params.get("id");
}

async function carregarRestaurante(id) {//pega valores das colunas do estabelecimento que tem aquele id e ja devolve em forma de objeto da classe estabelecimento
    //const resp = await fetch(`/api/estabelecimentos/${id}`);
    const resp = await fetch(`/api/estabelecimentos/id/${id}`);
    return await resp.json();
}

async function carregarProdutos(cnpj) {
    const resp = await fetch(`/api/produtos/${encodeURIComponent(cnpj)}`);
    return await resp.json();
}

function preencherHeader(rest) { //cabeçalho do html. essa funçao precisa ja receber o estabalecimento em forma de classe
    document.getElementById("restLogo").src = rest.imagem;
    document.getElementById("restNome").textContent = rest.nome;
    document.getElementById("restAvaliacao").textContent = rest.avaliacao;
    document.getElementById("restDistancia").textContent = rest.distancia;
    document.getElementById("restFrete").textContent = rest.frete.toFixed(2);
}

//renderizar em html
function renderizarProdutos(lista) {
    const container = document.getElementById("listaCardapio");
    container.innerHTML = "";

    lista.forEach(item => {
        const card = document.createElement("div");
        card.className = "item-card";

        const info = document.createElement("div");
        info.className = "item-info";

        const titulo = document.createElement("h3");
        titulo.textContent = item.nome;

        const preco = document.createElement("p");
        preco.innerHTML = `<strong>R$ ${item.valor.toFixed(2)}</strong>`;
        info.appendChild(titulo);
        info.appendChild(preco);

        const remover = document.createElement("button");
        remover.textContent = "-";
        info.appendChild(remover);

        const contador = document.createElement("span");
        contador.className = "contador";
        contador.textContent = " 1 ";
        info.appendChild(contador);

        const adicionar = document.createElement("button");
        adicionar.textContent = "+";
        info.appendChild(adicionar);

        adicionar.addEventListener("click", () => {
            let valor = parseInt(contador.textContent) + 1;
            contador.textContent = " " + valor + " ";
        });

        remover.addEventListener("click", () => {
            let valor = parseInt(contador.textContent);
            if (valor > 1) contador.textContent = " " + valor - 1 + " ";
        });

        const botaoCarrinho = document.createElement("button");
        botaoCarrinho.textContent = "Adicionar ao carrinho";
        botaoCarrinho.className = "botao";
        info.appendChild(botaoCarrinho);

        botaoCarrinho.addEventListener("click", () => {
            const quantidade = parseInt(contador.textContent);
            adicionarAoCarrinho(item, quantidade);
        });

        const img = document.createElement("img");
        img.src = item.imagem;
        img.alt = item.nome;

        card.append(info, img);

        container.appendChild(card);
    });
}

async function adicionarAoCarrinho(produtoItem, quantidade) {
    console.log("[FRONT] clicou adicionarAoCarrinho", { produtoItem, quantidade });

    try {
        const resp = await fetch("http://localhost:1504/api/carrinho/adicionar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id_produto: produtoItem.id,   // <--- AQUI É "id", não "id_produto"
                quantidade: quantidade
            })
        });

        console.log("[FRONT] resposta fetch status:", resp.status, resp.statusText);

        const data = await resp.json();
        console.log("[FRONT] body recebido (json):", data);

        if (resp.ok) {
            alert("Adicionado ao carrinho!");
        } else {
            alert("Erro: " + data.erro);
        }

    } catch (erro) {
        console.error("[FRONT] erro no fetch:", erro);
    }
}

async function main() {
    const id = getIdDaUrl();

    const rest = await carregarRestaurante(id); //rest já é um objeto Estabelecimento
    preencherHeader(rest);

    const produtos = await carregarProdutos(rest.cnpj);
    renderizarProdutos(produtos);
}

document.addEventListener("DOMContentLoaded", main);
