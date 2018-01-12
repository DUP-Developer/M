
const db = require('./db')
const socket = require('./socket')
const engime = require('./engime')
const forward = require('./forward')


//criando o objeto de m
// e instanciando todas os objetos para rodar M
function M () {

    //configuração ee. ações do banco de dados
    this.db = db

    //configuração e ações de socket
    this.socketManager = {
        clients: []
    }

    //configuração e ações para chamadas de libs externas
    this.forward = forward

    //configuração e ações para treduzir o que cliente esta falando
    this.engime = engime

    //objeto de manipulação global
    this.context = {
        id: null,
        message: "" , //messagens enviadas para o server
        context: false,
        arrayMessage: "",
        module: false,
        drive: false
    }

    //ouvindo
    this.listen = (message, id) => {
        this.context.message = message
        this.context.arrayMessage = message.split(" ")
        this.context.id = id


        //vendo o que foi falado
        this.engime.moduleTranslator(this);

        console.log('INIT------------------------------------\n');
        console.log(this.context);
        console.log('\nFIN------------------------------------\n');

        //vendo quem vai ser chamado
        this.forward.run(this);

    }


}


module.exports = (io) => {
    // instanciando M
    // dando a referencia de socketIO para I/O

    return new M()
}
