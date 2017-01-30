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
  
  // Handle addtional spacing made by inline elements
  if(jQuery(originalElement).css('display') === 'inline') {
    jQuery(newElement).css('margin-right', function (index, currentValue) {
      return parseInt(currentValue, 10) + 4 + 'px';
    });
    jQuery(newElement).css('margin-left', function (index, currentValue) {
      return parseInt(currentValue, 10) + 4 + 'px';
    });
  }
  
  // To add further spacings, add the name to additionalSpacings 
  // and the corresponding style name to traditionalSpacings.
  // Take care that the index is the same!
  
  var additionalSpacings = ['-webkit-margin-before', '-webkit-margin-after', '-webkit-margin-start', '-webkit-margin-end', '-webkit-padding-before', '-webkit-padding-after', '-webkit-padding-start', '-webkit-padding-end', '-webkit-border-horizontal-spacing', '-webkit-border-vertical-spacing'];
  
  var traditionalSpacings = ['marginTop', 'marginBottom', 'marginLeft', 'marginRight', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'webkitBorderHorizontalSpacing', 'webkitBorderVerticalSpacing'];
  
  if(additionalSpacings.length === traditionalSpacings.length) {
    for(let i = 0; i < additionalSpacings.length; i++) {
      if(jQuery(originalElement).css(additionalSpacings[i]) !== '0px') {
        newElement.style[traditionalSpacings[i]] += 
          jQuery(originalElement).css(additionalSpacings[i]);
      }
    }
  }
  else {
    console.log('Error while adding the spacings');
  }
}

function copySize(newElement, originalElement) {
  newElement.style.width = parseFloat(originalElement.offsetWidth) + 'px';
  newElement.style.height = parseFloat(originalElement.offsetHeight) + 'px';
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
