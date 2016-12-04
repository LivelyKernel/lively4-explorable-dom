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
    newElement.style.pointerEvents = 'none';
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
}