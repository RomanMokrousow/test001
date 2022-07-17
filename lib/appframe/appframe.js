import * as options from '../options/options.js';

const OptionsStruct = {
  BackgroundColor: {
    DataType: 'TdtString'
  }
}
const Options = options.getConnection('Module-AppFrame',OptionsStruct);
const ThisModuleBaseURL = import.meta.url.split('/').slice(0,-1).join('/');

async function doOnWindowLoad(e){
  document.AppFrame = new TAppFrame();
}

class TAppFrame{
  constructor(){
    this.init();
  }

  async init(){
    //Options.setString('BackgroundColor','abrakadabra');
    //options.save();
    console.log(Options.getString('BackgroundColor'));
    this.TemplateLib = await loadElementFrom(ThisModuleBaseURL + '/tmplAppFrame.html');
    this.DocBody = document.body;
    this.DocHeader = this.TemplateLib.querySelector('#tmplAppFrame-Header').cloneNode(true);
      this.DocHeader.setAttribute('class','clsAppFrame-Header');
      this.DocHeader.setAttribute('id','AppFrame-Header');
      this.DocBody.appendChild(this.DocHeader);
    this.DocMain = document.createElement('main');this.DocBody.appendChild(this.DocMain);
  }
}


async function loadElementFrom(path){
  let resp = await fetch(path);
  if(!resp.ok){
    console.log(resp);
  }else{
    let text = await resp.text();
    let Result = document.createElement('div');
    Result.innerHTML = text;
    return Result;
  }
}

await doOnWindowLoad();