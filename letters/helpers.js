const fs = require('fs')

const helpers = {
  run(m) {
    this[m.context.module.method](m)
  },
  myTerms: [
    {
      terms: [
        "helper", 'helpers', 'ajuda', 'quais', 'meus', "commands", "comandos", "como", "esta"
      ],
      method: 'whatMyName',
      name: '',
      description: 'posso ajudar com com todos as coisas que sei',
      found: 0
    }
  ],
  whatMyName: (m) => {
    let modules = fs.readdirSync('./letters/')

    m.context.message = '\n'

    for (let module of modules) {
      if (!/([A-Za-z]*\.[a-zA-Z])\w+/.test(module)) continue //caso nõa seja um arquivo

      let r = require("./" + module.split(".")[0])

      if (!r.myTerms) continue
      
      for (let term of r.myTerms) //para inserir todos os termos num modulo
      {
        // adicionando o nome do modulo para ele saber quem chamar no futuro
        if (!term.description) continue

        m.context.message += `${term.description} \n`
      }
    }

    m.reply({ context: m.context })
  }
}

module.exports = helpers;
