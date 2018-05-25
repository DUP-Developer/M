const https = require('https');
const _ = require('lodash');
const htmlToJson = require('html-to-json');


const mining = {
  prepare(data) {
    var promise = htmlToJson.parse(data, function() {
       return this.map('p', function ($item) {
         return $item.text();
       });      
    }, function (err, result) {
      if (err) console.log('problems');
      
      console.log(result);      
    });
  },
  request(url) {
    https.get(url, (resp) => { 
      let data = '';

        // A chunk of data has been recieved.
       
      resp.on('data', (chunk) => {  
        data += chunk; 
      });

        // The whole response has been received. Print out the result.
       
      resp.on('end', () => {  
        mining.prepare(data)
        // console.log(JSON.parse(data).explanation); 
      });

    }).on("error", (err) => { 
      console.log("Error: " + err.message);
    });
  }
}


mining.request('https://www.dicio.com.br/chata/')