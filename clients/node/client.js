var readline = require('readline')
const axios = require('axios')
var cowsay = require("cowsay");


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let uri = "http://localhost:3001/api/m";
let context;

rl.write("-----------------------------------------------\n")
rl.write("-----------------------------------------------\n")
rl.write("--------------- WELCOME TO M ------------------\n")
rl.write("-----------------------------------------------\n")
rl.write("-----------------------------------------------\n\n")


//pausando para que o server retorne com o model de context
rl.pause()


//fazendo chamada inicial para pegar o model de context
axios.get(uri)
  .then(function (response) {
    context = response.data.context
    rl.resume()
  })
  .catch(function (error) {
    console.log(cowsay.say({
      text: `----- ${error} ------`,
      e: "xX",
      T: "U "
    }));
    rl.close();
  });

//rl.setPrompt('You: ');
rl.prompt();

rl.on('line', function (line) {
  switch (line.trim()) {
    case '!context':
      console.log(context);
      break;
    default:
      context.message = line.trim()

      //enviando para o server
      axios.post(uri, {
          context
        })
        .then(function (response) {
          console.log('M: ' + response.data.context.message + '');

          context = response.data.context
        })
        .catch(function (error) {
          console.log(`\nM: ${error}`);
          rl.close();
        });
      break;
  }
  rl.prompt();
}).on('close', function () {
  cowsay.say({
    text: "----- flw ------",
    e: "_-",
    T: "I "
  });

  process.exit(0);
});
