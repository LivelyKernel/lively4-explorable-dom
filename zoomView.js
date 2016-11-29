var count = 1;
var maxCount = 1;

function showZoomView() {
  setOpacity(0.1);
  var elements = getAllCreatedElements();
  
  // Take care that all elements are shown if it was not done before
  if(elements.length === 0) {
    showContainer();
    showAllHierarchyLevels();
    disableNextHierarchyButton(true);
  }
  
  for(let i = 0; i < elements.length; i++){
    // Change styling
    elements[i].style.position = 'relative';
    elements[i].style.top = 0;
    elements[i].style.pointerEvents = 'auto';
    
    if(elements[i].children.length > 0) {
      var numberOfChildren = jQuery(elements[i]).find('.created').length;
      increaseByHierarchyLevel(elements[i], numberOfChildren, true);
      
      // Reset counters
      maxCount = 1;
      count = 1;
    } else {
      increaseByHierarchyLevel(elements[i], 1, false);
    }
    
    elements[i].style.padding = getDistanceValue() + 'px';
    elements[i].style.margin = getDistanceValue() + 'px';
    
    elements[i].onmouseover = function(){
      handleMouseOver(event, elements[i]);
    }
    elements[i].onmouseleave = function(){
      handleMouseLeave(event, elements[i]);
    }
    elements[i].onmouseenter = function(){
      //handleMouseEnter(elements[i]);
    }
  }
  
  // Adapt slider position
  document.getElementById('slider').value = 2;
  
} 

function increaseByHierarchyLevel(element, numberOfChildren, isParent)  {
  if (isParent) {
    // Increase by number of children + own increasement + cancel out padding&margin of the child elements
    element.style.height = element.clientHeight + 
      (numberOfChildren + 1) * getDistanceValue() + 
      numberOfChildren * 4 * getDistanceValue() 
      + 'px';
    element.style.width = element.clientWidth + 
      (numberOfChildren + 1) * getDistanceValue() + 
      numberOfChildren * 4 * getDistanceValue() + 
      'px';
  }
  else {
    element.style.height = element.clientHeight + numberOfChildren * getDistanceValue() + 'px';
    element.style.width = element.clientWidth + numberOfChildren * getDistanceValue() + 'px';
  }
}

//
// Hover functionality
//

function handleMouseOver(e, element) {
  e.stopPropagation();
  
  var allParentElements = jQuery(element).parents('.created');
  var allChildElemets = jQuery(element).find('.created');
  var allElements = $.merge(allParentElements, allChildElemets);
  for(let i = 0; i < allElements.length; i++) {
    allElements[i].style.backgroundColor = 'white';
  }
  
  element.style.backgroundColor = 'lightgrey';
}

function handleMouseLeave(e, element) {
  e.stopPropagation();
  
  allElements = getAllCreatedElements();
  for(let i = 0; i < allElements.length; i++) {
    allElements[i].style.backgroundColor = 'initial';
  }
  
  var infoLabels = document.getElementsByClassName("infoLabel");
  for(let i = infoLabels.length - 1; 0 <= i; i--) {
    if(infoLabels[i] && infoLabels[i].parentElement) {
      infoLabels[i].parentElement.removeChild(infoLabels[i]);
    }
  }
}

function handleMouseEnter(element) {
  var originalElement = document.getElementById(element.dataset.id);
  var additionalInfoLabel = document.createElement('label');
  
  additionalInfoLabel.classList += 'infoLabel';
  additionalInfoLabel.innerHTML = originalElement.tagName;
  additionalInfoLabel.innerHTML += element.dataset.id;
  
  element.appendChild(additionalInfoLabel);
}
