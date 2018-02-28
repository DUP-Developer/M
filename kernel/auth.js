var token = require('token');
const db = require('./db')

token.defaults.secret = 'DJOE';
token.defaults.timeStep = 24 * 60 * 60; // 24h in seconds

let auth = {
    create: (name) => {
        //criand a tabela de person
        db.createTable('person')

        // pegando o o id do usuario recem criado
        let id = db.insert('person', { name: name })

        // gerando o token
        token = JSON.stringify( { id: id, role: 'person', auth: token.generate(`${id}|person`) });

        //fazendo a atualização com o token
        //db.update('person', id, { token: token })

        console.log(db.info())

        return token
    }
}

console.log(auth.create("joer"))