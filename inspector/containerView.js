'use strict';

import * as helper from './helper.js';

export default class ContainerView {
  
  constructor(originalDom, initialParent, originalElements) {
    
    this._originalDom = originalDom;
    this._showedLevel = 0;
    this._maxNestedLevel = 0;
    this._isSingleZoom = false;
    this.isGlobalZoom = false;
    this.isZoomable = false;
    
    this._create(initialParent, originalElements);
  }
  
  getShowedLevel() {
    return this._showedLevel;
  }
  
  getMaxNestedLevel() {
    return this._maxNestedLevel;
  }
  
  getAllCreatedElements() {
    return this._originalDom.getElementsByClassName('created')
  }
  
  _create(initialParent, originalElements) {
    // Create a new div with the position and size of the original container.
    // This div will be used as new root and is absolutely positioned. Thus it 
    // is easier to position the actual elements correctly.
    var newParent = document.createElement('div');
    newParent.id = 'created--root';
    newParent.style.position = 'absolute';
    newParent.style.top = '0px';
    newParent.style.left = '0px';
    helper.copySpacing(newParent, initialParent);
    helper.copySize(newParent, initialParent);
    
    this._originalDom.querySelector('#inspector-content').appendChild(newParent);
    
    for (let i = 0; i < originalElements.length; i++) {
      if (originalElements[i].tagName != 'SCRIPT' && originalElements[i].tagName != 'LINK') {
        this._copyElement(newParent, originalElements[i]);
      }
    }
  }
  
  _copyElement(parentElement, element, nested = false, nestingLevel = 0) {
    let newElement = document.createElement(element.tagName);
    
    // Set style information for the new element
    helper.copySpacing(newElement, element);
    newElement.style.border = '1px solid' + helper.getRandomColor();
    newElement.style.backgroundColor = 'transparent';
    newElement.style.opacity = '1';
    newElement.style.display =  window.getComputedStyle(element, null).display;
    newElement.classList.add('created');
    
    // TODO: move to an extra css file once it is possible to add new files to lively again
    newElement.style.boxSizing = 'border-box';
    
    // Only the last children of the hierarchy need an actual sizement. 
    // All other elements are sized by their children
    if(helper.getDirectChildNodes(element).length === 0) {
      helper.copySize(newElement, element);
    }
    
    // Child elements are hidden by default --> only first hierarchy level is shown
    if(nested) {
      newElement.style.visibility = 'hidden';
      newElement.classList.add('nested_' + nestingLevel);
    }
    
    if(element.id === "") {
      element.id = helper.getRandomId();
    }
    newElement.dataset.id = element.id;
    
    parentElement.appendChild(newElement);
    
    
    // Keep hierarchy information by adding child elements recursively 
    if(element.children.length > 0) {
      let childNodes = helper.getDirectChildNodes(element);
      nestingLevel += 1;
      
      for(let j = 0; j < childNodes.length; j++) {
        this._copyElement(newElement, childNodes[j], true, nestingLevel);
      }
    }
    
    if (nestingLevel > this._maxNestedLevel) {
      this._maxNestedLevel = nestingLevel;
    } 
  
    // Click handler
    let context = this;
    newElement.onclick = function() {
      context._handleOnClick(event, newElement, element);
    }

  }
  
  zoom(elements) {
    if(!this.isZoomable) {
      this.makeElementsZoomable();
    }
    
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
  
  makeElementsZoomable() {
    // Event handlers for the created Elements
    let newElements = this.getAllCreatedElements(); 
    let context = this;
    
    for(let i = 0; i < newElements.length; i++) {
      newElements[i].onmouseover = function() {
        context._handleMouseOver(event, newElements[i]);
      };
      newElements[i].onmouseleave = function() {
        context._handleMouseLeave(event, newElements[i]);
      };
    }
    this.isZoomable = true;
  }
  
  deleteElements() {
    let elements = this.getAllCreatedElements();
    while(elements.length > 0) {
      elements[0].remove();
    }
    this._originalDom.querySelector('#created--root').remove();
    
    this._showedLevel = 0;
    this._maxNestedLevel = 0;
  }
  
  showNextHierarchyLevel() {
    let elements = jQuery(this.getAllCreatedElements()).find('.nested_' + (this._showedLevel + 1));
    
    // Find all elements with desired level and show them
    if(elements.length > 0) {
      for(let i = 0; i < elements.length; i++) {
        elements[i].style.visibility = 'visible';
      }
      this._showedLevel += 1;
    }
  }
  
  showAllHierarchyLevels() {
    let elements = this.getAllCreatedElements();
    for(let i = 0; i < elements.length; i++) {
      elements[i].style.visibility = 'visible';
    }
  }
  
    
  //
  // Zoom view hover functionality
  //
  
  _handleMouseOver(e, element) {
    e.stopPropagation();
    
    let allParentElements = jQuery(element).parents('.created');
    let allChildElemets = jQuery(element).find('.created');
    let allElements = $.merge(allParentElements, allChildElemets);
    
    // Increase elements
    if(!this._isSingleZoom && !this.isGlobalZoom && this._isHighestElementOfHierarchy(element)){
      var elementsToZoom = $.merge([element], allElements);
      this.zoom(elementsToZoom); 
      this._isSingleZoom = true;
    }
     
    // Highlighting 
    for(let i = 0; i < allElements.length; i++) {
      allElements[i].style.backgroundColor = 'white';
    }
    element.style.backgroundColor = 'lightgrey';
  }
  
  _handleMouseLeave(e, element) {
    e.stopPropagation();
    
    // Reset highlighting
    var allElements = this.getAllCreatedElements();
    for(let i = 0; i < allElements.length; i++) {
      allElements[i].style.backgroundColor = 'initial';
    }
    
    var infoLabels = this._originalDom.querySelectorAll(".infoLabel");
    for(let i = infoLabels.length - 1; 0 <= i; i--) {
      if(infoLabels[i] && infoLabels[i].parentElement) {
        if (infoLabels[i] != null) {
          infoLabels[i].parentElement.removeChild(infoLabels[i]);
        }
      }
    }
    
    // Decrease elements again
    if(this._isHighestElementOfHierarchy(element) && this._isSingleZoom) {
      this._undoZoom(element, helper.getDirectChildNodes(element).length > 0);
      this._isSingleZoom = false;
    }
  }
   
   
  //
  // Zoom view helper functions
  //
  
  _increaseByHierarchyLevel(element, numberOfChildren, isParent)  {
    if (isParent) {
      // Increase by number of children + own increasement + cancel out padding of the child elements
      // The original element is necessary here because child elements increase automatically 
      // with their parents. Thus they would be way to big.
      let originalElement = this._originalDom.querySelector('#' + element.dataset.id);
      element.style.height = originalElement.offsetHeight + 
        (numberOfChildren + 1) * helper.getDistanceValue() + 
        numberOfChildren * 3 * helper.getDistanceValue() +
        'px';
      element.style.width = originalElement.offsetWidth + 
        (numberOfChildren + 1) * helper.getDistanceValue() + 
        numberOfChildren * 3 * helper.getDistanceValue() + 
        'px';
    }
    else {
      element.style.height = parseInt(element.style.height, 10) + 2 * helper.getDistanceValue() + 'px';
      element.style.width = parseInt(element.style.width, 10) + 2 * helper.getDistanceValue() + 'px';
    }
    element.style.padding = helper.getDistanceValue() + 'px';
  }
  
  _decreaseByHierarchyLevel(element, numberOfChildren, isParent)  {
    if (isParent) {
      // Since parent elements did not have an inital size 
      // it is sufficient to remove the computed value here. 
      element.style.removeProperty('height');
      element.style.removeProperty('width');
    }
    else {
      element.style.height = parseInt(element.style.height, 10) - 2 * helper.getDistanceValue() + 'px';
      element.style.width = parseInt(element.style.width, 10) - 2 * helper.getDistanceValue() + 'px';
    }
    element.style.removeProperty('padding');
  }
  
  _undoZoom(element, isParent) {
    // Resize element to its original size
    let tmp = jQuery(element).find('.created').length;
    let numberOfChildren = tmp > 0 ? tmp : 1 ;
    
    this._decreaseByHierarchyLevel(element, numberOfChildren, isParent);
    
    // Resize all child elements
    let childElements = helper.getDirectChildNodes(element);
    if( childElements.length > 0) {
      for (let i = 0; i < childElements.length; i++) {
        let isChildParentItself = helper.getDirectChildNodes(childElements[i]).length > 0;
        this._undoZoom(childElements[i], isChildParentItself);
      }
    }
  }
  
  _isHighestElementOfHierarchy(element) {
    return element.parentElement == this._originalDom.querySelector('#created--root');
  }
  
  
  //
  // Click handlers
  //
  _handleOnClick(e, newElement, originalElement) {
    // Pass click event
    if(this.isGlobalZoom) {
      // Measure click event of original element
      var start = new Date().getTime();
      originalElement.click();
      var end = new Date().getTime();
      
      // Write the time below the newly created element
      var informationNode = document.createElement('div');
      informationNode.innerHTML = 'Time: ' + (end-start).toString() + ' ms';
      if(originalElement.classList.length > 0) {
        informationNode.innerHTML += ', Class(es): ' + originalElement.classList; 
      }
      if(originalElement.id != undefined) {
        informationNode.innerHTML += ', ID: ' + originalElement.id ;
      }
      informationNode.style.display = "inline-block";
      newElement.parentNode.insertBefore(informationNode, newElement.nextSibling);
      
      // Remove time after a few seconds
      window.setTimeout(function(){
        if (informationNode != null) {
          newElement.parentNode.removeChild(informationNode);
        }
      }, 4000);
    } else {
      originalElement.click();
      
      // Highlight original element 
      originalElement.style.backgroundColor = 'red';
      window.setTimeout(function(){
        originalElement.style.backgroundColor = 'initial';
      }, 1000);
    }
    e.stopPropagation();
  }
}
