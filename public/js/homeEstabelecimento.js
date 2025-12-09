"use strict";

async function verificarSessao() {
    const resp = await fetch("/api/logado");
    const dados = await resp.json();

    const areaLogin = document.getElementById("areaLogin");
    areaLogin.innerHTML = ""; // limpa nó

    if (dados.logado) {
        //só mostra botão de perfil e de carrinho se estiver logado
        const span = document.createElement("span");
        span.textContent = `👤  ${dados.nome}              `;
        areaLogin.appendChild(span);

        const deslogar = document.createElement("button");
        deslogar.innerText = "Sair"
        deslogar.classList.add("btn-login")
        deslogar.addEventListener("click", async () => {
            await fetch("/api/estabelecimento/logout", { method: "POST" });
            window.location.href = "/HomeCliente";
        });
        areaLogin.appendChild(deslogar)

    }
}

document.addEventListener("DOMContentLoaded", verificarSessao);