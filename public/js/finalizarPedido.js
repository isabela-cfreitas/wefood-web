document.addEventListener("DOMContentLoaded", () => {
    carregarEnderecos();
});

async function carregarEnderecos() {
    try {
        const resp = await fetch("/api/logado");
        const dados = await resp.json();

        if (!dados.logado || dados.tipo !== "cliente") {
            alert("Você precisa estar logado para acessar essa página.");
            return;
        }

        // endereço direto da sessão
        renderizarEnderecos([dados.endereco]);

    } catch (erro) {
        console.error("Erro ao carregar endereço:", erro);
    }
}

function renderizarEnderecos(enderecos) {
    const select = document.getElementById("enderecos");
    select.innerHTML = "";

    enderecos.forEach((endereco, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = endereco;
        select.appendChild(option);
    });
}
