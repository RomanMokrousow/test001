import * as common from '../common.js';
import * as appfarame from '../appframe/appframe.js';
import * as options from '../options/options.js';

const OptionsStruct = {
  test: {
    DataType: 'TdtString'
  }
}
const Options = options.getConnection('Module-AppTests',OptionsStruct);
const ThisModuleBaseURL = import.meta.url.split('/').slice(0,-1).join('/');


export function create(){
  return new TAppTests();
}

export class TAppTests extends appfarame.TApplication{
  constructor(){
    super();
    this.init();
  }

  async init (){
    this._TemplateLib = await common.loadElementFrom(ThisModuleBaseURL + '/tmplDefault.html');
    this._MainElement.appendChild(this._TemplateLib.querySelector('.AppTests-aaa').cloneNode(true));
  }

}