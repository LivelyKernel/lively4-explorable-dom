var count = 1;
var maxCount = 1;

function showZoomView() {
  setOpacity(0.1);
  var elements = document.getElementsByClassName('created');
  
  // Take care that all elements are shown if it was not done before
  if(elements.length === 0) {
    showContainer();
    showAllHierarchyLevels();
    disableNextHierarchyButton(true);
  }
  
  for(let i = 0; i < elements.length; i++){
    // Change styling
    elements[i].style.position = 'relative';
    elements[i].style.top = parseInt(elements[i].style.top, 10) - 20 + 'px';
    
    if(elements[i].children.length > 0) {
      var hierarchyLevel = countHierarchyLevel(elements[i].children);
      increaseByHierarchyLevel(elements[i], hierarchyLevel);
      
      elements[i].style.padding = '20px';
      
      // Reset counters
      maxCount = 1;
      count = 1;
    }
  }
  
  // Adapt slider position
  document.getElementById('slider').value = 2;
  
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
  element.style.height = element.clientHeight + factor * 50 + 'px';
  element.style.width = element.clientWidth + factor * 50 + 'px';
}