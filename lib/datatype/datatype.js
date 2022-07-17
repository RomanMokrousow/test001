
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