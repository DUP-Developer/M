import _ from 'lodash'
import moment from 'moment'

export default {
  startup(m){},
  run(m) {
    //executando o metodo que o translator diz que é o certo
    this[m.context.module.method](m)
  },
  myTerms: [{
      terms: [
        'dinheiro', 'posso', 'gastar', 'tenho', 'quanto'
      ],
      method: 'buy',
      name: 'financas',
      description: 'Posso mostrar quanto de dinheiro disponivel você possui.',
      found: 0
    },
    {
      terms: [
        'comprei', 'parada', 'uma', 'negocio'
      ],
      method: 'what',
      name: 'financas',
      description: 'Posso guardar seus gastos para ter um comtrole melhor.',
      found: 0
    },
    {
      terms: [
        'extrato', 'meu', 'contas', 'mes'
      ],
      method: 'extrato',
      description: 'Posso mostrar seu extrato de gastos.',
      name: 'financas',
      found: 0
    }    
  ],
  termsPositives: ['sim', 'tem', 'quero'],
  termsNegatives: ['não', 'vlw', 'de boas'],
  itemWait: {}, // item que fica aguardando um valor chegar informado pelo cliente
  what(m) {
    m.context.message = 'O que foi que vc comprou?'

    m.context.goBack = {
      module: 'financas',
      method: 'howMuch'
    }

    m.reply({
      context: m.context
    })
  },

  howMuch(m) {
    let newItem = this.engime.item_price(m)

    if (newItem) {
      this.money.despesas.push(newItem)
      this.again(m)
    } else {
      //adicionando o item para ser oppulado na proxima execução
      this.itemWait = {
        item: m.context.message,
        price: 0.0
      }

      //fazendo uma nova pegunta ao carinha
      m.context.message = 'É quanto foi isso?? '

      //preparando o contexto para resposta com M
      m.context.goBack = {
        module: 'financas',
        method: 'again'
      }

      //enviando a mensagem para o cliente
      m.reply({
        context: m.context
      })
    }

  },
  again(m) {
    //caso o itemWait esteja esperando o preço a ser adicionado ele verifica isso
    if (!_.isEmpty(this.itemWait)) {
      //pegando do contexto o valor do intem informado pelo usuario
      this.itemWait.price = parseFloat(m.context.message)

      //adicionando a nova despesa
      this.money.despesas.push(this.itemWait)

      //limpando o item para futuros usos
      this.itemWait = {}
    }

    /**
     * ---------------------------------------------------
     * TESTANDO SE O USER QUER ADICIONAR MAIS COISAS
     * ---------------------------------------------------
     * **/
    
    //caso tenha um novo item para adicionar
    if (this.termsPositives.indexOf(m.context.message.toLowerCase()) != -1)
      this.what(m)
    //caso não tenha mais nada, ele finaliza e da um extrato
    else if (this.termsNegatives.indexOf(m.context.message.toLowerCase()) != -1) {
      this.extrato(m)
      m.context.message = 'Thanks man'
      m.reply({
        context: m.context
      })
      m = undefined
    }

    /**
     * ---------------------------------------------------
     * PERGUNTANDO SE O USER QUER ADICIONAR MAIS COISAS
     * ---------------------------------------------------
     * **/

    //caso ainda exista instancia de M aqui ele vai continuar perguntando, caso tenha sido undefinid ela não pergunta mais
    if (!_.isUndefined(m)) {
      m.context.message = 'tem mais coisas?'

      m.context.goBack = {
        module: 'financas',
        method: 'again'
      }

      m.reply({
        context: m.context
      })
    }
  },
  extrato(m) {
    let sum = 0,
      message = '';

    message = `Data: ${moment(this.money.date).format('DD/MM/YYYY')} \n`

    /**
     * -----------------------------------------------------
     *                 DESPESAS AVULSAS
     * -----------------------------------------------------
     * **/

    //        m.context.write('\n - Despesas Avulsas - \n\n')
    //        m.reply(m.context)

    // iterando para poder pegar toda as despesas
    _.forEach(this.money.despesas, (o) => {
      message += `Item: ${o.item} - R$ ${o.price} \n`
      sum += o.price
    })

    /**
     * -----------------------------------------------------
     *                 DESPESAS FIXAS
     * -----------------------------------------------------
     * **/

    message += '\n - Despesas Fixas - \n\n'
        
    this.money.despesasFixas.forEach(o => {
      message += `Item: ${o.item} - R$ ${o.price} \n`
      sum += o.price
    })

    //resumo de total de gastos
    message += `\n\n Total de gastos: R$ ${sum} \n\n`

    //enviando para o cliente as informações
    m.context.message = message

    m.reply({
      context: m.context
    })
  },

  buy(m) {
    m.socketManager.question({
      message: 'Quanto é a parada? \n'
    }, (answer) => {
      var valorNovaAquisicao = parseFloat(answer.replace(',', '.'))

      if (this.money.receita > this.DespesasTotais()) {
        if ((this.money.receita - this.DespesasTotais()) > valorNovaAquisicao) {
          m.context.message = 'Da para comprar sim, e ainda sobra R$ ' + ((this.money.receita - this.DespesasTotais()) - valorNovaAquisicao).toFixed(2) + '\n'

          m.reply({
            context: m.context
          })
        } else {
          m.context.message = 'Da não vicc, é caro só temos R$ ' + ((this.money.receita - this.DespesasTotais())).toFixed(2) + '\n'
          m.reply({
            context: m.context
          })
        }
      } else {
        m.context.message = 'Homi, tu tá e devendo demais vlh. da não.\n'
        m.reply({
          context: m.context
        })
      }

    })
  },
  disponivel(m) {
    let sum = this.DespesasTotais();

    if (sum > this.money.receita) {
      m.context.message = 'bom, você ta é lascado sabe, ta devendo ->> R$ ' + (sum - this.money.receita).toFixed(2) + '\n'
      m.reply({
        context: m.context
      })
    } else {
      m.context.message = 'bom, você tem R$ ' + (this.money.receita - sum).toFixed(2) + ' de dinheiro livre. \n'
      //enviando a parada
      m.reply({
        context: m.context
      })
    }

    //retrono para outras funções
    return this.money.receita > sum ? this.money.receita - sum : 0
  },
  DespesasTotais() {
    var sum = 0;
    //despesas avulsas
    //            console.log(this.money.despesas)


    for (let it in this.money.despesas)
      sum += parseFloat(this.money.despesas[it]);
    //despesas fixas
    for (let it in this.money.despesasFixas)
      sum += parseFloat(this.money.despesasFixas[it]);

    return sum
  },

  money: {
    receita: 763,
    date: new Date(),
    despesas: [],
    despesasFixas: [],
    type: 'creditCard'
  },
  engime: {
    item_price(m) {
      let s = m.context.message.split('de')
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
    disponivel: 'Podemos saber quanto de dinheiro você tem de modo geral',
    what: 'para adicionar uma nova despesa a sua lista, e com isso gerenciar tudo de forma minusiosa',
    buy: 'caso você queira comprar alguma coisa, eu posso ver se isso vai da certo ou não.'
  }
}