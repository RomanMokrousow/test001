var OldConsole = window.console;

class TLocalConsole extends OldConsole.constructor{
  constructor(){
    super();
  }

  _log(...arr){
    //let s = 'ERROR' + arr.join("\n"); 
    //alert(s);
    //let m = document.createElement('div');m.innerText = s;document.body.appendChild(m);
    OldConsole.log('From local console>> ',...arr)
  }

  warn = this._log;
  info = this._log;
  log = this._log;
  debug = this._log;
  exception = this._log;

  error(...arr){
    alert('ERROR' + arr.join("\n"));
    OldConsole.error('From local console>> ',...arr)
  }


}

window.console = new TLocalConsole();
//console.log(OldConsole);
