export {clearNode, saveToFile, saveToGithub}

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

function _saveToGithub(data,user,repo,filepath,token,sha){
  return new Promise((resolve,reject) => {
    let Headers = {Authorization: 'token ' + token};
    let Body = {
      message:'my commit message',
      committer:{
        name:'Monalisa Octocat',
        email:'octocat@github.com'
      },
      content:btoa(data),
      sha:sha
    }
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

function saveToGithub(data,user,repo,filepath,token){
  _loadFromGithub(user,repo,filepath,token)
  .then(resp => {
    if(resp.ok){
      resp.text()
      .then(s => {
        let RespBody = JSON.parse(s);
        _saveToGithub(data,user,repo,filepath,token,RespBody.sha);
      })
    }else{console.log(resp)}
  })
}