
export class TTypedNode extends EventTarget{
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
    super();
    this._OwnerList = [];
    //this.addEventListener('test',this);
    //this._Value = Value;
  }
  getString(){return ""}
  setString(Value){}
  set(TypedNode){}
  checkParent(Node){return ((Node instanceof TTypedNode) && (this instanceof Node.constructor))}
  checkSibling(Node){return ((Node instanceof TTypedNode) && (this.constructor == Node.constructor))}
  checkDescendant(Node){return ((Node instanceof TTypedNode) && (Node instanceof this.constructor))}
  checkParentOrSibling(Node){return (this.checkParent(Node) || this.checkSibling(Node))}
  checkSiblingOrParent(Node){return this.checkParentOrSibling(Node)}
  checkSiblingOrDescendant(Node){return (this.checkDescendant(Node) || this.checkSibling(Node))}
  checkDescendantOrSibling(Node){return this.checkSiblingOrDescendant(Node)}
  clone(){
    return new this.constructor();
  }
  update(Target){
    if(!((Target instanceof TTypedNode) && (this instanceof Target.constructor))){return false}
    if(Target.constructor == this.constructor){return this.updateSibling(Target)}
    return this.updateParent(Target)
  }
  updateSibling(Target){
    if(!((Target instanceof TTypedNode) && (Target.constructor == this.constructor))){return false}
    Target._Value = this._Value
    return true;
  }
  updateParent(Target){
    if(!((Target instanceof TTypedNode) && (this instanceof Target.constructor))){return false}
    Target._Value = undefined;
    return true;
  }

  dispatchEvent(e){
    super.dispatchEvent(e);
    for(const i of this._OwnerList){i.dispatchEvent(e)};
  }

  get value(){return this._Value}

  get parentElement(){return this._Parent}

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

  getSub(Path){return undefined}
  upgrade(onObject){}
  append(Name,Data){
    Data._OwnerList.push(this);
  }
  remove(Name){
    let Data = this.getSub(Name)
    while(true){
      let Index = Data._OwnerList.indexOf(this);
      if(Index < 0){break}
      Data._OwnerList.splice(Index,1);
    }
    return Data;
  }
}

export class TtnArray extends TtnComplex{
  static Derived = {}
  static {TtnComplex.Derived[this.name] = this}

  constructor(onArray){
    super();
    this._Value = [];
    if(!Array.isArray(onArray)){return}
    for(const Item of onArray){
      this.append(-1,Item);
    }
  }

  append(BeforeIndex,Data){
    if (!(Data instanceof TTypedNode) || (BeforeIndex >= this._Value.length)){return}
    if (BeforeIndex < 0){this._Value.push(Data)}else{this._Value.unshift(Data)}
    super.append(BeforeIndex,Data);
  }

  updateSibling(Target){
    if(!this.checkSibling(Target)){return false}

    for(const Item of Target._Value){
      if(this._Value[Key] instanceof TTypedNode){Target._Value[Key] = this._Value[Key].clone()}
    }
    return true;
  }

  getSub(Path){
    let Arr = Path.split('.');
    if (Arr.length <= 0){return this}
    let Result = this._Value[Arr[0]];
    if((Result instanceof TTypedNode) && (Arr.length > 1)){Result = Result.getSub(Arr.slice(1).join('.'))}
    return Result
  }

  clone(){
    let Result = super();
    for(const Item of this._Value){
      if(!(Item instanceof TTypedNode)){continue}
      Result._Value = Item.clone();
    }
    return Result;
  }
}

export class TtnObject extends TtnComplex{
  static Derived = {}
  static {TtnComplex.Derived[this.name] = this}

  constructor(onObject){
    super();
    this._Value = {}
    if (typeof(onObject) != 'object'){return}
    for (const i in onObject){
      this.append(i,onObject[i]);
      //if(!(onObject[i] instanceof TTypedNode)){continue}
      //this._Value[i] = onObject[i];
    }
  }
  
  upgrade(onObject){
    if (!(onObject instanceof TtnObject)){return}
    for(const i in this._Value){if(onObject[i] == undefined){this.remove(i)}}
    for(const i in onObject){
      if(!(onObject[i] instanceof TTypedNode)){continue}
      if(this._Value[i] instanceof onObject[i].constructor){
        if(this._Value[i] instanceof TtnComplex){this._Value[i].upgrade(onObject[i])}
        continue
      }
      this.remove(i);this.append(i,onObject[i].clone());
    }
  }

  append(Name,Data){
    if (!(Data instanceof TTypedNode) || (this._Value[Name] != undefined)){return}
    this._Value[Name] = Data;
    super.append(Name,Data);
  }

  updateSibling(Target){
    if(!this.checkSibling(Target)){return false}
    for(const Key in Target._Value){
      if(this._Value[Key] instanceof TTypedNode){Target._Value[Key] = this._Value[Key].clone()}
    }
    return true;
  }

  getSub(Path){
    let Arr = Path.split('.');
    if (Arr.length <= 0){return this}
    let Result = this._Value[Arr[0]];
    if((Result instanceof TTypedNode) && (Arr.length > 1)){Result = Result.getSub(Arr.slice(1).join('.'))}
    return Result
  }

  clone(){
    let Result = super();
    for(const Key in this._Value){
      if(!(this._Value[Key] instanceof TTypedNode)){continue}
      Result.append(Key,this._Value[Key].clone());
    }
    return Result;
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

  clone(){
    let Result = super();
    Result._Value = this._Value + '';
    return Result;
  }
}

class TDataType{
  constructor(Base){
    this.Base = Base;
  }
  getString (){throw ('on abstract call')}
  setString (Value){throw ('on abstract call')}
}

class TdtString extends TDataType{
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