'use strict';

const express = require('express');
const app = new express();
const R = express.Router();
const http = require('http').Server(app);
const io = require('socket.io')(http)
const m = require('./kernel/M');

/**
 * -------------------------------
 * middware
 * -------------------------------
 * **/

 //permitindo qeu adicione stilos e js
R.use(express.static(__dirname + '/public'));

//caso seja requisitado uma pagina que não é a que desejo apresentar
R.use((req, res, next) => {
    res.status(404).json({
        type: 'error',
        message: 'page not found.'
    });
})



//quando acessado / ele mostra a cara de M
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});




// chamadas por socket.io
io.on('connection', (socket) => {
    //verificando quem esta conectado
    console.log('user connected: ' + socket.id)


    let M = m(socket)

    //    request of the client
    socket.on('event-req', (data) => {
        M.listen(data.message)
    })


    socket.on('disconnection', (s) => {
        //verificando quem esta conectado
        console.log('user exit: ' + s.id)
    })

})

//ouvindo os serviços
http.listen(process.env.PORT || 3001, () => console.log('---------------------\n\nIm listen in port 3001\n\n-------------------'));
