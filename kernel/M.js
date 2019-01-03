const engime = require('./engime')
const forward = require('./forward')


//criando o objeto de m
// e instanciando todas os objetos para rodar M
class M {
  constructor() {
    this.res = {}
    this.context = {}
  
    this.model = {
      ...{
        //    limpar modulo  
        clear: () => {
          this.context.module = false
        },
        //    inserir mensagem
        write: (message) => {
          this.context.message = message
        },  
        message: "", //messagens enviadas para o server
        goBack: false,
        module: false,
        drive: false  
      }
    }
  }

  listen(ctx, res) {
    this.res = res

    //verificando se vem o alguma contextto do cliente
    ctx.arrayMessage = ctx.message.split(" ")

    //instanciando no global o contexto
    this.context = ctx

    //have goback? - se é uma requisição de resposta que M esta esperando
    if (ctx.goBack) {
      forward.reply(this)
    } else {
      
      //Fazendo a tradução de palavras do cliente para modulo e methodo a ser chamado
      this.context = engime.moduleTranslator(this);
      
      //encaminhando para o modulo responsavel
      forward.run(this);
    }
  }
}


module.exports = new M()