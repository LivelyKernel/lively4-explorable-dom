function getColourFromInt(int){
  var colors = ['blue', 'red', 'green', 'black', 'orange', 'brown', 'cyan', 'magenta'];
  
  var pointer = int % colors.length;
  return colors[pointer];
 }

function getRandomId() {
  return 'id-' + Math.random().toString(36).substr(2, 16);
}

function getCreatedRootSelector() {
  return 'created--root';
}

// Methods for correct placement

function getDistanceValue() {
  return 20;
}

function copySpacing(newElement, originalElement) {
  newElement.style.padding = jQuery(originalElement).css('padding');
  newElement.style.margin = jQuery(originalElement).css('margin');
  
  var webkitSpacings = ['-webkit-margin-before', '-webkit-margin-after', '-webkit-margin-start', '-webkit-margin-end', '-webkit-padding-before', '-webkit-padding-after', '-webkit-padding-start', '-webkit-padding-end'];
  
  webkitSpacings.forEach(function(webkitSpacing) {
    switch(webkitSpacing) {
      case '-webkit-margin-before':
        newElement.style.marginTop += jQuery(originalElement).css(webkitSpacing); 
        break;
      case '-webkit-margin-after':
        newElement.style.marginBottom += jQuery(originalElement).css(webkitSpacing); 
        break;
      case '-webkit-margin-start':
        newElement.style.marginLeft += jQuery(originalElement).css(webkitSpacing); 
        break;
      case '-webkit-margin-end':
        newElement.style.marginRight += jQuery(originalElement).css(webkitSpacing); 
        break;
      case '-webkit-padding-before':
        newElement.style.paddingTop += jQuery(originalElement).css(webkitSpacing); 
        break;
      case '-webkit-padding-after':
        newElement.style.paddingBottom += jQuery(originalElement).css(webkitSpacing); 
        break;
      case '-webkit-padding-start':
        newElement.style.paddingLeft += jQuery(originalElement).css(webkitSpacing); 
        break;
      case '-webkit-padding-end':
        newElement.style.paddingRight += jQuery(originalElement).css(webkitSpacing); 
        break;
      default: 
        console.log('Error while adding the webkit spacings');
    }
  });
}

function copySize(newElement, originalElement) {
  newElement.style.width = parseFloat(originalElement.offsetWidth) - 1 + 'px';
  newElement.style.height = parseFloat(originalElement.offsetHeight) - 1 + 'px';
  if(newElement.style.display === 'inline' || newElement.style.display === '') {
    newElement.style.display = 'inline-block';
  }
}

function copyPosition(newElement, originalElement, parentElement) {
  newElement.style.position = 'relative';
  newElement.style.top = originalElement.getBoundingClientRect().top - 
                         parentElement.getBoundingClientRect().top + 
                         'px';
  newElement.style.left = originalElement.getBoundingClientRect().left -
                          parentElement.getBoundingClientRect().left -
                          newElement.offsetLeft + parentElement.offsetLeft + 
                          'px';
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
