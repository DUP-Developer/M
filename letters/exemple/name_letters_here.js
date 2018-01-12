const name_module = {
    //metodo qualqeur que pode ser criado pelo dev
    method: (link) => {

    },
    // method principal para ser executado isso aqui o modulo todo
    // m é uma estancia do objeto de controle geral de tudo
    run: (m) => {
        interaction.context = m
        //executando o metodo que o translator diz que é o certo
        interaction[m.context.module.method]()
    },
    //terms que são necessarios par saber o que fazer depois de qeu o cliente digitou
    myTerms:[
        {
            terms : [
                'salva', 'link', "para", "mim", "guarda"
            ],
            method: 'save',
            name: 'links',
            found: 0
        }
    ]
}
module.exports = links
