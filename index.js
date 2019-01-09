import express from 'express'
import Http from 'http'
import m from './kernel/M'
import bodyParser from 'body-parser'
import TelegramBot from './plugin/telegram'


const app = express()
const http = Http.Server(app)
/**
 * -------------------------------
 * middware
 * -------------------------------
 * **/
// parse application/json
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static('public'));

/**
 * -------------------------------
 * routes
 * -------------------------------
 * **/
app.route('/')
  .get(function (req, res, next) {
    res.sendFile(__dirname + "/public/index.html")
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



/**
 * start telegram plugin
 */
TelegramBot.start(m)

//ouvindo os serviços
http.listen(process.env.PORT || 3001,
  () => console.log('---------------------\n\nIm listen in port 3001\n\n-------------------'));