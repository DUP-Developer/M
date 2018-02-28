const app = require('express')();
const express = require('express');
const http = require('http').Server(app);
const m = require('./kernel/M')();
var bodyParser = require('body-parser')

const querystring = require('querystring'); 

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
    .all(function (req, res, next) {
        // runs for all HTTP verbs first
        // think of it as route specific middleware!
        next();
    })
    .get(function (req, res, next) {
        res.sendFile(__dirname+"/public/index.html")
        //res.json(req.user);
    })


app.route('/api/m')
    .all(function (req, res, next) {
        // runs for all HTTP verbs first
        // think of it as route specific middleware!
        next();
    })
    .get(function (req, res, next) {        
        res.json({
            context: m.model
        })        
    })
    .post((req, res, next) => {                
        m.listen(req.body.context, res)        
    })




//ouvindo os serviços
http.listen(process.env.PORT || 3001,
    () => console.log('---------------------\n\nIm listen in port 3001\n\n-------------------'));