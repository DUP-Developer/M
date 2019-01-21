import db from '../kernel/db'

export default {
  startup(m) {
    db.createTable('animes')
  },
  // m é uma estancia do objeto de controle geral de tudo
  run(m) {
    //executando o metodo que o translator diz que é o certo
    this[m.context.module.method](m)
  },
  //terms que são necessarios par saber o que fazer depois de qeu o cliente digitou
  myTerms: [
    {
      terms: [
        'adiciona', 'adicionar', 'add', 'coloca', 'bota', 'anime', 'animes', 'lista'
      ],
      method: 'add',
      name: 'animes',
      description: 'Posso adicionar um novo anime na lista para assistir',
      found: 0
    },
    {
      terms: [
        'assisti', 'assistir', 'ver', 'episodio', 'animes', 'epsodio', 'ep', 'anime'
      ],
      method: 'ep',
      name: 'animes',
      description: 'Posso atualizar o ep do anime que vc esta assistindo',
      found: 0
    },
    {
      terms: [
        'meus', 'animes', 'anime', 'lista', 'listagem'
      ],
      method: 'list',
      name: 'animes',
      description: 'Posso listar todos os animes guardou p depois',
      found: 0
    }
  ],
  // method principal para ser executado isso aqui o modulo todo
  // metodo qualqeur que pode ser criado pelo dev
  add(m) {
    console.log(m.context);
    
    if(m.context.goBack === false) {
      //fazendo uma nova pegunta ao carinha
      db.insert('animes', {
        nome: m.context.message,
        ep: 0
      })
      m.context.message = `Pronto coloquei o ${m.context.message}`
    } else {
      m.context.message = 'Qual o nome do anime??'
      //preparando o contexto para resposta com M
      m.context.goBack = {
        module: 'animes',
        method: 'add'
      }
    }
    
    //enviando a mensagem para o cliente
    m.reply({
      context: m.context
    })
  },
  
  ep(m) {
    
  },
  
  list(m) {
    const animes = db.all('animes')
    console.log(animes);
    
    m.context.message = Array.from(animes).map(anime => `${anime.nome}, ep: ${anime.ep}\n`).join('\n')

    //enviando a mensagem para o cliente
    m.reply({
      context: m.context
    })
  }
}
