function showExplorableDOM() {
  initialParent = document.getElementsByTagName('body')[0];
  childElements = document.querySelectorAll('#main-content > *');
  
  for(var i = 0; i < childElements.length; i++) {
    copyElement(initialParent, childElements[i]);
    if(i > 50) 
      break;
  }
  
  window.setTimeout(function(){
    deleteAllCreatedElements();
  }, 10000);
}

function copyElement(parentElement, element, nested = false) {
  var newElement = document.createElement('div');
  
  newElement.style.borderColor = getRandomColor();
  newElement.style.borderWidth = '2px';
  newElement.style.borderStyle = 'solid';
  newElement.style.top = element.getBoundingClientRect().top - parentElement.getBoundingClientRect().top;
  newElement.style.left = element.getBoundingClientRect().left - parentElement.getBoundingClientRect().left;
  newElement.style.width = element.offsetWidth;
  newElement.style.height = element.offsetHeight;
  newElement.style.position = 'absolute';
  newElement.style.opacity = '0.6';
  //newElement.style.display = 'none';
  
  //element.onmouseover = function(){ newElement.style.display = 'block' };
  //element.onmouseout = function(){ newElement.style.display = 'none' }; 
  
  //newElement.onclick = function() { toggleChildren(newElement) }
  
  newElement.innerHTML += element.tagName;
  
  newElement.classList.add('created');
  parentElement.appendChild(newElement);
  
  if(element.children.length > 0) {
    childNodes = getDirectChildNodes(element);
    for(var j = 0; j < childNodes.length; j++) {
      copyElement(newElement, childNodes[j], true);
    }
  }
}

function deleteAllCreatedElements() {
  elements = document.getElementsByClassName('created')
  while(elements.length > 0) {
    elements[0].remove();
  }
}

function getRandomColor() {
  letters = '0123456789ABCDEF';
  color = '#';
  for(var i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getDirectChildNodes(element) {
  childNodes = element.children;
  childs = [];
  for(var i = 0; i < childNodes.length; i++){
      childs.push(childNodes[i]);
  }
  
  return childs
}

/*
function toggleChildren(element) {
  childNodes = getDirectChildNodes(element);
  for(var i = 0; i < childNodes.length; i++){
    toggle_visibility(childNodes[i])
  }
}

function toggle_visibility(e) {
   if(e.style.display == 'block')
      e.style.display = 'none';
   else
      e.style.display = 'block';
}
*/