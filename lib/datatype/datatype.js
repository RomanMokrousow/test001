
class TDataConnection{
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

class TTypedNode{
  constructor(Value){
    this._Value = Value;
  }
  getString(){return ""}
  setString(Value){}
  set(TypedNode){}
  clone(){}
}

class TtnComplex extends TTypedNode{
  upgrade(onObject){}
}

class TtnObject extends TtnComplex{
  constructor(onObject){
    super();
    this._Value = {}
    if (typeof(onObject) != 'object'){return}
    for (const i in onObject){
      if(!(onObject[i] instanceof TTypedNode)){continue}
      this._Value[i] = onObject[i];
    }
  }
  
  upgrade(onObject){
    if (!(onObject instanceof TtnObject)){return}
    for(const i in this._Value){if(onObject[i] == undefined){this._Value[i] = undefined}}
    for(const i in onObject){
      if(!(onObject[i] instanceof TTypedNode)){continue}
      if(this._Value[i] instanceof onObject[i].constructor){
        if(this._Value instanceof TtnComplex){this._Value.upgrade(onObject)}
        continue
      }
      this._Value[i] = onObject[i].clone();
    }
  }

  append(Name,Data){
    if (!(Data instanceof TTypedNode) || (this._Value[Name] != undefined)){return}
    this._Value[Name] = Data;
  }

  getSub(Path){
    let Arr = path.split('.');
    if (length(Arr) <= 0){return this}
    let Result = this._Value[Arr[0]];
    if((Result instanceof TTypedNode) && (length(Arr) > 1)){Result = Result.getSub(Arr.slice(1))}
    return Result
  }

  toJSON(){
    return {"TtnObject": this._Value}
    return `TtnObject({${JSON.stringify(this._Value)}})`;
    let Result = '';
    let delimiter = '';
    for (const i in this._Value) {
      Result += delimiter + `${i}: ${JSON.stringify(this._Value[i])}`;
      delimiter = ', ';
    }
    Result = `TtnObject({${Result}})`;
    return Result;
  }
}

class TtnString extends TTypedNode{
  constructor(Value){
    super();
    this._Value = 's_' + Value;
  }

  toJSON(){
    return {"TtnString": this.getString()}
    return `TtnString(${this.getString()})`
  }

  getString(){return this._Value.slice(2)}
}

function JsonToTypedObject_Reviver(k,v){
  let Result = undefined;
  if (k == 'TtnString'){Result = new TtnString(v)}
  if (k == 'TtnObject'){Result = new TtnObject(v)}
  if (Result == undefined){
    for(const i in v){Result = v[i];break}
  }
  return Result;
}

var test = new TtnObject({
  Name: new TtnString('TestName'),
  Data: new TtnObject({
    Part1: new TtnString('TestData1'),
    Part2: new TtnString('TestData2')
  })
});
console.log(test);
var s = JSON.stringify(test);
test = JSON.parse(s,JsonToTypedObject_Reviver);
console.log('test: ',s, '=>', test);

class TDataType{
  constructor(Base){
    this.Base = Base;
  }
  getString (){throw ('on abstract call')}
  setString (Value){throw ('on abstract call')}
}

export class TdtString extends TDataType{
  constructor(Base){
    super(Base);
  }
  
  getString (){
    return '' + this.Base._Value;
  }
  setString(Value){
    this.Base._Value = '' + Value;
  }
}