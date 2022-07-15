import * as security from './security.js';

alert(await security.encodeAES((new Uint8Array('asdadads').buffer)));

