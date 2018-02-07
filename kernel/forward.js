/**
-------------------------------------------------
- PUNCHM -
-------------------------------------------------
**/
const forward = {
    run: (m) => {

        //caso não venha nada ele já responde ao carinha
        if(m.context.module.name == "" || !m.context.module) {
            
            m.context.write('Não entendi.')
            
            m.socketManager.emit(m.context);
            
            return;
        }

        //caso ela saiba o que vc disse ela vai chamar a letter responsavel por tratar o que vc quer
        let resultM = require('../letters/' + m.context.module.name);

        //com base na traduçaõ descobre quem deve resolver o que o cliente esta falando
        return resultM.run(m)

    }
}

module.exports = forward
