const app = require('express')();
const http = require('http').Server(app);
const m = require('./kernel/M');

//API requests
app.get('/m/', (req, res) => {
    //traduzindo o que o carinha ta falando
    m.listen(http, req.query.message)
})

//quando acessado / ele mostra a cara de M
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

//middware
app.use((req, res, next) => {
    res.status(404).send("I'm sorry, not know ^~^");
})

//ouvindo os serviços
http.listen(process.env.PORT || 8080, () => console.log('Im listen... man!!!'));
