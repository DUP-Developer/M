const db = require('./db')
const _ = require('lodash')
const synaptic = require('synaptic'); // this line is not needed in the browser
const Logs = require('./log')
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
  // tree of the terms e acçções with base
  treeWords: new Map(),
  /**
   * Training M with my terms
   * in memory
   */
  trainning() {
    if (!this.hopfield) {
      this.hopfield = new Architect.Hopfield(SIZE_WORD) // create a network for 10-bit patterns
    }
    
    //todos os registros de funções que vem do db
    var registerFuncs = db.all('terms')

    const termsLearn = []

    registerFuncs.map(obj => {
      obj.terms.map(word => {                
        const encodedBinary = this.encodedBinary(word)

        termsLearn.push(encodedBinary)
        this.treeWords.set(encodedBinary.join(''), obj)        
      })
    })

    // teach the network two different patterns
    this.hopfield.learn(termsLearn)
  },

  // phase: any text that user talking with M
  moduleTranslator(m) {
    this.trainning()
    
    let myTerms = m.context.arrayMessage.map(message => {      
      return this.hopfield.feed(this.encodedBinary(message)) // [0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
    }).map(term => {
      return this.treeWords.get(term.join(''))
    })
    
    // console.log(myTerms);
    
    /**
     * pegando o termo com mais ocorrencia
     * na pesquisa
     */    
    myTerms = _.max(myTerms.map((mt, i) => {
      if (mt) {        
        mt.found = myTerms.filter(mft => mft === mt).length
        return mt
      }
    }), 'found')
    
    // middleware de report de atividades
    // Logs.report('engime.js:75', myTerms)

    if (myTerms){
      m.context.module = myTerms
    } else {
      m.context.module = engime.statistics
    }

    return m.context
  },

  /**
   * encoded the word in binary
   * @param {String} word 
   */
  encodedBinary(word) {
    const binarys = []

    word.split('').map(word => {
      const binary = word.charCodeAt(0).toString(2)      
      binary.split('').forEach(b => {
        binarys.push(parseInt(b))
      })            
    })
    
    
    // preenchendo com zeros
    if (binarys.length < SIZE_WORD) {
      const size = SIZE_WORD - binarys.length
      
      for (let i = 0; i < size; i++) {
        binarys.unshift(0)
      }
    }
    
    return binarys
  }
}


module.exports = engime