export function create(elem, innerText, nodeClassList, nodeId) {
  let node = document.createElement(elem);
  if (nodeClassList) {
    node.className = nodeClassList;
  }
  if (nodeId) {
    node.id = nodeId;
  }
  if (innerText) {
    node.innerHTML = innerText;
  }
  return node;
}



