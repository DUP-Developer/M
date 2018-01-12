
/**
-------------------------------------------------
- SOCKET.IO -
-------------------------------------------------
**/
const socket = {
    instance: false,
    emit: (object) => {
        socket.instance.emit(object);
    },
    write: (object) => {
        socket.instance.emit(object);
    },
    question: (object, callback) => {
        //adicionando a flag para qeu o cliente web saiba que temque responder a mim
        object.context=true

        //envia para o cliente o que m ta falando
        socket.instance.emit(object);

        // ouve no canal exclusivo o que o cliente falou como resposta para M
        socket.instance.on('event-question', (message) => {
            console.log(message);
            callback(message)
        })

    }
}

module.exports = (io) => {
    socket.instance = io
    io.emit('event-config', {message: 'Connected', id: io.id})
    return socket
}
