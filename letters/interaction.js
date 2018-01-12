let interaction = {
    context : {},
    give_hello: () => {
        interaction.context.socketManager.clients[interaction.context.id].emit('event-message', {message:'oier'})
    },
    run: (m) => {
        interaction.context = m

//        console.log(interaction.context.socketManager);
        //executando o metodo que o translator diz que é o certo
        interaction[m.context.module.method]()
    },
    myTerms:[
        {
            terms : [
                "oier", 'oi', 'hello', 'olá', 'como', "vai"
            ],
            method: 'give_hello',
            name: '',
            found: 0
        }
    ]
}

module.exports = interaction;
