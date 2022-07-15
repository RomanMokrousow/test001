export {encodeAES}

var MasterKey = null;
var MasterKeySalt = (new TextEncoder).encode('solonoskop');

async function encodeAES(srcArrayBuffer,key){
  let Result = {iv: new Uint8Array(16), data: null};
  let local_key = (key == undefined)?await getMasterkey():key;
  window.crypto.getRandomValues(Result.iv);
  Result.data = await window.crypto.subtle.encrypt({name: "AES-GCM", iv: Result.iv}, local_key, srcArrayBuffer);
  return Result;
}

async function getMasterkey(){
    if(!MasterKey){MasterKey = await crypto.subtle.deriveKey({"name": "PBKDF2", salt: MasterKeySalt, "iterations": 100000, "hash": "SHA-256"},PromptMasterKey,{"name": "AES-GCM", "length": 256}, true, ["encrypt", "decrypt"])};
    return MasterKey;
}

function PromptMasterKey(){
  return window.crypto.subtle.importKey(
    "raw",
    (new TextEncoder()).encode('PromptResultString_QQsdB4S'),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  );
}
