import fs from 'fs'
import db from '../kernel/db'

export default {
  run(m) {
    //executando o metodo que o translator diz que é o certo
    this[m.context.module.method](m)
  },
  myTerms: [
    {
      terms: [
        'lê', 'le', 'olha', 'modulos', 've', 'modulo', 'scaneia'
      ],
      method: 'scan',
      description: 'Posso escaniar todos os modulos registrados, só pedir.\n',
      name: 'mconf',
      found: 0
    }
  ],
  /**
   * escaneia modulos e adiciona os termos e referencias
   * no banco de dados local
   * @param {Object} m 
   */
  scan(m) { //scam para adicionar novos termos no banco de dados
    let modules = fs.readdirSync('./letters/')
    
    for (let module of modules) {      
      if (!/([A-Za-z]*\.[a-zA-Z])\w+/.test(module)) continue //caso nõa seja um arquivo
      
      let r = require("./" + module.split(".")[0]).default
      
      if (!r.myTerms) continue

      for (let term of r.myTerms) //para inserir todos os termos num modulo
      {
        // adicionando o nome do modulo para ele saber quem chamar no futuro
        term.name = module.split(".")[0]
        // salvando o novo termo para M
        db.insert('terms', term)
      }
    }
        
    if (m != null) {
      m.context.message = 'Pronto ja fiz'
      
      m.reply({
        context: m.context
      })
    }
  }
}
