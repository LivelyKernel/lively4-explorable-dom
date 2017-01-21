'use strict';

import * as helper from './helper.js';

export default class ContainerView {
  
  constructor(inspectorContent, originalParent, originalElements) {
    this._inspectorContent = inspectorContent;
    this._showedLevel = 0;
    this._maxNestedLevel = 0;
    
    this._create(originalParent, originalElements);
  }
  
  getShowedLevel() {
    return this._showedLevel;
  }
  
  getMaxNestedLevel() {
    return this._maxNestedLevel;
  }
  
  showElements(elements) {
    for(let i = 0; i < elements.length; i++) {
      elements[i].style.visibility = 'visible';
    }
  }
  
  showNextHierarchyLevel(allElements) {
    // Find all elements with desired level and show them
    let elements = jQuery(allElements).find('.nested_' + (this._showedLevel + 1));
    if(elements.length > 0) {
      this.showElements(elements);
      this._showedLevel += 1;
    }
  }
  
  deleteElements() {
    this._inspectorContent.querySelector('#created--root').remove();
    
    this._showedLevel = 0;
    this._maxNestedLevel = 0;
  }
  
  _create(originalParent, originalElements) {
    // Create a new div with the position and size of the original container.
    // This div will be used as new root and is absolutely positioned. Thus it 
    // is easier to position the actual elements correctly.
    var newParent = document.createElement('div');
    newParent.id = 'created--root';
    helper.copySpacing(newParent, originalParent);
    helper.copySize(newParent, originalParent);
    
    this._inspectorContent.appendChild(newParent);
    
    for (let i = 0; i < originalElements.length; i++) {
      if (originalElements[i].tagName != 'SCRIPT' && originalElements[i].tagName != 'LINK') {
        this._copyElement(newParent, originalElements[i]);
      }
    }
  }
  
  _copyElement(parentElement, element, nested = false, nestingLevel = 0, fixedPosition = false) {
    let newElement = document.createElement('div');
    
    // Set style information for the new element
    helper.copySpacing(newElement, element);
    newElement.style.border = '1px solid' + helper.getRandomColor();
    newElement.style.display =  window.getComputedStyle(element, null).display;
    newElement.classList.add('created');
    
    // Child elements are hidden by default --> only first hierarchy level is shown
    if(nested) {
      newElement.style.visibility = 'hidden';
      newElement.classList.add('nested_' + nestingLevel);
    }
    
    if(element.id === "") {
      element.id = helper.getRandomId();
    }
    newElement.dataset.id = element.id;
    
    // This is a really ugly hack to get only the text of the actual element
    let text = jQuery(element).clone().children().remove().end().text().trim();
    newElement.dataset.content = (text.length > 0) ? text : element.tagName;
    parentElement.appendChild(newElement);
    
    // Only the last children of the hierarchy and element with text inside need an actual sizement.
    // All other elements are sized by their children
    if(element.children.length === 0 || text.length !== 0 ) {
      helper.copySize(newElement, element);
    }
    
    // Elements whose parent has some text inside need a concrete positioning. 
    // Because we do not copy the text the position gets lost.
    if(fixedPosition) {
      helper.copyPosition(newElement, element, parentElement);
    }
    
    // Keep hierarchy information by adding child elements recursively 
    if(element.children.length > 0) {
      nestingLevel += 1;
      
      for(let j = 0; j <  element.children.length; j++) {
        this._copyElement(newElement, element.children[j], true, nestingLevel, text.length !== 0);
      }
    }
    
    if (nestingLevel > this._maxNestedLevel) {
      this._maxNestedLevel = nestingLevel;
    } 
  
    // Add click handler
    let context = this;
    newElement.onclick = function(e) {
      context._handleOnClick(e, newElement, element);
    }
  }
  
  _getAllCreatedElements() {
    return this._inspectorContent.getElementsByClassName('created');
  }
  
  _zoom(elements) {
    let maxCount = 1;
    let count = 1;
    
    for(let i = 0; i < elements.length; i++){
      if(elements[i].children.length > 0) {
        let numberOfChildren = jQuery(elements[i]).find('.created').length;
        this._increaseByHierarchyLevel(elements[i], numberOfChildren, true);
        
        // Reset counters
        maxCount = 1;
        count = 1;
      } else {
        this._increaseByHierarchyLevel(elements[i], 1, false);
      }
    }
  }
  
  _undoZoom(element, isParent) {
    // Resize element to its original size
    let tmp = jQuery(element).find('.created').length;
    let numberOfChildren = tmp > 0 ? tmp : 1 ;
    
    this._decreaseByHierarchyLevel(element, isParent);
    
    // Resize all child elements
    if(element.children.length > 0) {
      for (let i = 0; i < element.children.length; i++) {
        this._undoZoom(element.children[i], element.children[i].children.length > 0);
      }
    }
  }
  
  _bindZoomEventHandlers(elements) {
    // Define event handlers for the created elements
    let context = this;
    for(let i = 0; i < elements.length; i++) {
      elements[i].addEventListener('mouseover', function(e) {
        context._handleMouseOver(e, elements[i]);
      });
      elements[i].addEventListener('mouseleave', function(e) {
        context._handleMouseLeave(e, elements[i], elements);
      });
    }
  }
  
  //
  // Mouse handlers
  //
  _handleMouseOver(e, element) {
    e.stopPropagation();
    
    let allParentElements = jQuery(element).parents('.created');
    let allChildElemets = jQuery(element).find('.created');
    let allElements = $.merge(allParentElements, allChildElemets);
     
    // Highlighting 
    for(let i = 0; i < allElements.length; i++) {
      allElements[i].style.backgroundColor = 'white';
    }
    element.style.backgroundColor = 'lightgrey';
  }
  
  _handleMouseLeave(e, element, allElements) {
    e.stopPropagation();
    
    // Reset highlighting
    for(let i = 0; i < allElements.length; i++) {
      allElements[i].style.backgroundColor = 'initial';
    }
  }
   
  //
  // Zoom helper functions
  //
  _increaseByHierarchyLevel(element, numberOfChildren, isParent)  {
    if (isParent) {
      // Increase by number of children + own increasement + cancel out padding of the child elements
      // The original element is necessary here because child elements increase automatically 
      // with their parents. Thus they would be way to big.
      let originalElement = this._inspectorContent.querySelector('#' + element.dataset.id);
      element.style.height = parseFloat(originalElement.offsetHeight) + 
        (numberOfChildren + 1) * helper.getDistanceValue() + 
        numberOfChildren * 3 * helper.getDistanceValue() +
        'px';
      element.style.width = parseFloat(originalElement.offsetWidth) + 
        (numberOfChildren + 1) * helper.getDistanceValue() + 
        numberOfChildren * 3 * helper.getDistanceValue() + 
        'px';
    }
    else {
      element.style.height = parseInt(element.style.height, 10) + 2 * helper.getDistanceValue() + 'px';
      element.style.width = parseInt(element.style.width, 10) + 2 * helper.getDistanceValue() + 'px';
    }
    
    var paddingValue = parseInt(element.style.padding, 10);
    if (paddingValue < 20 ) {
      element.style.padding = helper.getDistanceValue() + 'px';
    } 
  }
  
  _decreaseByHierarchyLevel(element, isParent)  {
    let originalElement = this._inspectorContent.querySelector('#' + element.dataset.id);
    let text = jQuery(originalElement).clone().children().remove().end().text().trim();
    if (isParent) {
      // Since parent elements did not have an inital size 
      // it is sufficient to remove the computed value here. 
      element.style.removeProperty('height');
      element.style.removeProperty('width');
    }
    
    if(element.children.length === 0 || text.length !== 0 ) {
      helper.copySize(element, originalElement);
    }
    
    // Reset the added padding
    helper.copySpacing(element, originalElement);
  }
  
  //
  // Click handlers
  //
  _handleOnClick(e, newElement, originalElement) {
    // Pass click event
    originalElement.click();
    
    // Highlight original element 
    originalElement.style.backgroundColor = 'red';
    window.setTimeout(function(){
      originalElement.style.backgroundColor = 'initial';
    }, 1000);
  }
}
