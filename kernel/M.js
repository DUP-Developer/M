
/**
-------------------------------------------------
- ENGIMEM -
-------------------------------------------------
**/

/**
constantes para definir o tipo de chamada, ou melhor classificação de tipo de
requisição de perguntas para M
**/
const COMMAND_FOR_SEARCH = 1;
const COMMAND_FOR_ASK = 2;
const COMMNAD_FOR_TIME = 3;
const COMMAND_FOR_PLACE = 4;


const engimeM = {

    phase: "",
    result: {},

    cut: () => engimeM.phase.split(' '), //quebrando a frase para analizar o que vem.
    translate: (phase) => {

        //salvando a phase
        engimeM.phase = phase;

        //verificando quem ele deve chamar inicialmente para o tratamento
        let who = engimeM.cut()

        let done = false;
        let it = 0;

        for ( let val of who) {

            if(who[0].length < 2)
            {
                val = who[0]+" "+val;

            }

            for(let object of engimeM.vocabulary)
            {
                //caso não encontra o term ele pula
                if(object.term != val){
                    it++;
                    continue;
                }


                return engimeM.getContext(engimeM.vocabulary[it], who, val);
                done=true;
                break;
            }

        }

        //fazendo busca de termos dentro de sub termos vinculados ao principal
        //busca secundaria

        //caso já tenha achado ele ignora as subpalavras
        if(!done)
        {
            for(let obj of engimeM.vocabulary)
            {
                for(let v of who)
                //buscando as subs
                if(obj.others !== undefined){
                    if(obj.others.indexOf(v) != -1)
                    return engimeM.getContext(obj, who, v);
                }

            }
        }
    },
    getContext: (obj, who, val) => {

        var index = who.indexOf(val);
        who.splice(index, 1);

        obj.arrayMessage = who;

        return obj;

    },

    vocabulary: [
        {
            "term": "oi",
            "type": "COMMAND_FOR_INTERACTION",
            "others":[
                "oier", "olá", "hello", "eaw"
            ],
            "context": false,
            arrayMessage: [],
            "message": "",
            "module": 'interaction'
        },
        {
            term: "o que",
            "type": "COMMAND_FOR_SEARCH",
            "others": [],
            "context": false,
            arrayMessage: [],
            "message": 'sei não',
            "module": 'search'
        },
        {
            term: "como",
            "tipo": "COMMAND_FOR_ASK",
            "others": [
                "porque"
            ],
            "context": false,
            arrayMessage: [],
            "message": 'sei não',
            "module":'ask'
        },
        {
            term: "quando",
            "type" : "COMMNAD_FOR_TIME",
            "others":[],
            "context": false,
            arrayMessage: [],
            "message": 'sei não',
            "module": 'time'
        },
        {
            term: "onde",
            "type" : "COMMAND_FOR_PLACE",
            "others" : [],
            "context": false,
            arrayMessage: [],
            "message": 'sei não',
            "module": 'place'
        }
    ]
}


/**
-------------------------------------------------
- DB -
-------------------------------------------------
**/
const db = {
    dbName: 'M',
    r: null,
    instance: null,
    //sington para instaciar o banco de dados
    hasConnection: () => {
        if(!db.instance)
            db.instance = db.connection()

        return db.instance
    },
    //criando a conexão com o banco de dados
    connection: () => {
        //reqeureindo lib
        var r = require('rethinkdb');

        db.r = r;

        //retornando a conexão com o banco de dados rethinkdb
        return r.connect( {host: 'localhost', port: 28015, db: db.dbName})
    },
    //criando tabelas dado o nome da tabela
    createTable: (table) => {
        db.hasConnection().then( (conn) => {
            db.r.tableCreate(table).run(conn, (error, result) => {
                console.log(result);
            });
        })
    },
    //listando todas as tableas para informação
    listTable: () => {
        db.hasConnection().then( (conn) => {
            db.r.tableList().run(conn, (error, result) => {
                console.log(result);
            });
        })
    },
    //inserindo dados no banco dados table e json
    insert: (table, json) => {
        db.hasConnection().then( (conn) => {
            db.r.table(table).insert(json).run(conn, (error, result) => {
                console.log(result);
            });
        })
    },
    //atualiza todo o objeto dado a table, id e json que sera a nova versão do objeto
    update: (table, id, json) => {
        db.hasConnection().then( (conn) => {
            db.r.table(table).get(id).update(json).run(conn, (error, result) => {
                console.log(result);
            });
        })
    },
    //deleta item por id
    delete: (table, id) => {
        db.hasConnection().then( (conn) => {
            db.r.table(table).get(id).delete().run(conn, (error, result) => {
                console.log(result);
            });
        })
    },
    //busca por alguma coisa pelo id
    find: (table, id) => {
        db.hasConnection().then( (conn) => {
            db.r.table(table).get(id).run(conn, (error, result) => {

                // result

            });
        })
    },
    //busca especifica por alguma coisa  {key: val}
    search: (table, json) => {
        db.hasConnection().then( (conn) => {
            db.r.table(table).filter(json).run(conn, (error, cursor) => {
                cursor.toArray().then(function(results) {

                    // (results);

                }).error(console.log);
            });
        })
    },
    //buscar todos os elementos de uma tabela
    all: (table) => {
        db.hasConnection().then( (conn) => {
            db.r.table(table).run(conn, (error, cursor) => {
                cursor.toArray().then(function(results) {

                    console.dir(results);

                }).error(console.log);
            });
        })
    },

}

/**
-------------------------------------------------
- SOCKET.IO -
-------------------------------------------------
**/
const socket = {
    instance: null,

    hasSocket: (http) => { //preparando socket
        if(!socket.instance)
            socket.instance = require('socket.io')(http);
    },
    events: (http) => {
        socket.hasSocket(http);

        // ON CONNECT

        //pegando quando um cliente se conecta e salva num array de clientes conectados ao sistema M
        socket.instance.on('connection', (s) => {
            //verificando quem esta conectado
            console.log('user connected')
            socket.clients.push(s)
        })


        // ON DISCONNECT

        //removendo cliente
        socket.instance.on('disconnect', (s) => {
            //verificando quem esta conectado
            console.log('user disconnected')
            socket.clients.splice(socket.clients.indexOf(s), 1)
        })

    },
    clients: [],
    emit: (eventM, object) => {
        socket.instance.emit(eventM, object);
    }
}
/**
-------------------------------------------------
- PUNCHM -
-------------------------------------------------
**/
const punchM = {
    run: (result, context) => {
        //caso não venha nada ele já responde ao carinha
        if(!result) {
            context.socketManager.emit("event-error", {type:'error', message:'Não entendi.'});
            return;
        }

        //caso ela saiba o que vc disse ela vai chamar a letter responsavel por tratar o que vc quer
        let resultM = require('../letters/' + result.module);

        //com base na traduçaõ descobre quem deve resolver o que o cliente esta falando
        return resultM.run(result, context)

    }
}

//criando o objeto de m
// e instanciando todas os objetos para rodar M
function M () {

    //messagens enviadas para o server
    this.messege = ""

    //configuração ee. ações do banco de dados
    this.db = ""

    //configuração e ações de socket
    this.socketManager = socket

    //configuração e ações para chamadas de libs externas
    this.forward = punchM

    //configuração e ações para treduzir o que cliente esta falando
    this.engime = engimeM


    //ouvindo
    this.listen = (http, message) => {
        this.message = message

        //dando inicio aos listners do socket
        this.socketManager.events(http);

        //vendo o que foi falado
        let what = this.engime.translate(message);
        //vendo quem vai ser chamado
        this.forward.run(what, this);

    }


}


module.exports = new M()
