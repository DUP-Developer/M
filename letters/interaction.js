'use strict'

const interaction = {
  run(m) {    
    this[m.context.module.method](m)
  },
  myTerms: [
    {
      terms: [
        "oier", 'oi', 'hello', 'olá', "vai", "hi", "como", "esta"
      ],
      method: 'give_hello',
      description: 'Interação comigo, fale um oi',
      name: '',
      found: 0
    }
  ],
  give_hello(m) {
    m.context.message = this.myTerms[0].terms[Math.floor(Math.random() * this.myTerms[0].terms.length)]
    m.reply({ context: m.context })
  }
}

module.exports = interaction