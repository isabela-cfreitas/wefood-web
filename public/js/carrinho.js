"use strict";

async function carregar_carrinho() {
    const lista = document.getElementById("listaItens");
    const resumo = document.getElementById("resumo");


    const resp = await fetch("/api/carrinho/meu-carrinho");

    if (!resp.ok) {
        lista.textContent = "Erro ao carregar o carrinho.";
        return;
    }

    const itens = await resp.json();

    if (itens.length === 0) {
        lista.textContent = "Seu carrinho está vazio.";
        return;
    }

    lista.innerHTML = "";//limpar se ja tinha alguma coisa antes
    let total = 0;

    itens.forEach(item => {
        if (!item.idItem) {
            lista.textContent = "Seu carrinho está vazio.";
            return;
        }
        const card = document.createElement("div");
        card.classList.add("item-card");

        const info = document.createElement("div");//info= nome da comida + quantidade + preço da quantidade total
        info.classList.add("info-item");

        const nome = document.createElement("h3");
        nome.textContent = item.nomeProduto;

        const qtd = document.createElement("p");
        qtd.textContent = "Quantidade: " + item.quantidade;

        const precoTotal = document.createElement("p");
        const precoCalc = item.precoProduto * item.quantidade;
        precoTotal.textContent = "Subtotal: R$ " + precoCalc.toFixed(2);

        info.appendChild(nome);
        info.appendChild(qtd);
        info.appendChild(precoTotal);

        const img = document.createElement("img");
        img.classList.add("img-item");
        img.src = item.imagem;

        const remover = document.createElement("button");
        remover.classList.add("botao");
        remover.classList.add("botao-remover");
        remover.textContent = "Remover do carrinho";

        remover.addEventListener("click", async () => {

            const resp = await fetch("/api/carrinho/remover", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ idItem: item.idItem })
            });

            if (!resp.ok) {
                console.error("[FRONT] erro ao remover");
                return;
            }

            carregar_carrinho(); //tem que recarregar depois de remover p dar p ver que sumiu
        });

        card.appendChild(remover);
        card.appendChild(info);
        card.appendChild(img);
        lista.appendChild(card);

        total += precoCalc;
    });

    resumo.innerHTML = ""; //limpar se ja tinha alguma coisa antes

    //resumo do pedido
    const subtotal = document.createElement("p");
    subtotal.textContent = "Subtotal: R$ " + total.toFixed(2);

    const entrega = document.createElement("p");
    entrega.textContent = "Taxa de entrega: R$ 6.00";

    const linha = document.createElement("hr");
    linha.style.margin = "10px 0";

    const totalFinal = document.createElement("p");
    totalFinal.innerHTML = "<strong>Total: R$ " + (total + 6).toFixed(2) + "</strong>";

    resumo.appendChild(subtotal);
    resumo.appendChild(entrega);
    resumo.appendChild(linha);
    resumo.appendChild(totalFinal);

    document.getElementById("btnFinalizar").addEventListener("click", () => {
        window.location.href = "finalizarPedido.html";
    });
}

document.addEventListener("DOMContentLoaded", carregar_carrinho);
