var Content;

window.onload = function(e){
  window.alert('Hello!');
  Content = document.getElementById('content');
  Content.innerHTML = 'Hello! You are welcome.';
}

function doOnShowLocalStorage(e){
  let s = '';Content.innerHTML = s;
  for(let i=0;i<window.localStorage.length;i++){
    let k = window.localStorage.key(i);
    s = s + `<br>${k} = ${window.localStorage.getItem(k)}`;
  }
  Content.innerHTML = s;
}
