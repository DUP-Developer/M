export default {
  run(m) {
    this[m.context.module.method](m)
  },
  myTerms: [{
    terms: [
      'salva', 'link', "para", "mim", "guarda"
    ],
    method: 'save',
    name: 'links',
    found: 0
  }],
  save(link) {

  }
}