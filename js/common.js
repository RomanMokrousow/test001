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
