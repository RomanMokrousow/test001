export {encodeAES}

var MasterKey = null;

async function encodeAES(srcArrayBuffer,key){
  let Result = {iv: new Uint8Array(16), data: null};
  let local_key = (key == undefined)?await getMasterkey():key;
  window.crypto.getRandomValues(Result.iv);
  Result.data = await window.crypto.subtle.encrypt({name: "AES-GCM", iv: Result.iv}, local_key, srcArrayBuffer);
  return Result;
}

async function getMasterkey(){
    if(!MasterKey){MasterKey = await window.crypto.subtle.generateKey({name: "AES-GCM", length: 256},true,["encrypt", "decrypt"]};
    return MasterKey
}