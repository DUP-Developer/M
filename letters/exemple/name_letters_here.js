export default {
  // metodo que é executado quando a letter é
  // adicionado na base de conhecimentos de M
  startup(m) {

  },
  // m é uma estancia do objeto de controle geral de tudo
  run(m) {
    //executando o metodo que o translator diz que é o certo
    this[m.context.module.method](m)
  },
  //terms que são necessarios par saber o que fazer depois de qeu o cliente digitou
  myTerms: [
    {
      terms: [
      ],
      method: 'method',
      name: 'name - method',
      description: '',
      found: 0
    }
  ],
  // method principal para ser executado isso aqui o modulo todo
  // metodo qualqeur que pode ser criado pelo dev
  method(m) {
  
  }
}
