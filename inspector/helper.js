// Use the same color for the same int (hierarchy level in the view)
function getColourFromInt(int){
  let colors = ['blue', 'red', 'green', 'black', 'orange', 'brown', 'cyan', 'magenta'];
  
  let pointer = int % colors.length;
  return colors[pointer];
}

// Generate (random) ids; used for elements which do not have an id defined
function generateRandomId() {
  return 'id-' + Math.random().toString(36).substr(2, 16);
}

/*
  Helper methods for correct placement of the created tool elements
*/
function copySpacing(newElement, originalElement) {
  newElement.style.padding = jQuery(originalElement).css('padding');
  newElement.style.margin = jQuery(originalElement).css('margin');
  
  // Handle additional spacing made by inline elements
  if(jQuery(originalElement).css('display') === 'inline') {
    jQuery(newElement).css('margin-right', (index, currentValue) => {
      parseInt(currentValue, 10) + 4 + 'px';
    });
    jQuery(newElement).css('margin-left', (index, currentValue) => {
      parseInt(currentValue, 10) + 4 + 'px';
    });
  }

  // To add further spacings, add the name to additionalSpacings and the corresponding style name to traditionalSpacings.
  // Take care that the index is the same!
  let additionalSpacings = ['-webkit-margin-before', '-webkit-margin-after',
  '-webkit-margin-start', '-webkit-margin-end', '-webkit-padding-before',
  '-webkit-padding-after', '-webkit-padding-start', '-webkit-padding-end',
  '-webkit-border-horizontal-spacing', '-webkit-border-vertical-spacing'];
  
  let traditionalSpacings = ['marginTop', 'marginBottom',
  'marginLeft', 'marginRight', 'paddingTop',
  'paddingBottom', 'paddingLeft', 'paddingRight',
  'webkitBorderHorizontalSpacing', 'webkitBorderVerticalSpacing'];
  
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
                          parentElement.getBoundingClientRect().top + 'px';
  newElement.style.left = originalElement.getBoundingClientRect().left -
                          parentElement.getBoundingClientRect().left -
                          newElement.offsetLeft + parentElement.offsetLeft + 'px';
}
