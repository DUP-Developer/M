const app = require('express')();
const express = require('express');
const http = require('http').Server(app);
const m = require('./kernel/M');
var bodyParser = require('body-parser')

/**
 * -------------------------------
 * middware
 * -------------------------------
 * **/
// parse application/json
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

/**
 * -------------------------------
 * routes
 * -------------------------------
 * **/
app.route('/')
    .get(function (req, res, next) {
        res.sendFile(__dirname+"/public/index.html")
        //res.json(req.user);
    })


app.route('/api/m')
    .get(function (req, res) {        
        res.json({
            context: m.model
        })        
    })
    .post((req, res) => {                
        m.listen(req.body.context, res)        
    })




//ouvindo os serviços
http.listen(process.env.PORT || 3001,
    () => console.log('---------------------\n\nIm listen in port 3001\n\n-------------------'));