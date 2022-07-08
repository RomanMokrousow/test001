export {clearNode, saveToFile, saveToGithub, loadFromGithub}

function clearNode(node) {
  while (node.lastChild) {node.removeChild(node.lastChild)}
}

function saveToFile(data, filename, type) {
  let DataURL = URL.createObjectURL(new Blob([data], { type: type }));
  let AnchorNode = document.createElement("a");
  AnchorNode.href = DataURL;
  AnchorNode.download = filename;
  document.body.appendChild(AnchorNode);
  AnchorNode.click();
  setTimeout(function() {
    document.body.removeChild(AnchorNode);
    window.URL.revokeObjectURL(DataURL);
  }, 0);
}

function _loadFromGithub(user,repo,filepath,token){
  return new Promise((resolve,reject) => {
    let Headers = {};
    if(token){Headers.Authorization = 'token ' + token}
    fetch(`https://api.github.com/repos/${user}/${repo}/contents/test001.txt`,{
      method: 'Get',
      headers: Headers
    })
    .then(resp => {
      resolve(resp)
    })
    .catch(c => {
      let s = 'Somthing wrong in loadFromGithub->fetch'
      console.error(s);
      reject(s);
    })
  })
}

function b64EncodeUnicode(str) {
  let a = new TextEncoder().encode(str);
  var sa = ''; a.map((v) => {sa += String.fromCharCode(v)});
  return btoa(sa);
};

function UnicodeDecodeB64(str) {
  let s = atob(str);
  let a = new Uint8Array(s.split('').map((v) => {return v.codePointAt(0)}));
  return new TextDecoder().decode(a);
};

function _saveToGithub(data,user,repo,filepath,token,sha){
  return new Promise((resolve,reject) => {
    let Headers = {Authorization: 'token ' + token};
    let Body = {
      message:'Noter data update',
      committer:{
        name:'The Noter Application',
        email:'noter.uszn-zlt@github.com'
      },
      content:b64EncodeUnicode(data),
      sha:sha
    }
    fetch(`https://api.github.com/repos/${user}/${repo}/contents/test001.txt`,{
      method: 'Put',
      headers: Headers,
      body: JSON.stringify(Body)
    })
    .then(resp => {
      resolve(resp)
    })
    .catch(c => {
      let s = 'Somthing wrong in loadFromGithub->fetch'
      console.error(s);
      reject(s);
    })
  })
}

function saveToGithub(data,user,repo,filepath,token){
  _loadFromGithub(user,repo,filepath,token)
  .then(resp => {
    if(resp.ok){
      resp.text()
      .then(s => {
        let RespBody = JSON.parse(s);
        _saveToGithub(data,user,repo,filepath,token,RespBody.sha)
        .then((resp) => {
          console.log(resp);
        })
      })
    }else{console.log(resp)}
  })
}

function loadFromGithub(user,repo,filepath,token){
  return new Promise((resolve,reject) => {
    _loadFromGithub(user,repo,filepath,token)
    .then(resp => {
      if(resp.ok){
        resp.text()
        .then(s => {
          let RespBody = JSON.parse(s);
          resolve(UnicodeDecodeB64(RespBody.content));
        })
      }else{console.log(resp)}
    })
  })
}