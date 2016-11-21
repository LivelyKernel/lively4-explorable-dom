var count = 1;
var maxCount = 1;

function showZoomView() {
  var elements = document.getElementsByClassName('created');
  
  for(let i = 0; i < elements.length; i++){
    elements[i].style.position = 'relative';
    
    if(elements[i].children.length > 0) {
      var hierarchyLevel = countHierarchyLevel(elements[i].children);
      
      maxCount = 1;
    }
  }
  
} 

function countHierarchyLevel(elements) {
  for(let j = 0; j < elements.length; j++){
    if(elements[j].children.length > 0) {
      count++;
      if(maxCount < count) {
        maxCount = count;
      }
      countHierarchyLevel(elements[j].children);
    }
    count--;
  }
  return maxCount;
}

function whatever(element){
  if(elements[i].children.length > 0) {
      elements[i].style.height += 20 + 'px';
      elements[i].style.width += 20 + 'px';
    }
}