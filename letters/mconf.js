const fs = require('fs')
const db = require('../kernel/db')

let mconf = {  
  run(m) {
    //executando o metodo que o translator diz que é o certo
    this[m.context.module.method](m)
  },
  myTerms: [
    {
      terms: [
        "lê", 'le', 'todos', 'olha', 'modulos', "ve", "modulo", "scaneia"
      ],
      method: 'scan',
      name: '',
      found: 0
    }
  ],
  scan(m) { //scam para adicionar novos termos no banco de dados
    let modules = fs.readdirSync('./letters/')

    for (let module of modules) {
      if (!/([A-Za-z]*\.[a-zA-Z])\w+/.test(module)) continue //caso nõa seja um arquivo

      let r = require("./" + module.split(".")[0])

      if (!r.myTerms) continue

      for (let term of r.myTerms) //para inserir todos os termos num modulo
      {
        // adicionando o nome do modulo para ele saber quem chamar no futuro
        term.name = module.split(".")[0]
        // salvando o novo termo para M
        db.insert('terms', term)
      }

    }
    
    m.context.message = 'Pronto ja fiz'
    m.reply(m.context)
  }
}

mconf.scan()

module.exports = mconf;
