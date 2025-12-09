class Usuario {
    constructor(id,nome, numTelefone, email, hashSenha) {
        this._id = id;
        this._nome = nome;
        this._numTelefone = numTelefone;
        this._email = email;
        this._hashSenha = hashSenha;
    }

    get id (){
        return this._id;
    }

    get nome() {
        return this._nome;
    }

    set nome(n) {
        this._nome = n;
    }

    get numTelefone() {
        return this._numTelefone;
    }

    set numTelefone(t) {
        this._numTelefone = t;
    }

    get email() {
        return this._email;
    }

    set email(e) {
        this._email = e;
    }

    get hashSenha() {
        return this._hashSenha;
    }

    toJSON() {
        return {
            nome: this._nome,
            numTelefone: this._numTelefone,
            email: this._email,
        };
    }
}

module.exports = Usuario;
