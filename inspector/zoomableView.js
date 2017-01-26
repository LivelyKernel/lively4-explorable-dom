'use strict';

import * as helper from './helper.js';
import ContainerView from './containerView.js';

export default class ZoomableView extends ContainerView {
  
  _addContentToElements(elements) {
    for(let i = 0; i < elements.length; i++) {
      var br = document.createElement('br');
      elements[i].prepend(br);
      elements[i].insertAdjacentHTML('afterbegin', elements[i].dataset.content);
    } 
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
    let allChildElements = jQuery(element).find('.created');
    let allElements = jQuery.merge(allParentElements, allChildElements);
     
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
}