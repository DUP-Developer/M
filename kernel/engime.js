const db = require('./db')
const _ = require('lodash')
const synaptic = require('synaptic'); // this line is not needed in the browser

const Architect = synaptic.Architect;
const SIZE_WORD = 12 * 7 // onde 7 é a quantidade de bits para uma palavra

const engime = {
  phase: "",
  result: {},
  hopfield: null,
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
  trainning() {
    if (!this.hopfield) {
      this.hopfield = new Architect.Hopfield(SIZE_WORD) // create a network for 10-bit patterns
    }
    
    const termsLearn = []

    //todos os registros de funções que vem do db
    var registerFuncs = Object.values(db.all('terms'))

    registerFuncs.map(obj => {
      obj.terms.map(word => {        
        termsLearn.push(this.decodedBinary(word))
      })
    })
    
    // teach the network two different patterns
    this.hopfield.learn(termsLearn)
  },

  // phase: any text that user talking with M
  moduleTranslator(m) {
    this.trainning()
    //todos os registros de funções que vem do db
    var registerFuncs = Object.values(db.all('terms'))

    console.log(m.context.arrayMessage.map(message => {
      return this.hopfield.feed(this.decodedBinary(message)) // [0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
    }))

    /**
     * old select
     */
    var mc = []

    _.forEach(registerFuncs, (o) => {
      let im = _.intersectionWith(m.context.arrayMessage, o.terms, _.isEqual)

      if (!_.isEmpty(im))
        mc.push({
          name: o.name,
          method: o.method,
          count: im.length
        })

    })

    if (_.isEmpty(mc))
      m.context.module = engime.statistics
    else {
      let module = _.maxBy(mc, o => o.count)
      m.context.module = module
    }

    return m.context
  },

  decodedBinary(word) {
    const binarys = []

    word.split('').map(word => {
      const binary = word.charCodeAt(0).toString(2)
      binary.split('').forEach(b => {
        binarys.push(b)
      })            
    })
    
    // preenchendo com zeros
    if (binarys.length < SIZE_WORD) {
      const size = SIZE_WORD - binarys.length

      for (let i = 0; i < size; i++) {
        binarys.unshift('0')
      }
    }
    
    return binarys
  }
}


module.exports = engime