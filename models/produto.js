class Produto {
    constructor(id, nome, valor, cnpj_estabelecimento, imagem) {
        this._id = id;
        this._nome = nome;
        this._valor = valor;
        this._cnpj_estabelecimento = cnpj_estabelecimento;
        this._imagem = imagem;
    }

    get id() {
        return this._id;
    }

    get cnpj_estabelecimento() {
        return this._cnpj_estabelecimento;
    }

    get nome() {
        return this._nome;
    }

    get valor() {
        return this._valor;
    }

    get imagem() {
        return this._imagem;
    }

    set nome(nome) {
        this._nome = nome;
    }

    set valor(valor) {
        this._valor = valor;
    }

    set imagem(nome) {
        this._imagem = imagem;
    }

    toJSON() {
        return {
            id: this.id,
            nome: this.nome,
            valor: this.valor,
            cnpj_estabelecimento: this.cnpj_estabelecimento,
            imagem: this.imagem
        };
    }
}

module.exports = Produto;
