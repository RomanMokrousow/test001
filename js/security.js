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
    if(!MasterKey){
      let a = (new TextEncoder).encode(PromptMasterKey);
      console.log(a);
      MasterKey = await crypto.subtle.importKey(
        "raw",
        a.buffer,
        'AES-CTR',
        false,
        ["encrypt", "decrypt"])
      };
    return MasterKey;
}

function PromptMasterKey(){
  return 'PromptResultString_QQsdB4S';
}

function 