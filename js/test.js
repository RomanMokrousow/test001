import * as security from './security.js';

function runAll(){
    console.log(await security.encodeAES((new Uint8Array('asdadads').buffer)));
}

