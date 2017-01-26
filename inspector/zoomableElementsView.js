'use strict';

import * as helper from './helper.js';
import ZoomableView from './zoomableView.js';

export default class ZoomableElementsView extends ZoomableView {
  
  constructor(inspectorContent, originalParent, originalElements, hierarchyLevel=undefined) {
    super(inspectorContent, originalParent, originalElements, hierarchyLevel);
    
    this._currentlyZoomed = false;
  }
  
  _create(originalParent, originalElements) {
    super._create(originalParent, originalElements);
    
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
  
  _isHighestElementOfHierarchy(element) {
    return element.parentElement == this._inspectorContent.querySelector('#created--root');
  }
  
  _increaseElement(element) {
    let allParentElements = jQuery(element).parents('.created');
    let allChildElemets = jQuery(element).find('.created');
    let allElements = $.merge(allParentElements, allChildElemets);
    let elementsToZoom = $.merge([element], allElements);
    
    this._zoom(elementsToZoom);
    this._currentlyZoomed = true;
  }
  
  _decreaseElement(element) {
    this._undoZoom(element, element.children.length > 0);
    this._currentlyZoomed = false;
  }
}