export default {
  startup(m) {},
  run(m) {    
    this[m.context.module.method](m)
  },
  myTerms: [
    {
      terms: [
        'ei', 'eaw', 'oier', 'oi', 'hello', 'olá', 'vai', 'hi'
      ],
      method: 'give_hello',
      description: 'Posso interação como uma pessoa normal, fale um oi ;) \n',
      name: 'interaction',
      found: 0
    },
    {
      terms: [
        'vllw', 'obrigado', 'massa'
      ],
      method: 'thanks',
      description: 'Posso interação como uma pessoa normal, fale um oi ;) \n',
      name: 'interaction',
      found: 0
    },
    {
      terms: [
        'kkkk', 'hahahah', 'kkk', 'rsrsrs'
      ],
      method: 'laughs',
      description: 'Posso interação como uma pessoa normal, fale um oi ;) \n',
      name: 'interaction',
      found: 0
    }
  ],

  // falando oi
  give_hello(m) {
    m.context.message = this.myTerms[0].terms[Math.floor(Math.random() * this.myTerms[0].terms.length)]
    m.reply({ context: m.context })
  },
  
  // agradecimentos, resposta
  thanks(m) {
    m.context.message = 'De nada'
    m.reply({ context: m.context })
  },

  // agradecimentos, resposta
  laughs(m) {
    m.context.message = '^^'
    m.reply({ context: m.context })
  }
}
