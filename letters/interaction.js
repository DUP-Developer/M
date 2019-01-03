'use strict'

let interaction = {
  m: {},
  run: (m) => {
    interaction.m = m
    interaction[m.context.module.method]()
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
  give_hello() {
    interaction.m.context.message = interaction.myTerms[0].terms[Math.floor(Math.random() * interaction.myTerms[0].terms.length)]
    interaction.m.res.json({ context: interaction.m.context })
  }
}

module.exports = interaction;
