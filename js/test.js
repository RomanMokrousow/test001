import * as security from './security.js';

export {runAll}

async function runAll(){
    console.log(await security.encodeAES((new Uint8Array('asdadads').buffer)));
}

