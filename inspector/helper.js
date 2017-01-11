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

function getRandomId() {
  return 'id-' + Math.random().toString(36).substr(2, 16);
}

// Functions for correct placement

function getDistanceValue() {
  return 20;
}

function copySpacing(newElement, originalElement) {
  newElement.style.padding = jQuery(originalElement).css('padding');
  newElement.style.margin = jQuery(originalElement).css('margin');
}

function copySize(newElement, originalElement) {
  newElement.style.width = originalElement.offsetWidth + 'px';
  newElement.style.height = originalElement.offsetHeight + 'px';
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
