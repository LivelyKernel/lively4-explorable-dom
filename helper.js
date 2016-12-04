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
  return childs;
}

function rotateDom(x) {
  var content = document.getElementById('main-content');
  content.style.transform = "rotateY("+x+"deg )";
}

function disableShowContainerButton(expr) {
  document.getElementById('showContainerButton').disabled = expr;
}

function disableNextHierarchyButton(expr) {
  document.getElementById('nextHierarchyLevelButton').disabled = expr;
}

function disableHideContainerButton(expr) {
  document.getElementById('hideContainerButton').disabled = expr;
}

function setOpacity(value) {
  document.getElementById('main-content').style.opacity = value;
}

function getRandomId() {
  return 'id-' + Math.random().toString(36).substr(2, 16);
}

function getDistanceValue() {
  return 20;
}

function getAllCreatedElements() {
  return document.getElementsByClassName('created');
}

// ---------------------



// Go through DOM and count hierarchy levels
function countHierarchyLevel(elements) {
  for(let j = 0; j < elements.length; j++){
    // If there are children count up and go through them too
    if(elements[j].children.length > 0) {
      count++;
      if(maxCount < count) {
        maxCount = count;
      }
      countHierarchyLevel(elements[j].children);
    }
    
    // To avoid doubled counts when both multiple siblings have children
    count--;
  }
  return maxCount;
}
