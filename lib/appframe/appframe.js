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
    this._MainElement = common.createElement('div',"",null,{'class': 'Application-MainElement'});
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

  hide(){
    this._MainElement.remove();
    for(const Item of this._Styles){Item.remove()}
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
    this.DocHead = document.head;
    this.DocBody = document.body;
    this.Applications = [];
    this.Styles = [];
    this.Styles.push(common.createElement('link','AppFrame_Styles_Base',this.DocHead,{rel: "stylesheet", href: ThisModuleBaseURL + "/appframe.css"}))
    this.TemplateLib = await common.loadElementFrom(ThisModuleBaseURL + '/tmplAppFrame.html');
    this.DocHeader = this.TemplateLib.querySelector('#tmplAppFrame-Header').cloneNode(true);
    this.DocHeader.setAttribute('class','clsAppFrame-Header');
      this.DocHeader.setAttribute('id','AppFrame-Header');
      this.DocBody.appendChild(this.DocHeader);
    this.DocMain = document.createElement('main');this.DocBody.appendChild(this.DocMain);
    this.addAction('AppFrame-FrameActions','Add application',this.ActionHandler_AddApplication.bind(this));
  }

  closeCurrentApp(){
    if(this.CurrnetApp != undefined){
      this.CurrnetApp.hide();
      this.CurrnetApp = undefined;
    }
    common.clearNode(this.DocMain);
  }

  ActionHandler_SelectApplication(e){
    let App = this.Applications[e.target.getAttribute('name')];
    if((App == undefined) || (!(App instanceof TApplication))){alert('ERROR: wrong Aplication');return}
    this.closeCurrentApp();
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