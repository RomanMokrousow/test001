
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

export class TTypedNode{
  static Derived = {}
  static GetDerived(ClassName){
    let Result = this.Derived[ClassName];
    if (Result == undefined){for(const k in this.Derived){Result = this.Derived[k].GetDerived(ClassName); if(Result != undefined){return Result}}}
    return Result;
  }
  static JsonToTypedObject_Reviver(k,v){
    let Result = undefined;
    let DerivedClass = TTypedNode.GetDerived(k);
    if(DerivedClass != undefined){
      Result = new DerivedClass(v)
    }else{
      for(const i in v){Result = v[i];break}
    }
    return Result;
  }
  static fromJSON(JsonString){
    return JSON.parse(JsonString,TTypedNode.JsonToTypedObject_Reviver)
  }

  constructor(Value){
    //this._Value = Value;
  }
  getString(){return ""}
  setString(Value){}
  set(TypedNode){}
  clone(){}

  get value(){return this._Value}

  toJSON(k){
    let Result = {};
    Result[this.constructor.name] = this.value;
    return Result;
  }

  toJson(){
    return JSON.stringify(this)
  }
}

export class TtnComplex extends TTypedNode{
  static Derived = {}
  static {TTypedNode.Derived[this.name] = this}

  upgrade(onObject){}
}

export class TtnObject extends TtnComplex{
  static Derived = {}
  static {TtnComplex.Derived[this.name] = this}

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
}

export class TtnString extends TTypedNode{
  static Derived = {}
  static {TTypedNode.Derived[this.name] = this}

  constructor(Value){
    super();
    this._Value = 's_' + Value;
  }

  get value(){return this.getString()}

  getString(){return this._Value.slice(2)}
}

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

export function test_module(){
  console.log('import: ', TTypedNode);
  var test = new TtnObject({
    Name: new TtnString('TestName'),
    Data: new TtnObject({
      Part1: new TtnString('TestData1'),
      Part2: new TtnString('TestData2')
    })
  });
  console.log(test);
  var s = test.toJson();
  test = TTypedNode.fromJSON(s);
  console.log('test: ',s, '=>', test);
}