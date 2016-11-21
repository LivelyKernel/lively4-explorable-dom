var count = 1;
var maxCount = 1;

function showZoomView() {
  setOpacity(0.1);
  var elements = document.getElementsByClassName('created');
  
  for(let i = 0; i < elements.length; i++){
    // Change styling
    elements[i].style.position = 'relative';
    elements[i].style.top = elements[i].style.top - 20;
    
    if(elements[i].children.length > 0) {
      var hierarchyLevel = countHierarchyLevel(elements[i].children);
      increaseByHierarchyLevel(elements[i], hierarchyLevel);
      
      elements[i].style.padding = '10px';
      
      // Reset counters
      maxCount = 1;
      count = 1;
    }
  }
  
} 

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

function increaseByHierarchyLevel(element, factor){
  element.style.height = element.clientHeight + factor * 40 + 'px';
  element.style.width = element.clientWidth + factor * 40 + 'px';
}