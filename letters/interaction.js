let interaction = {
    run: (obj, context) => {

        //iteraçaõ basica de boas vindas
        obj.message = obj.others[Math.floor(Math.random()*obj.others.length)];

        context.socketManager.emit('event-message', obj)
    }
}

module.exports = interaction;
