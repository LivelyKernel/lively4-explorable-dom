'use strict';

import * as helper from './helper.js';

export default class ContainerView {
  
  constructor(originalDom, initialParent, originalElements) {
    
    this._originalDom = originalDom;
    this._showedLevel = 0;
    this._maxNestedLevel = 0;
    
    this._create(initialParent, originalElements);
  }
  
  getShowedLevel() {
    return this._showedLevel;
  }
  
  getMaxNestedLevel() {
    return this._maxNestedLevel;
  }
  
  getAllCreatedElements() {
    return this._originalDom.getElementsByClassName('created');
  }
  
  _create(initialParent, originalElements) {
    for (let i = 0; i < originalElements.length; i++) {
      if (originalElements[i].tagName != 'SCRIPT' && originalElements[i].tagName != 'LINK') {
        this._copyElement(initialParent, originalElements[i]);
      }
    }
  }
  
  _copyElement(parentElement, element, nested = false, nestingLevel = 0) {
    let newElement = this._originalDom.createElement('div');
    
    // Set style information for the new element
    newElement.style.borderColor = helper.getRandomColor();
    newElement.style.borderWidth = '2px';
    newElement.style.borderStyle = 'solid';
    newElement.style.top = element.getBoundingClientRect().top - parentElement.getBoundingClientRect().top + 'px';
    newElement.style.left = element.getBoundingClientRect().left - parentElement.getBoundingClientRect().left + 'px';
    newElement.style.width = element.offsetWidth + 'px';
    newElement.style.height = element.offsetHeight + 'px';
    newElement.style.position = 'absolute';
    newElement.style.opacity = '1';
    let style =  window.getComputedStyle(element, null).display;
    if ((style == 'inline-block') || (style == 'block') || (style == 'inline')) {
       newElement.style.display = style;
    } else if (style.substring(0,5) == 'table') {
      newElement.style.display = 'inline-block';
    }else {
      newElement.style.display = 'block';
    }
    
    // Child elements are hidden by default --> only first hierarchy level is shown
    if(nested) {
      newElement.style.visibility = 'hidden';
      newElement.classList.add('nested_' + nestingLevel);
    }
    
    newElement.innerHTML += element.tagName;
    newElement.classList.add('created');
    
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
  
    let context = this;
    newElement.onmouseover = function() {
      context._handleMouseOver(event, newElement);
    };
    newElement.onmouseleave = function() {
      context._handleMouseLeave(event, newElement);
    };
    newElement.onmouseenter = function() {
      //handleMouseEnter(elements[i]);
    };

  }
  
  zoom(elements) {
    let maxCount = 1;
    let count = 1;
    
    for(let i = 0; i < elements.length; i++){
      // Change styling
      elements[i].style.position = 'relative';
      elements[i].style.top = 0;
      
      if(elements[i].children.length > 0) {
        let numberOfChildren = jQuery(elements[i]).find('.created').length;
        this._increaseByHierarchyLevel(elements[i], numberOfChildren, true);
        
        // Reset counters
        maxCount = 1;
        count = 1;
      } else {
        this._increaseByHierarchyLevel(elements[i], 1, false);
      }
      
      elements[i].style.padding = this._getDistanceValue() + 'px';
      elements[i].style.margin = this._getDistanceValue() + 'px';
    }
  }
  
  deleteElements() {
    let elements = this.getAllCreatedElements();
    while(elements.length > 0) {
      elements[0].remove();
    }
    
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
    
    if(!this._isZoomed){
      var elementsToZoom = $.merge(allElements, [element]);
       this.zoom(elementsToZoom); 
    }
     
    for(let i = 0; i < allElements.length; i++) {
      allElements[i].style.backgroundColor = 'white';
    }
    
    element.style.backgroundColor = 'lightgrey';
  }
  
  _handleMouseLeave(e, element) {
    e.stopPropagation();
    
    var allElements = this.getAllCreatedElements();
    for(let i = 0; i < allElements.length; i++) {
      allElements[i].style.backgroundColor = 'initial';
    }
    
    var infoLabels = this._originalDom.getElementsByClassName("infoLabel");
    for(let i = infoLabels.length - 1; 0 <= i; i--) {
      if(infoLabels[i] && infoLabels[i].parentElement) {
        infoLabels[i].parentElement.removeChild(infoLabels[i]);
      }
    }
  }
  
  _handleMouseEnter(element) {
    var originalElement = this._originalDom.getElementById(element.dataset.id);
    var additionalInfoLabel = this._originalDom.createElement('label');
    
    additionalInfoLabel.classList += 'infoLabel';
    additionalInfoLabel.innerHTML = originalElement.tagName;
    additionalInfoLabel.innerHTML += element.dataset.id;
    
    element.appendChild(additionalInfoLabel);
  }
   
   
  //
  // Zoom view helper functions
  //
  
  _increaseByHierarchyLevel(element, numberOfChildren, isParent)  {
    if (isParent) {
      // Increase by number of children + own increasement + cancel out padding & margin of the child elements
      element.style.height = element.clientHeight + 
        (numberOfChildren + 1) * this._getDistanceValue() + 
        numberOfChildren * 4 * this._getDistanceValue() 
        + 'px';
      element.style.width = element.clientWidth + 
        (numberOfChildren + 1) * this._getDistanceValue() + 
        numberOfChildren * 4 * this._getDistanceValue() + 
        'px';
    }
    else {
      element.style.height = element.clientHeight + numberOfChildren * this._getDistanceValue() + 'px';
      element.style.width = element.clientWidth + numberOfChildren * this._getDistanceValue() + 'px';
    }
  }
  
  _getDistanceValue() {
    return 20;
  }
}