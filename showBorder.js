function showBorder() {
  var initialParent = document.getElementsByTagName('body')[0];
  var childElements = document.querySelectorAll('#main-content > *');
  
  for(var i = 0; i < childElements.length; i++) {
    if(childElements[i].tagName != 'SCRIPT') {
      copyElement(initialParent, childElements[i]);
    }
  }
  
  rotateDom(45);
  document.getElementById('main-content').style.opacity = '0.3'
}

function hideBorder(){
  var content = document.getElementById('main-content');
  
  deleteAllCreatedElements();
  rotateDom(0);
  content.style.opacity = '1';
  
  // Width and height is lost within the transformation
  content.style.width = '100%';
  content.style.height = '100%';
}

function copyElement(parentElement, element, nested = false) {
  var newElement = document.createElement('div');
  
  // Set style information for the new element
  newElement.style.borderColor = getRandomColor();
  newElement.style.borderWidth = '2px';
  newElement.style.borderStyle = 'solid';
  newElement.style.top = element.getBoundingClientRect().top - parentElement.getBoundingClientRect().top;
  newElement.style.left = element.getBoundingClientRect().left - parentElement.getBoundingClientRect().left;
  newElement.style.width = element.offsetWidth;
  newElement.style.height = element.offsetHeight;
  newElement.style.position = 'absolute';
  newElement.style.opacity = '1';
  newElement.style.pointerEvents = 'none';
  
  newElement.innerHTML += element.tagName;
  
  newElement.classList.add('created');
  parentElement.appendChild(newElement);
  
  // Keep hierarchy information by adding child elements recursively 
  if(element.children.length > 0) {
    var childNodes = getDirectChildNodes(element);
    for(var j = 0; j < childNodes.length; j++) {
      copyElement(newElement, childNodes[j], true);
    }
  }
}

function deleteAllCreatedElements() {
  var elements = document.getElementsByClassName('created')
  while(elements.length > 0) {
    elements[0].remove();
  }
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  
  for(var i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getDirectChildNodes(element) {
  var childNodes = element.children;
  var childs = [];
  
  for(var i = 0; i < childNodes.length; i++){
      childs.push(childNodes[i]);
  }
  return childs
}

function rotateDom(x) {
  var content = document.getElementById('main-content');
  content.style = "transform: rotateY("+x+"deg )";
}