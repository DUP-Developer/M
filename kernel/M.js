const db = require('./db')
const engime = require('./engime')
const forward = require('./forward')


//criando o objeto de m
// e instanciando todas os objetos para rodar M
function M(socket) {

    //configuração ee. ações do banco de dados
    this.db = db

    //configuração e ações de socket
    this.socketManager = {
        emit: (obj) => {
            socket.emit("event-message", {...obj})
        },
        question: (obj, callback) => {
            socket.emit('event-question', obj)

            socket.on('event-question', (data) => {
                callback(data)
            })
        }
    }

    //configuração e ações para chamadas de libs externas
    this.forward = forward

    //configuração e ações para treduzir o que cliente esta falando
    this.engime = engime

    //objeto de manipulação global
    this.context = {}

    //ouvindo
    this.listen = (message) => {

        this.context = {...{
            //    limpar modulo  
            clear: () => {
                this.context.module = false
            },
            //    inserir mensagem
            write: (message) => {
                this.context.message = message
            },

            message: message, //messagens enviadas para o server
            context: false,
            arrayMessage: message.split(" "),
            module: false,
            drive: false
        }}




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
    return new M(io)
}
