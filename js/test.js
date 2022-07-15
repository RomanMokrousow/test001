import * as security from './security.js';

export {runAll}

async function runAll(){
    let enc = await security.encodeAES((((new TextEncoder).encode('Две равноуважаемых семьи')).buffer));
    console.log(enc);
    let dec = await security.decodeAES(enc);
    console.log((new TextDecoder).decode(dec));
}

