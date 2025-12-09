async function enviarFormulario() { //essa função é chamada por onclick no botão do html de cadastro, aí ela pega os dados dos labels por ip
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    try {
        const resposta = await fetch("/api/clientes/login", {//precisa de post(nao pode ser só get) pq vai ter que calcular o hash da senha inserida no formulário lá no controller, e tbm enviar o email do formulario para fazer a requisiçao no bd
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha })
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            alert("Erro: " + resultado.erro);
            return;
        }

        console.log("Dados do cliente logado:", resultado.cliente);

        window.location.href = "/HomeCliente";

    } catch (erro) {
        console.error("Erro:", erro);
        alert("Falha ao enviar dados.");
    }
}