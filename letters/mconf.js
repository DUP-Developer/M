const fs = require('fs')

let mconf = {
    context: {},
    scan: () => { //scam para adicionar novos termos no banco de dados
        mconf.context.socketManager.emit('event-message', {message:'tá, espera ai'})


        let modules = fs.readdirSync('./letters/')


        for(let module of modules)
        {
            if(!/([A-Za-z]*\.[a-zA-Z])\w+/.test(module)) continue //caso nõa seja um arquivo

            let r = require("./"+module.split(".")[0])

            if(r.myTerms == undefined) continue

            for(let term of r.myTerms) //para inserir todos os termos num modulo
            {
                // adicionando o nome do modulo para ele saber quem chamar no futuro
                term.name = module.split(".")[0]
                // salvando o novo termo para M
                mconf.context.db.insert('terms', term)
            }

        }

        mconf.context.socketManager.emit('event-message', {message:'Pronto ja fiz'})
        console.log(mconf.context.db.info());
    },
    run: (m) => {
        mconf.context = m
        //executando o metodo que o translator diz que é o certo
        mconf[m.context.module.method]()

        // m.context = {}
    },
    myTerms:[
        {
            terms : [
                "lê", 'le', 'todos', 'olha', 'modulos', "ve", "modulo", "scaneia"
            ],
            method: 'give_hello',
            name: '',
            found: 0
        }
    ]
}

module.exports = mconf;
