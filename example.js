function showExplorableDOM() {
  var initialParent = document.getElementsByTagName('body')[0];
  var childElements = document.querySelectorAll('#main-content > *');
  
  for(i = 0; i < childElements.length; i++) {
    copyElement(initialParent, childElements[i]);
    if(i > 50) 
      break;
  }
  
  window.setTimeout(function(){
    deleteAllCreatedElements();
  }, 10000);
}

function copyElement(parentElement, element) {
  var newElement = document.createElement('div');
  
  newElement.style.borderColor = getRandomColor();
  newElement.style.borderWidth = '2px';
  newElement.style.borderStyle = 'solid';
  newElement.style.top = element.getBoundingClientRect().top; 
  newElement.style.left = element.getBoundingClientRect().left; 
  newElement.style.width = element.offsetWidth;
  newElement.style.height = element.offsetHeight;
  newElement.style.position = 'absolute';
  newElement.style.opacity = '0.6';
  
  newElement.innerHTML += element.tagName;
  
  newElement.classList.add('created');
  parentElement.appendChild(newElement);
  
  if(element.children.length > 0) {
    var childNodes = element.children;
    for(j = 0; j < childNodes.length; j++) {
      if(childNodes[j].parentElement == element) {
        copyElement(newElement, childNodes[j]);
      }
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
  for (var i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}