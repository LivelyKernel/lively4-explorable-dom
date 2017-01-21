'use strict';

import * as helper from './helper.js';
import ContainerView from './containerView.js';

export default class ZoomView extends ContainerView {
  
  constructor(inspectorContent, originalParent, originalElements) {
    super(inspectorContent, originalParent, originalElements);
    
    this._currentlyZoomed = false;
    
    let elements = this._getAllCreatedElements();
    this._bindZoomEventHandlers(elements);
  }
  
  _handleMouseOver(e, element) {
    super._handleMouseOver(e, element);
    
    // Increase elements
    if(!this._currentlyZoomed && this._isHighestElementOfHierarchy(element)){
      this._increaseElement(element);
    }
  }
  
  _handleMouseLeave(e, element, allElements) {
    super._handleMouseLeave(e, element, allElements);
    
    // Decrease elements again
    if(this._currentlyZoomed && this._isHighestElementOfHierarchy(element)) {
      this._decreaseElement(element);
    }
  }
  
  _increaseElement(element) {
    let allParentElements = jQuery(element).parents('.created');
    let allChildElemets = jQuery(element).find('.created');
    let allElements = $.merge(allParentElements, allChildElemets);
    let elementsToZoom = $.merge([element], allElements);
    
    this.zoom(elementsToZoom);
    this._currentlyZoomed = true;
  }
  
  _decreaseElement(element) {
    this._undoZoom(element, element.children.length > 0);
    this._currentlyZoomed = false;
  }
}