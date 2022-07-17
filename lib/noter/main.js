import {clearNode, saveToFile, saveToGithub, loadFromGithub, md5} from './common.js';

var Content;
var Notes = {version: '0.0.0', list: {}}
var Tags = {list: {}}
var Base = [];

window.onload = doOnWindowLoad;
//doOnWindowLoad();
function doOnWindowLoad(e){
  window.alert('Hello!');
  document.querySelector('#btnTests').onclick = doTests;
  document.querySelector('#btnCreateNote').onclick = createNote;
  document.querySelector('#btnShowNoteList').onclick = showNoteList;
  document.querySelector('#btnSave').onclick = doOnSave;
  document.querySelector('#btnLoadFromGithub').onclick = doOnLoadFromGithub;
  document.querySelector('#inpLoadFromFile').onchange = doOnLoadFromFile;
  Content = document.getElementById('content');
  let nl = window.localStorage.getItem('Noter.NoteList');if (nl) {
    StringToNotes(nl,'localStorage');showNoteList();
  }else{
    createNote()
  }
  //Content.innerHTML = 'Hello! You are welcome.';
}

async function doTests(e){
  let TestLib = await import('./test.js');
  TestLib.runAll();
}

function reloadTags(){
  for(let k in Notes.list){
    for(let v of Notes.list[k].Tag){
      if(!Tags.list[v]){Tags.list[v] = []}
      if(Tags.list[v].indexOf(k) < 0){Tags.list[v].push(k)}
    }
  }
}

function doOnLoadFromFile(e){
  let files = e.target.files;
  if(files.length <=0){
    console.log('there are no files');
    return;
  }
  let reader = new FileReader();
  reader.onload = function(e){
    //Notes = JSON.parse(e.target.result);
    StringToNotes(e.target.result,`file://${files[0].Name}`);
    showNoteList();
  }
  reader.readAsText(files[0])
}

function createNote() {
  let note = {Text: 'New Note', Tag: [], Storage: 'localStorage'};
  let i = 0;while(true){if(!Notes.list['note'+i]){break}; i++}
  i = 'note'+i;
  Notes.list[i] = note;
  showNote(i);
}

function showNoteList() {
  clearNode(Content);
  let TagList = [];
  let NoteList = [];
  let ListNode = document.createElement('ul');
  ListNode.setAttribute('class','NoteListBase');
  for(let v of Base){
    let i = document.createElement('li');
    i.innerText = `[X]${v}`;
    i.setAttribute('tabindex','1');
    i.onclick = function(e){
      Base.splice(Base.indexOf(v),1);
      showNoteList();
    }
    ListNode.appendChild(i);
  }
  Content.appendChild(ListNode);
  ListNode = document.createElement('ul');
  if(Base.length <= 0){
    for(let k in Tags.list){TagList.push(k)}
    for(let k in Notes.list){if(Notes.list[k].Tag.length <= 0){NoteList.push(k)}};
  }else{
    for(let k in Notes.list){
      let flag = false;
      for(let v of Base){if(Notes.list[k].Tag.indexOf(v) < 0){flag = true; break}}
      if(flag){continue}
      let Tail = Notes.list[k].Tag.filter((t) => {return Base.indexOf(t) < 0});
      if(Tail.length <= 0){
        NoteList.push(k)
      }else{
        for(let v of Tail){if(TagList.indexOf(v) < 0){TagList.push(v)}}
      }
    }
  }
  for(let Tag of TagList){
    let ItemNode = document.createElement('li');
    let a = document.createElement('a');
    a.setAttribute('href','#');
    a.innerText = `[${Tag}]`;
    a.onclick = function(){if(Base.indexOf(Tag) < 0){Base.push(Tag)};showNoteList()}
    ItemNode.appendChild(a);
    ListNode.appendChild(ItemNode);
  }
  for (let k of NoteList) {
    let node = document.querySelector('#tmplNoteListButton').cloneNode(true);
    node.setAttribute('class','NoteListButton');
    let a = node.querySelector('a');
    a.innerHTML = Notes.list[k].Text.split("\n",2)[0];
    a.onclick = function(e){showNote(k)}
    ListNode.appendChild(node);
  }
  Content.appendChild(ListNode);
}

function formatNote(index) {
  let result = '';
  let Note = Notes.list[index]
  Note = Note.Text.split("\n");
  for(let i=0;i<Note.length;i++){
    result += `<p>${Note[i]}</p>`;
  }
  return result;
}

function showNote(index) {
  let node = document.querySelector('#tmplNote').cloneNode(true);
  node.querySelector('.btnNoteEdit').onclick = doOnNoteEdit;
  node.querySelector('.btnNoteDelete').onclick = doOnNoteDelete;
  node.querySelector('.btnNoteAddNewTag').onclick = doOnNoteAddNewTag;
  node.NoteIndex = index;
  node.setAttribute('class','NoteShow');
  let NodeTagHolder = node.querySelector('.NoteTagList');
  clearNode(NodeTagHolder);
  for(let v in Tags.list){
    let l = document.createElement('label');
    l.innerText = v;
    let e = document.createElement('input');
    e.setAttribute('type','checkbox');
    e.setAttribute('name','taglist');
    e.setAttribute('value',v);
    if(Notes.list[index].Tag.indexOf(v) >= 0){e.setAttribute('checked','true')}
    e.onchange = function(event){
      if(e.checked){
        Notes.list[index].Tag.push(v);
        Tags.list[v].push(index);
        showNote(index);
      }else{
        Notes.list[index].Tag.splice(Notes.list[index].Tag.indexOf(v),1);
        Tags.list[v].splice(Tags.list[v].indexOf(index),1);
        let i = Base.indexOf(v);if(i >= 0){Base.splice(i,1)}
        if(Tags.list[v].length <= 0){delete Tags.list[v]}
        showNote(index);
      }
    }
    l.appendChild(e);
    NodeTagHolder.appendChild(l);
  }
  let ContentNode = node.querySelector('.NoteContent');
  ContentNode.innerHTML = formatNote(index);
  ContentNode.ondblclick = function(){toggleNoteEditMode(ContentNode)}
  clearNode(Content);Content.appendChild(node)
}

function doOnShowLocalStorage(e){
  let s = '';Content.innerHTML = s;
  for(let i=0;i<window.localStorage.length;i++){
    let k = window.localStorage.key(i);
    s = s + `<br>${k} = ${window.localStorage.getItem(k)}`;
  }
  Content.innerHTML = s;
}

function doOnNoteAddNewTag(e){
  let NoteNode = e.target.parentElement.parentElement;
  let TagValueNode = NoteNode.querySelector('.AppNoter-InputAddNewTag');
  let TagValue = TagValueNode.value;
  if(TagValue == ''){
    TagValueNode.style['display'] = 'inline';
    TagValueNode.focus();
    return;
  }
  if(TagValue == ''){return}
  let NoteIndex = NoteNode.NoteIndex;
  if((typeof(Notes.list[NoteIndex].Tag) === 'object') && (Notes.list[NoteIndex].Tag.indexOf(TagValue) >= 0)){return}
  if(!Notes.list[NoteIndex].Tag){Notes.list[NoteIndex].Tag = []}
  Notes.list[NoteIndex].Tag.push(TagValue);
  if(!Tags.list[TagValue]){Tags.list[TagValue] = []}
  Tags.list[TagValue].push(NoteIndex);
  showNote(NoteIndex);
}

function doOnNoteDelete(e){
  let index = e.target.parentElement.parentElement.NoteIndex;
  delete Notes.list[index];
  showNoteList();
}

function doOnNoteEdit(e){
  let node = e.target.parentElement.parentElement.querySelector('.NoteContent');
  toggleNoteEditMode(node)
}

function toggleNoteEditMode(NoteContentNode){
  let node = NoteContentNode;
  let index = node.parentElement.NoteIndex;
  if (node.getAttribute('contenteditable') == 'true') {
  Notes.list[index].Text = node.innerText;
  node.innerHTML = formatNote(index);
  node.setAttribute('contenteditable','false');
  node.ondblclick = function(){toggleNoteEditMode(node)}
  node.onblur = null;
  } else {
  node.innerText = Notes.list[index].Text;
  node.setAttribute('contenteditable','true');
  node.ondblclick = null;
  node.onblur = function(){toggleNoteEditMode(node)}
  node.focus();
  }
}

function NotesToString(storage){
  let Obj = {version: Notes.version, list: {}}
  for(let v in Notes.list){if(Notes.list[v].Storage == storage){Obj.list[v] = {Text: Notes.list[v].Text, Tag:Notes.list[v].Tag}}}
  return JSON.stringify(Obj);
}

function StringToNotes(str,storage,rewrite){
  let Obj = JSON.parse(str);
  if (Obj.version == Notes.version){
    if(rewrite == true){Notes.list={}};
    for(let n in Obj.list){
      let h = md5(Obj.list[n].Text);
      let flag = true;let tail='';let i='0';while(true){
        if(typeof(Notes.list[h + tail]) != 'object'){break}
        if(Notes.list[h + tail].Text == Obj.list[n].Text){flag = false;break}
        i++;tail = '_' + i;
      }
      if(flag){
        Notes.list[h] = Obj.list[n];
        Notes.list[h].Storage = storage;
      }
    }
  } else {
    window.alert('ERROR: Wrong storage version')
  }
  reloadTags();
}

function doOnSave(e) {
  let Data = NotesToString('localStorage');
  window.localStorage.setItem('Noter.NoteList',Data);
  saveToFile(Data,'NoterData.json');
  //saveToGithub(Data,localStorage.getItem('Noter.optionGitUser'),localStorage.getItem('Noter.optionGitRepo'),'test001.txt',localStorage.getItem('Noter.optionGitToken'));
}

function doOnLoadFromGithub(e){
  let filename = 'test001.txt';
  let user = localStorage.getItem('Noter.optionGitUser');
  let repo = localStorage.getItem('Noter.optionGitRepo');
  loadFromGithub(user,repo,filename,localStorage.getItem('Noter.optionGitToken'))
  .then((Data) => {
    StringToNotes(Data,`github://${user}/${repo}/${filename}`);
    //Notes = JSON.parse(Data);
    showNoteList();
  })
}
