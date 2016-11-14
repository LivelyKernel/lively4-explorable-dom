var level = 1;

function showContainer() {
  var initialParent = document.getElementsByTagName('body')[0];
  var childElements = document.querySelectorAll('#main-content > *');
  
  // Copy all DOM elements
  for(var i = 0; i < childElements.length; i++) {
    if(childElements[i].tagName != 'SCRIPT') {
      copyElement(initialParent, childElements[i]);
    }
  }
  
  // Make background less prominent
  rotateDom(45);
  document.getElementById('main-content').style.opacity = '0.3'
}

function hideContainer(){
  var content = document.getElementById('main-content');
  
  // Reset changes
  deleteAllCreatedElements();
  rotateDom(0);
  content.style.opacity = '1';
  
  // Width is lost within the transformation
  content.style.width = '100%';
  
  // Rest global variable
  level = 1;
}

function copyElement(parentElement, element, nested = false, nestingLevel = 0) {
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
  
  // Child elements are hidden by default --> only first hierarchy level is shown
  if(nested) {
    newElement.style.visibility = 'hidden';
    newElement.classList.add('nested_'+nestingLevel);
  }
  
  newElement.innerHTML += element.tagName;
  newElement.classList.add('created');
  parentElement.appendChild(newElement);
  
  // Keep hierarchy information by adding child elements recursively 
  if(element.children.length > 0) {
    var childNodes = getDirectChildNodes(element);
    nestingLevel += 1;
    disableNextHierarchyButton(false);
    
    for(var j = 0; j < childNodes.length; j++) {
      copyElement(newElement, childNodes[j], true, nestingLevel);
    }
  }
}

// Shows next level of child elements
function showNextHierarchyLevel() {
  var elements = document.getElementsByClassName('created nested_' + level);
  var isLastLevel = true;
  if(elements.length > 0) {
    for(i = 0; i < elements.length; i++) {
      elements[i].style.visibility = 'visible';
      if(isLastLevel === true && getDirectChildNodes(elements[i]).length != 0) {
        isLastLevel = false;
      }
    }
    level += 1;
    if(isLastLevel) { 
     disableNextHierarchyButton(true);
    }
  }
}

function deleteAllCreatedElements() {
  var elements = document.getElementsByClassName('created')
  while(elements.length > 0) {
    elements[0].remove();
  }
}
