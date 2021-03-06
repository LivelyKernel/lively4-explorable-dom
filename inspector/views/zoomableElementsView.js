'use strict';

import ZoomableView from './zoomableView.js';

export default class ZoomableElementsView extends ZoomableView {
  
  constructor(inspectorContent, originalParent, originalElements, hierarchyLevel=undefined) {
    super(inspectorContent, originalParent, originalElements, hierarchyLevel);
    
    this._viewType = 'zoomableElements';
    this._currentlyZoomed = false;
  }
  
  _create(originalParent, originalElements) {
    super._create(originalParent, originalElements);
    
    let elements = this._getAllToolElements();
    this._bindZoomEventHandlers(elements);
  }
  
  _elementContentText(element) {
    return element.dataset.tagName;
  }
  
  _removeContentFromElement(element) {
    let brElements = element.getElementsByTagName('br');
    for (let i = brElements.length - 1; i >= 0; i--) {
        brElements[i].parentNode.removeChild(brElements[i]);
    }
    jQuery(element).contents().filter(function() {
      return this.nodeType === 3; // TEXT_NODE
    }).remove();
  }
  
  _undoZoom(element, isParent) {
    // Remove the created labels
    this._removeContentFromElement(element);
    
    // Resize element to its original size
    let tmp = element.getElementsByClassName(this._toolElementsClassName()).length;
    let numberOfChildren = tmp > 0 ? tmp : 1 ;
    
    this._decreaseByHierarchyLevel(element, isParent);
    
    // Resize all child elements
    if(element.children.length > 0) {
      for (let i = 0; i < element.children.length; i++) {
        this._undoZoom(element.children[i], element.children[i].children.length > 0);
      }
    }
    
    // Undo the workaround of handling of table row elements
    let originalElement = this._inspectorContent.querySelector('#' + element.dataset.id);
    let originalElementDisplayValue = jQuery(originalElement).css('display');
    if(element.style.display === 'block' && originalElementDisplayValue.startsWith('table-row')) {
      element.style.display = originalElementDisplayValue;
    }
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
    return element.parentElement == this._inspectorContent.querySelector('#' + this._toolElementsRootId());
  }
  
  _increaseElement(element) {
    let allParentElements = jQuery(element).parents('.' + this._toolElementsClassName());
    let allChildElements = jQuery(element).find('.' + this._toolElementsClassName());
    let allElements = jQuery.merge(allParentElements, allChildElements);
    let elementsToZoom = jQuery.merge([element], allElements);
    
    this._zoom(elementsToZoom);
    this._addContentToElements(elementsToZoom);
    this._currentlyZoomed = true;
  }
  
  _decreaseElement(element) {
    this._undoZoom(element, element.children.length > 0);
    this._currentlyZoomed = false;
  }
}