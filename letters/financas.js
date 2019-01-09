/**
------------------------------------------------
Meu money
------------------------------------------------
**/
import _ from 'lodash'

export default {
    termsPositives: ["sim", "tem", "quero"],
    termsNegatives: ["não", "vlw", "de boas"],
    itemWait: {}, // item que fica aguardando um valor chegar informado pelo cliente
    m: {},
    what: () => {

        financas.m.context.message = "O que foi que vc comprou?"

        financas.m.context.goBack = {
            module: "financas",
            method: "howMuch"
        }

        financas.m.res.json({
            context: financas.m.context
        })


    },
    howMuch: () => {
        let newItem = financas.engime.item_price()

        if (newItem) {
            financas.money.despesas.push(newItem)
            financas.again()
        } else {
            //adicionando o item para ser oppulado na proxima execução
            financas.itemWait = {
                item: financas.m.context.message,
                price: 0.0
            }


            //fazendo uma nova pegunta ao carinha
            financas.m.context.message = "É quanto foi isso?? "

            //preparando o contexto para resposta com M
            financas.m.context.goBack = {
                module: "financas",
                method: "again"
            }

            //enviando a mensagem para o cliente
            financas.m.res.json({
                context: financas.m.context
            })
        }

    },
    again: () => {

        //caso o itemWait esteja esperando o preço a ser adicionado ele verifica isso
        if(!_.isEmpty(financas.itemWait)){
            //pegando do contexto o valor do intem informado pelo usuario
            financas.itemWait.price = parseFloat(financas.m.context.message)

            //adicionando a nova despesa
            financas.money.despesas.push(financas.itemWait)

            //limpando o item para futuros usos
            financas.itemWait = {}
        }

        /**
         * ---------------------------------------------------
         * TESTANDO SE O USER QUER ADICIONAR MAIS COISAS
         * ---------------------------------------------------
         * **/
        //caso tenha um novo item para adicionar
        if (financas.termsPositives.indexOf(financas.m.context.message) != -1)
            financas.what()
        //caso não tenha mais nada, ele finaliza e da um extrato
        else if (financas.termsNegatives.indexOf(financas.m.context.message) != -1) {
            financas.extrato()
            financas.close()

            // caso o carinha não tenha dito sim ou nõa ai ele pergunta de novo
        }
        
        /**
         * ---------------------------------------------------
         * PERGUNTANDO SE O USER QUER ADICIONAR MAIS COISAS
         * ---------------------------------------------------
         * **/

        //caso ainda exista instancia de M aqui ele vai continuar perguntando, caso tenha sido undefinid ela não pergunta mais
        if (!_.isUndefined(financas.m)) {

            financas.m.context.message = "tem mais coisas?"

            financas.m.context.goBack = {
                module: "financas",
                method: "again"
            }

            financas.m.res.json({
                context: financas.m.context
            })
        }


    },
    extrato: () => {
        let sum = 0,
            message = '';

        message = `Data: ${financas.money.date} \n`

        //        financas.m.res.json(financas.m.context)


        /**
         * -----------------------------------------------------
         *                 DESPESAS AVULSAS
         * -----------------------------------------------------
         * **/

        //        financas.m.context.write("\n - Despesas Avulsas - \n\n")
        //        financas.m.res.json(financas.m.context)

        //iterando para poder pegar toda as despesas
        _.forEach(financas.money.despesas, (o) => {

            message += "Item: " + o.item + " - R$ |" + o.price + "| \n"

            sum += o.price
        })

        /**
         * -----------------------------------------------------
         *                 DESPESAS FIXAS
         * -----------------------------------------------------
         * **/

        message += "\n - Despesas Fixas - \n\n"

        _.forEach(financas.money.despesasFixas, (o) => {
            message += "Item: " + o.item + " - R$ |" + o.price + "| \n"

            sum += o.price
        })

        //resumo de total de gastos
        message += "\n\n - Total de gastos: R$ " + sum + " - \n\n"

        //enviando para o cliente as informações
        financas.m.context.message = message

        financas.m.res.json({context: financas.m.context})

    },
    buy: () => {
        financas.m.socketManager.question({
            message: 'Quanto é a parada? \n'
        }, (answer) => {
            var valorNovaAquisicao = parseFloat(answer.replace(',', '.'))

            if (financas.money.receita > financas.DespesasTotais()) {
                if ((financas.money.receita - financas.DespesasTotais()) > valorNovaAquisicao) {
                    financas.m.context.message = "Da para comprar sim, e ainda sobra R$ " + ((financas.money.receita - financas.DespesasTotais()) - valorNovaAquisicao).toFixed(2) + "\n"

                    financas.m.res.json({
                        context: financas.m.context
                    })
                } else {
                    financas.m.context.message = "Da não vicc, é caro só temos R$ " + ((financas.money.receita - financas.DespesasTotais())).toFixed(2) + "\n"
                    financas.m.res.json({
                        context: financas.m.context
                    })
                }
            } else {
                financas.m.context.message = "Homi, tu tá e devendo demais vlh. da não.\n"
                financas.m.res.json({
                    context: financas.m.context
                })
            }

        })
    },
    disponivel: () => {

        let sum = financas.DespesasTotais();

        if (sum > financas.money.receita) {
            financas.m.context.message = "bom, você ta é lascado sabe, ta devendo ->> R$ " + (sum - financas.money.receita).toFixed(2) + "\n"
            financas.m.res.json({
                context: financas.m.context
            })
        } else {
            financas.m.context.message = "bom, você tem R$ " + (financas.money.receita - sum).toFixed(2) + " de dinheiro livre. \n"
            //enviando a parada
            financas.m.res.json({
                context: financas.m.context
            })
        }

        //retrono para outras funções
        return financas.money.receita > sum ? financas.money.receita - sum : 0
    },
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

    },
    money: {        
        receita: 763,
        date: new Date(),
        despesas: [],
        despesasFixas: [],
        type: 'creditCard'        
    },
    close: () => {
        financas.m.context.message = 'Thanks man'
        financas.m.res.json({
            context: financas.m.context
        })
        financas.m = undefined
    },
    engime: {
        item_price: () => {
            let s = financas.m.context.message.split('de')
            if (s.length > 1)
                return {
                    item: s[0],
                    price: s[1].match(/[0-9].?[0-9]*.?[0-9]*/) == null ? 0 : s[1].match(/[0-9].?[0-9]*.?[0-9]*/)[0]
                }
            else
                return false

        }
    },
    helpers: {
        disponivel: "Podemos saber quanto de dinheiro você tem de modo geral",
        what: "para adicionar uma nova despesa a sua lista, e com isso gerenciar tudo de forma minusiosa",
        buy: "caso você queira comprar alguma coisa, eu posso ver se isso vai da certo ou não."
    },
    run: (m) => {
        //instanciando M
        financas.m = m
        
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