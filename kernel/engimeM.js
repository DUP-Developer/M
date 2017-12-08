
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
    what: (phase, callback) => {

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


                callback(engimeM.getContext(engimeM.vocabulary[it], who, val));
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
                    callback(engimeM.getContext(obj, who, v))
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

module.exports = engimeM;
