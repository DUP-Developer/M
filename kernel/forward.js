/**
-------------------------------------------------
- PUNCHM -
-------------------------------------------------
**/
const forward = {
  run(m) {
    
    //caso não venha nada ele já responde ao carinha
    if (m.context.module.name == "" || !m.context.module) {
      
      m.context.message = 'Não entendi.'
      
      m.reply({ context: m.context });
      
      return;
    }
    
    this.load(m)
  },
  reply(m) {
    /*
    transferindo dados de goBack para modules, onde o que era resposta vai
    se tornar como uma requisiçaõ primaria.
    */
   
    m.context.module.name = m.context.goBack.module
    m.context.module.method = m.context.goBack.method

    //limpando goBack
    m.context.goBack = false    

    this.load(m)
  },

  load(m) {
    //caso ela saiba o que vc disse ela vai chamar a letter responsavel por tratar o que vc quer
    let resultM = require('../letters/' + m.context.module.name).default;

    //com base na traduçaõ descobre quem deve resolver o que o cliente esta falando
    resultM.run(m)
  }
}

module.exports = forward