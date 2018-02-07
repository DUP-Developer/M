const db = require('./db')
/**
-------------------------------------------------
- ENGIMEM -
-------------------------------------------------
**/

const engime = {

    phase: "",
    result: {},

    cut: () => engime.phase.split(' '), //quebrando a frase para analizar o que vem.
    getContext: (obj, who, val) => {

        var index = who.indexOf(val);
        who.splice(index, 1);

        obj.arrayMessage = who;

        return obj;

    },
    /**
    esse é um tradutar de modulo, é que traduz que metodo do module ele vai rodar, deacordo com as informaões
    passadas pelo cliente "phase" <- texto que o cliente escreve.
    **/
    statistics: {
        name: '',
        method: "",
        foundCount: 0,
        porcentError: 0
    },
    //need
    //the 'registerFuncs' and 'phase'
    //
    // exemple:
    //
    // let registerFuncs = {
    //     {
    //         terms : [
    //             "comprei", 'dinheiro', 'money', 'bufunfa', 'grana', "você"
    //         ],
    //         method: 'money',
    //         name: '',
    //         found: []
    //     }
    // };
    //
    // phase: any text that user talking with M
    moduleTranslator: (m) => {

        //        caso ele seja uma resposta de alguma coisa ele pegfa o que veio
        //        nomoduleReturn e manda para module para ser executado
       
        //para linpar a campo
        m.context.module = engime.statistics

        //indentificando cada palavra da frase com as coisas no registro do modulo(letters) e alencando algumas propriedades
        for (let w = 0; w < m.context.arrayMessage.length; w++) {
            for (var it in engime.registerFuncs) {
                for (var wg of engime.registerFuncs[it].terms) {
                    if (wg == m.context.arrayMessage[w]) {
                        engime.registerFuncs[it].found++
                    }
                }
            }
        }

        //pegando as porcentages de encontrados para tirar a margem de erro
        let totalFound = 0;
        //somando todas as palavras encontradas para todos os modulos e com isso ter a base para tirar a porcentagemde error
        for (let stt in engime.registerFuncs) {
            totalFound += engime.registerFuncs[stt].found
        }
        //aqui estamos validando as informações para retornar qual é o metodo mais possivel de ser executado
        for (let stt in engime.registerFuncs) {
            if (engime.registerFuncs[stt].found > engime.statistics.foundCount) {
                engime.statistics.foundCount = engime.registerFuncs[stt].found
                engime.statistics.method = engime.registerFuncs[stt].method
                engime.statistics.name = engime.registerFuncs[stt].name
                engime.statistics.porcentError = (engime.registerFuncs[stt].found / totalFound) - 1
            }
        }

        m.context.module = engime.statistics
    },
    registerFuncs: db.all('terms'),
}


module.exports = engime
