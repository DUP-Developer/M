/**
------------------------------------------------
Meu money
------------------------------------------------
**/
const _ = require('lodash')

const financas = {
    termsPositives: ["sim", "tem", "quero"],
    termsNegatives: ["não", "vlw", "de boas"],
    m: {},
    what: () => {

        financas.m.context.write("O que foi que vc comprou? \n")

        financas.m.socketManager.question(financas.m.context, (answer) => {
            console.log(financas.engime.item_price())
            financas.howMuch()
        })

    },
    howMuch: () => {

        financas.m.context.write("É quanto foi isso?? \n")

        financas.m.socketManager.question(financas.m.context, (answer) => {
            financas.money.despesas.push(parseFloat(answer.message.replace(',', '.')))
            financas.again()
        })


    },
    again: () => {
        financas.m.context.write("tem mais coisas? \n")

        financas.m.socketManager.question(financas.m.context, (signal) => {
            if (financas.termsPositives.indexOf(signal.message) != -1)
                financas.what()
            else if (financas.termsNegatives.indexOf(signal.message) != -1) {
                financas.extrato()
                financas.close()

            } else {
                financas.m.socketManager.emit("Não entendi.")
                financas.again()
            }

        })
    },
    extrato: () => {
        let sum = 0,
            message = '';

        financas.m.context.write(`Data: ${financas.money.date} \n`)

        //        financas.m.socketManager.emit(financas.m.context)


        //Despesas avulsas
        //        financas.m.context.write("\n - Despesas Avulsas - \n\n")
        //        financas.m.socketManager.emit(financas.m.context)

        for (let it in financas.money.despesas) {
            // aqui fica a parte de retorno para o cliente

            message += "Item: " + financas.money.nameDespesas[it] + " - R$ |" + financas.money.despesas[it] + "| \n"

            sum += financas.money.despesas[it]
        }


        financas.m.context.write(message)
        financas.m.socketManager.emit(financas.m.context)

        //despesas fixas

        message = "\n - Despesas Fixas - \n\n"


        for (let it in financas.money.despesasFixas) {
            // aqui fica a parte de retorno para o cliente

            message += "Item: " + financas.money.nameDespesasFixas[it] + " - R$ |" + financas.money.despesasFixas[it] + "| \n"

            sum += financas.money.despesasFixas[it]
        }

        financas.m.context.write(message)
        financas.m.socketManager.emit(financas.m.context)

        //resumo de total de gastos
        financas.m.context.write("\n\n - Total de gastos: R$ " + sum + " - \n\n")
        financas.m.socketManager.emit(financas.m.context)

    },
    buy: () => {
        financas.m.socketManager.question({
            message: 'Quanto é a parada? \n'
        }, (answer) => {
            var valorNovaAquisicao = parseFloat(answer.replace(',', '.'))

            if (financas.money.receita > financas.money.DespesasTotais())
                if ((financas.money.receita - financas.money.DespesasTotais()) > valorNovaAquisicao)
                    financas.m.socketManager.emit({
                        message: "Da para comprar sim, e ainda sobra R$ " + ((financas.money.receita - financas.money.DespesasTotais()) - valorNovaAquisicao).toFixed(2) + "\n"
                    })
            else
                financas.m.socketManager.emit({
                    message: "Da não vicc, é caro só temos R$ " + ((financas.money.receita - financas.money.DespesasTotais())).toFixed(2) + "\n"
                })
            else
                financas.m.socketManager.emit({
                    message: "Homi, tu tá e devendo demais vlh. da não.\n"
                })
        })
    },
    disponivel: () => {

        let sum = financas.money.DespesasTotais();

        if (sum > financas.money.receita)
            financas.m.socketManager.emit({
                message: "bom, você ta é lascado sabe, ta devendo ->> R$ " + (sum - financas.money.receita).toFixed(2) + "\n"
            })
        else
            financas.m.socketManager.emit({
                message: "bom, você tem R$ " + (financas.money.receita - sum).toFixed(2) + " de dinheiro livre. \n"
            })

        //retrono para outras funções
        return financas.money.receita > sum ? financas.money.receita - sum : 0
    },
    money: {
        message: 'Bom...',
        receita: 763,
        date: new Date(),
        despesas: {},
        type: 'creditCard',

        DespesasTotais: () => {
            var sum = 0;
            //despesas avulsas
            //            console.log(financas.money.despesas)


            for (let it in financas.money.despesas)
                sum += parseFloat(financas.money.despesas[it]);
            //despesas fixas
            for (let it in financas.money.despesasFixas)
                sum += parseFloat(financas.money.despesasFixas[it]);

            return sum

        }
    },
    close: () => {
        financas.m.socketManager.emit("Certo.")
        financas.m = false
    },
    engime: {
        item_price: () => {
            let s = financas.m.context.message.split('de')

            return {
                item: s[0],
                price: s[1].match(/[0-9].?[0-9]*.?[0-9]*/) == null ? 0 : s[1].match(/[0-9].?[0-9]*.?[0-9]*/)[0]
            }

        }
    },
    run: (m) => {
        financas.m = m
        // console.log(m.m.module);
        //executando o metodo que o translator diz que é o certo
        financas[m.context.module.method]()
    },
    myTerms: [{
            terms: [
                "dinheiro", 'posso', 'gastar', 'tenho', 'quanto'
            ],
            method: 'disponivel',
            name: 'financas',
            found: 0
        },
        {
            terms: [
                "comprei", 'parada', 'uma', 'negocio'
            ],
            method: 'what',
            name: 'financas',
            found: 0
        }
    ]
}



module.exports = financas;