'use strict';

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http)
const m = require('./kernel/M')(io);
const m_socket = require('./kernel/socket')

//API requests
app.get('/m/', (req, res) => {
    //traduzindo o que o carinha ta falando
    m.listen(req.query.message, req.query.id)
})

//quando acessado / ele mostra a cara de M
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

//middware
app.use((req, res, next) => {
    res.status(404).send("I'm sorry, not know ^~^");
})

io.on('connection', (s) => {
    //verificando quem esta conectado
    console.log('user connected: '+s.id)

    // definindo o clinete pra o socket
    m.socketManager.clients[s.id] = m_socket(s)

})

io.on('disconnection', (s) => {
    //verificando quem esta conectado
    console.log('user exit: '+s.id)

    // removndo o cliente que saiu da lista
    delete m.socketManager.clients[s.id]

})

//ouvindo os serviços
http.listen(process.env.PORT || 3001, () => console.log('Im listen... man!!!'));
