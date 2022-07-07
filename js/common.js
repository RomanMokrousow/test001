export {clearNode, saveToFile}

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

function loadFromGithub(user,repo,filepath,token){
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

function saveToGithub(data,user,repo,filepath,token){
  loadFromGithub(user,repo,filepath,token)
  .then(resp => {
    console.log(resp);
  })
}