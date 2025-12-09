class Cliente extends Usuario {
    constructor(nome, numTelefone, email, hashSenha, cpf, endereco) {
        super(nome, numTelefone, email, hashSenha);
        this._cpf = cpf;
        this._endereco = endereco;
        // this._carrinho = carrinho;
    }

    get cpf() {
        return this._cpf;
    }

    get endereco() {
        return this._endereco;
    }

    // get carrinho() {
    //     return this._carrinho;
    // }

    set endereco(endereco) {
        this._endereco = endereco;
    }

    // set carrinho(carrinho) {
    //     this._carrinho;
    // }
    
    toJSON() {
        return {
            nome: this.nome,
            numTelefone: this.numTelefone,
            email: this.email,
            hashSenha: this.hashSenha,
            cpf: this.cpf,
            endereco: this.endereco,
            // carrinho: this.carrinho
        };
    }
}