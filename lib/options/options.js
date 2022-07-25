import * as sec_helher from '../security/helper.js';
import * as datatype from '../datatype/datatype.js';

export const ObjectDataTypeName = 'TObject';
const OptionCheckableParams = {
  critical:['DataType','DataStruct'],
  other:['Name','LocalityId','Description','HelpURL']
};
var Options = {};

class TOptionsConnection{
  constructor(Base){
    this.Base = Base;
  }
  get (Path){
    //throw ('on ToDo stage now');
    return new datatype[this.Base[Path].DataType](this.Base[Path]);
  }
  set (Path,ValueObject){
  }
  getString (Path){
    return this.get(Path).getString();
  }
  setString (Path,ValueString){
    return this.get(Path).setString(ValueString);
  }
}

export function getConnection(Name,Struct){
  if(
      (!Options[Name]) || 
      (Options[Name].DataType != ObjectDataTypeName) || 
      (Options[Name].DataStruct)
    ){Options[Name] = {DataType: ObjectDataTypeName, _sub: {}}}
  checkStruct(Options[Name]._sub,Struct);
  return new TOptionsConnection(Options[Name]._sub);
}

export function save(){
  saveOptions();
}

function checkStruct(Base,Struct){
  let CheckOk = true;
  for(let k in Struct){
    if(!Base[k]){Base[k] = {}}
    for(let p of OptionCheckableParams.critical){
      if(Base[k][p] != Struct[k][p]){CheckOk = false;Base[k]._Value = null;Base[k][p] = Struct[k][p]}
    }
    for(let p of OptionCheckableParams.other){
      if(Base[k][p] != Struct[k][p]){Base[k][p] = Struct[k][p]}
    }
    if(Struct.DataType == ObjectDataTypeName){
      if(!Base._sub){Base._sub = {}}
      CheckOk = checkStruct(Base._sub,Struct._sub);
    }
  }
  return CheckOk;
}

class TOptions class extends datatype.TtnObject{
  
  async loadFromLocalStorage(){
    let OptionsData = localStorage.getItem('options');
    OptionsData = await sec_helher.decodeString(OptionsData);
    if(OptionsData = undefined){return}
    OptionsData = this.constructor.fromJson(OptionsData)
    this._Value = {}
    this.upgrade(OptionsData);
  }

  async saveToLocalStorage(){
    let Json = this.toJson();
    let Encoded = sec_helher.encodeString(Json,'STR');
    localStorage.setItem('options',Encoded);
  }
}

async function loadOptions(){
  Options = new TOptions();

}

async function saveOptions(){
  let OptionsData = {}
  //  
  OptionsData = Options;
  //
  let Json = JSON.stringify(OptionsData);
  let Buffer = (new TextEncoder()).encode(Json).buffer;
  let AESObject = await security.encodeAES(Buffer);
  Buffer = security.AESObjectToBuffer(AESObject);
  let Arr = String.fromCharCode(...(new Uint8Array(Buffer)));
  let B64 = btoa(Arr);
  localStorage.setItem('options',B64);
}

await loadOptions();