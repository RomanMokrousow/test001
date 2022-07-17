export {runAll}

async function runAll(){
  //testSecurity();
  testLoadFrom();
}

async function testSecurity(){
  let security = await import('./security.js');  
  let enc = await security.encodeAES((((new TextEncoder).encode('Две равноуважаемых семьи')).buffer));
  let b64 = btoa(new Uint8Array(security.AESObjectToBuffer(enc)).join());
  console.log(b64);
  //enc = 
  let dec = await security.decodeAES(enc);
  console.log((new TextDecoder).decode(dec));
}

async function testLoadFrom(){
  let resp = await fetch('../template/tmplTest.html');
  if(!resp.ok){
    console.log(resp);
  }else{
    let text = await resp.text();
    //console.log(text);
    let el = document.createElement('div').appendChild(document.createElement('div'));
    el.innerHTML = text;
    document.body.appendChild(el);
    console.log(el);
    console.log(el.querySelector('body').innerHTML);
  }
}
