var fs = require('fs');

fs.open('https://stackoverflow.com/questions/14552638/read-remote-file-with-node-js-http-get','r' ,function (error, body) {
    console.log(body);

});

const spider = {
    searchLink: (link) => {

    },
    myTerms:[
        {
            terms : [
                "busca", 'procura', 'la', 'da', 'sacada', "vai"
            ],
            method: 'searchLink',
            name: 'spider',
            found: 0
        }
    ]

}
