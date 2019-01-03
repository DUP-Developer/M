const db = require('./db')
const _ = require('lodash')

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
const engime = {
  phase: "",
  result: {},
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
  // phase: any text that user talking with M
  moduleTranslator(m) {

    //todos os registros de funções que vem do db
    var registerFuncs = Object.values(db.all('terms'))

    var mc = []

    _.forEach(registerFuncs, (o) => {
      let im = _.intersectionWith(m.context.arrayMessage, o.terms, _.isEqual)

      if (!_.isEmpty(im))
        mc.push({ name: o.name, method: o.method, count: im.length })

    })

    if (_.isEmpty(mc))
      m.context.module = engime.statistics
    else {
      let module = _.maxBy(mc, o => o.count)
      m.context.module = module
    }

    return m.context
  }
}


module.exports = engime