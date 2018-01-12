
/**
------------------------------------------------
Meu money
------------------------------------------------
**/
const financas = {
    termsPositives: ["sim", "tem", "quero"],
    termsNegatives: ["não", "vlw", "de boas"],
    context: {},
    what: () => {
        financas.context.socketManager.question({message: "O que foi que vc comprou? \n"}, (answer) => {
            financas.money.creditCard.nameDespesas.push(answer)
            financas.howMuch()
        })

    },
    howMuch: () => {
        financas.context.socketManager.question({message: "É quanto foi isso?? \n"}, (answer) => {
            financas.money.creditCard.despesas.push(parseFloat(answer.replace(',', '.')))
            financas.again()
        })

    },
    again: () => {
        financas.context.socketManager.question({message: "tem mais coisas? \n"}, (signal) => {
            if(financas.termsPositives.indexOf(signal) != -1)
                financas.what()
            else if(financas.termsNegatives.indexOf(signal) != -1)
            {
                financas.extrato()
                financas.close()

            }
            else
            {
                financas.context.socketManager.write("Não entendi.")
                financas.again()
            }

        })
    },
    extrato: () => {
        let sum=0;

        financas.context.socketManager.write({message: `Data: ${financas.money.creditCard.date} \n`})


        //Despesas avulsas
        financas.context.socketManager.write({message: "\n - Despesas Avulsas - \n\n"})

        for(let it in financas.money.creditCard.despesas)
        {
            // aqui fica a parte de retorno para o cliente
            financas.context.socketManager.write({message:"Item: " + financas.money.creditCard.nameDespesas[it] + " - R$ |" + financas.money.creditCard.despesas[it] + "| \n"})
            sum += financas.money.creditCard.despesas[it]
        }

        //despesas fixas

        financas.context.socketManager.write({message:"\n - Despesas Fixas - \n\n"})

        for(let it in financas.money.creditCard.despesasFixas)
        {
            // aqui fica a parte de retorno para o cliente
            financas.context.socketManager.write({message:"Item: " + financas.money.creditCard.nameDespesasFixas[it] + " - R$ |" + financas.money.creditCard.despesasFixas[it] + "| \n"})
            sum += financas.money.creditCard.despesasFixas[it]
        }


        //resumo de total de gastos
        financas.context.socketManager.write({message:"\n\n - Total de gastos: R$ " + sum + " - \n\n"})

    },
    buy: () => {
        financas.context.socketManager.question({message: 'Quanto é a parada? \n'}, (answer) => {
            var valorNovaAquisicao = parseFloat(answer.replace(',', '.'))

            if( financas.money.creditCard.receita > financas.money.DespesasTotais() )
                if( (financas.money.creditCard.receita - financas.money.DespesasTotais()) > valorNovaAquisicao )
                    financas.context.socketManager.write({message:"Da para comprar sim, e ainda sobra R$ " + ((financas.money.creditCard.receita - financas.money.DespesasTotais()) - valorNovaAquisicao).toFixed(2) + "\n"})
                else
                    financas.context.socketManager.write({message:"Da não vicc, é caro só temos R$ " + ((financas.money.creditCard.receita - financas.money.DespesasTotais())).toFixed(2) + "\n"})
            else
                financas.context.socketManager.write({message: "Homi, tu tá e devendo demais vlh. da não.\n"})
        })
    },
    disponivel: () => {
        let sum = financas.money.DespesasTotais();

        if(sum > financas.money.creditCard.receita)
            financas.context.socketManager.write({message:"bom, você ta é lascado sabe, ta devendo ->> R$ " + (sum - financas.money.creditCard.receita) + "\n"})
        else
            financas.context.socketManager.write({message:"bom, você tem R$ " + (financas.money.creditCard.receita - sum).toFixed(2) + " de dinheiro livre. \n"})

        //retrono para outras funções
        return financas.money.creditCard.receita > sum ? financas.money.creditCard.receita - sum : 0
    },
    money:{
        message:'Bom...',
        creditCard:{ // esse objheto será pego do banco de adados onde será objetos são enseridos por datas
            date: new Date(),
            receita: 710,
            despesas: [20,22,14,56,635],
            nameDespesas: ["um açai", "comida boa", "sei lá", "bom demais", "cuzcuz"],
            despesasFixas: [23.56, 29.88],
            nameDespesasFixas: ["nextflix", "x360"]
        },
        DespesasTotais: () => {
            var sum = 0;
            //despesas avulsas
            for(let it in financas.money.creditCard.despesas)
                sum += parseFloat(financas.money.creditCard.despesas[it]);
            //despesas fixas
            for(let it in financas.money.creditCard.despesasFixas)
                sum += parseFloat(financas.money.creditCard.despesasFixas[it]);

            return sum

        }
    },
    close: () => {
        financas.context = false
        financas.context.socketManager.write("Certo.")
    },
    run: (m) => {
        financas.context = m
        // console.log(m.context.module);
        //executando o metodo que o translator diz que é o certo
        financas[m.context.module.method]()
    },
    myTerms:[
        {
            terms : [
                "dinheiro", 'posso', 'gastar', 'tenho', 'quanto'
            ],
            method: 'disponivel',
            name: 'financas',
            found: 0
        },
        {
            terms : [
                "comprei", 'parada', 'uma', 'negocio'
            ],
            method: 'what',
            name: 'financas',
            found: 0
        }
    ]
}

module.exports = financas;
