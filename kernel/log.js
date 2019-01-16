/**
 * essa calsse é para facilitar o log
 * 
 * recebe dois parametros , o label e o que vc quer apresentar
 * **/

class Logs {
  pull(label, obj) {
    console.log(`------------- ${label} -----------------------\n'`);
    console.log(obj);
    console.log('\n----------------------------------------------------------\n');
  }

  report(location, data) {
    this.pull(location, data)
    // console.log(location, data);
  }
}

module.exports = new Logs()