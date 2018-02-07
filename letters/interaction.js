'use strict'

let interaction = {
    m: {},
    run: (m) => {
        interaction.m = m

        //        console.log(interaction.context.socketManager);
        //executando o metodo que o translator diz que é o certo
        interaction[m.context.module.method]()

        m.context.clear()
    },
    myTerms: [
        {
            terms: [
                "oier", 'oi', 'hello', 'olá', "vai"
            ],
            method: 'give_hello',
            name: '',
            found: 0
        }
    ],
    give_hello: () => {

        interaction.m.context.write(interaction.myTerms[0].terms[Math.floor(Math.random() * interaction.myTerms[0].terms.length)])

        interaction.m.context.clear()

        interaction.m.socketManager.emit(interaction.m.context)
    }
}

module.exports = interaction;
