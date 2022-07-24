import * as common from '../common.js';
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

function getPromiseFromEvent(Item, Event, Timeout) {
  return new Promise((Resolve,Reject) => {
    const Listener = () => {
      Item.removeEventListener(Event, Listener);
      Resolve();
    }
    Item.addEventListener(Event, Listener);
  })
}

export class TApplication{
  constructor(){
    this._MainElement = document.createElement('div');this._MainElement.setAttribute('class','Application-MainElement');
    this._Ready = false;
    this._Styles = [];
  }

  async isReady(Timeout){
    if (this._Ready){return}
    await getPromiseFromEvent(this._MainElement,'ApplicationIsReady',Timeout);
  }

  getElement(){
    return this._MainElement;
  }
}

class TAppFrame{
  constructor(){
    this.init();
  }

  async init(){
    //Options.setString('BackgroundColor','abrakadabra');
    //options.save();
    //console.log(Options.getString('BackgroundColor'));
    this.Applications = [];
    this.TemplateLib = await common.loadElementFrom(ThisModuleBaseURL + '/tmplAppFrame.html');
    this.DocBody = document.body;
    this.DocHeader = this.TemplateLib.querySelector('#tmplAppFrame-Header').cloneNode(true);
    this.DocHeader.setAttribute('class','clsAppFrame-Header');
      this.DocHeader.setAttribute('id','AppFrame-Header');
      this.DocBody.appendChild(this.DocHeader);
    this.DocMain = document.createElement('main');this.DocBody.appendChild(this.DocMain);
    this.addAction('AppFrame-FrameActions','Add application',this.ActionHandler_AddApplication.bind(this));
  }

  ActionHandler_SelectApplication(e){
    let App = this.Applications[e.target.getAttribute('name')];
    if((App == undefined) || (!(App instanceof TApplication))){alert('ERROR: wrong Aplication');return}
    common.clearNode(this.DocMain);
    this.DocMain.appendChild(App.getElement());
  }

  async ActionHandler_AddApplication(e){
    let AppName = prompt('Enter application name');
    if(this.Applications[AppName] == undefined){
      let Module = await import('../' + AppName + '/' + AppName + '.js');
console.log(Module);
      this.Applications[AppName] = Module.create();
    }
    this.addAction('AppFrame-ApplicationList',AppName,this.ActionHandler_SelectApplication.bind(this));
  }

  addAction(ParentClass,Name,Handler){
    let Parent = this.DocHeader.querySelector('.' + ParentClass);
    let Button = document.createElement('button');
    Button.addEventListener('click',Handler);
    Button.setAttribute('name',Name)
    Button.innerText = Name;
    Parent.appendChild(Button)
  }

}

await doOnWindowLoad();