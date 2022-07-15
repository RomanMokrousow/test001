import * as security from './security.js';

export {runAll}

async function runAll(){
    let enc = await security.encodeAES((((new TextEncoder).encode('Две равноуважаемых семьи')).buffer));
    let b64 = btoa(new Uint8Array(security.AESObjectToBuffer(enc)).join());
    console.log(b64);
    //enc = 
    let dec = await security.decodeAES(enc);
    console.log((new TextDecoder).decode(dec));
}

