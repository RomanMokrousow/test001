export {encodeAES, decodeAES, AESObjectToBuffer, BufferToAESObject}

var MasterKey = null;
var MasterKeySalt = (new TextEncoder).encode('solonoskop');

async function encodeAES(srcArrayBuffer,key){
  let Result = {alg: 'AES-GCM',iv: new Uint8Array(16), data: null};
  let local_key = (key == undefined)?await getMasterkey():key;
  window.crypto.getRandomValues(Result.iv);
  Result.data = new Uint8Array(await window.crypto.subtle.encrypt({name: Result.alg, iv: Result.iv}, local_key, srcArrayBuffer));
  return Result;
}

function AESObjectToBuffer(AESObject){
  let Result = new ArrayBuffer(1 + 16 + AESObject.data.buffer.byteLength);
  let arr = new Uint8Array(Result);
  arr[0] = 1;
  arr.set(AESObject.iv,1);
  arr.set(AESObject.data,17);
  return Result;
}

function BufferToAESObject(Buffer){
  return {
    alg: 'AES-GCM',
    iv: new Uint8Array(Buffer.slice(1,17)),
    data: new Uint8Array(Buffer.slice(17))
  }
}


async function decodeAES(AESObject, key){
  let Key;
  if(key == undefined){Key = await getMasterkey()}else{Key = key};
  let Result = await window.crypto.subtle.decrypt(
    {name: AESObject.alg, iv: AESObject.iv},
    Key,
    AESObject.data.buffer
  );
  return Result;
}



async function getMasterkey(){
    if(!MasterKey){
      let KeyMaterial = await PromptMasterKey();
      MasterKey = await crypto.subtle.deriveKey(
        {"name": "PBKDF2", salt: MasterKeySalt, "iterations": 100000, "hash": "SHA-256"},
        KeyMaterial,
        {"name": "AES-GCM", "length": 256},
        true,
        ["encrypt", "decrypt"]
      )
    };
    return MasterKey;
}

async function PromptMasterKey(){
  return await window.crypto.subtle.importKey(
    "raw",
    (new TextEncoder()).encode(await promptPassword()),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  );
}

async function promptPassword(){
  return window.prompt('Do not enter Your password here!!!');
}
