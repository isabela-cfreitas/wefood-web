async function enviarFormulario() {
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const telefone = document.getElementById("telefone").value;
    const cnpj = document.getElementById("cnpj").value;

    const cep = document.getElementById("cep").value;
    const rua = document.getElementById("rua").value;
    const numero = document.getElementById("numero").value;
    const complemento = document.getElementById("complemento").value;
    const bairro = document.getElementById("bairro").value;
    const cidade = document.getElementById("cidade").value;

    const imagem = "imagens/estabelecimentos/SemFoto.png "
    const distancia = 0
    const avaliacao = 5
    const frete = 0

    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;

    if (senha !== confirmarSenha) {
        alert("As senhas não coincidem!");
        return;
    }

    const enderecoCompleto = `${rua}, ${numero}, ${bairro}, ${cidade}, CEP ${cep}, Compl: ${complemento}`;

    const dados = {
        nome,
        telefone,
        email,
        senha,
        cnpj,
        endereco: enderecoCompleto,
        imagem,
        distancia,
        avaliacao,
        frete
    };

    try {
        const resposta = await fetch("/api/estabelecimentos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });

        const resultado = await resposta.json();

        if (resposta.ok) {
            alert("Estabelecimento cadastrado com sucesso!");
            window.location.href = "/LoginEstabelecimento";
        } else {
            alert("Erro: " + resultado.erro);
        }

    } catch (erro) {
        console.error("Erro no fetch:", erro);
        alert("Falha ao enviar dados.");
    }
}
