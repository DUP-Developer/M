let ask = {
    registerFuncs:{
        'money':[
            'dinheiro', 'money', 'bufunfa', 'grana'
        ]
    },
    object: {},

    run: (obj, context) => {

        //guardando o objeto
        ask.object = obj;

        //iteraçaõ basica de boas vindas
        for(let v of obj.arrayMessage)
        {
            for(let reg in ask.registerFuncs){
                for(let regSee of ask.registerFuncs[reg])
                {
                    //verificado os termos para poder saber qual parte da letter ele vai chamar
                    if(regSee == v)
                    {
                        context.socketManager.emit("event-message", legs[reg].action())
                    }

                }
            }
        }
        context.socketManager.emit("event-message", obj)
    }
}


/**
------------------------------------------------
Meu money
------------------------------------------------
**/
const legs = {
    money:{
        message:'Bom...',
        creditCard:{
            receita: 710,
            despesas: [12,11,190, 37, 344],
            nameDespesas: []
        },
        extrato: () => {
            let sum=0;

            for(let dis of legs.money.creditCard.despesas)
            {
                sum += dis;
            }

            legs.money.message = ("Receita: " + legs.money.creditCard.receita; + "-" + "Despesas: "+ sum);

        },
        action: () => {

            legs.money.extrato();

            ask.object.message = legs.money.message;
            return ask.object;
        }
    }
}

module.exports = ask;
