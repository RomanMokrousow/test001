
export async function decodeStringFromB64(B64String){
  let Data =  B64String;
  Data = atob(Data);
  Data = Data.split('');
  Data = Data.map((c) => {return c.charCodeAt(0)})
  Data = (new Uint8Array(Data)).buffer;
  let security = import('./security.js');
  let AESObject = security.BufferToAESObject(Data);
  let Buffer = await security.decodeAES(AESObject);
  return (new TextDecoder()).decode(new Uint8Array(Buffer));
}

export async function encodeStringToB64(Str){
  let Buffer = (new TextEncoder()).encode(Str).buffer;
  let security = import('./security.js');
  let AESObject = await security.encodeAES(Buffer);
  Buffer = security.AESObjectToBuffer(AESObject);
  let Arr = String.fromCharCode(...(new Uint8Array(Buffer)));
  let B64 = btoa(Arr);
  return B64;
}

async function encodeB64(Str){}
async function decodeB64(Str){}
async function encodeAES(Str){}
async function decodeAES(Str){}

var CodecList = {
  'B64': {encode: encodeB64, decode: decodeB64},
  'AES': {encode: encodeAES, decode: decodeAES}
  'STR': {encode: encodeAES, decode: decodeAES}
}

export async function decodeString(Str){
  let Arr = Str.split('::',2);
  if(Arr[0] == 'STR'){return Arr[1]}
  let Codec = CodecList[arr];
  if(Codec == undefined){
    return undefined
  }else{
    return await decodeString(Codec.decode(Arr[1]))
  }
}

export async function encodeString(Str,...CodecChain){
  
}