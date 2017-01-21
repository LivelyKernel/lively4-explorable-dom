'use strict';

import ContainerView from './containerView.js';
import CodeView from './codeView.js';
import ZoomView from './zoomView.js';
import ZoomableView from './zoomableView.js';
import * as helper from './helper.js';

export default class ExplorableDomInspector {
  
  constructor(originalDom, inspectorDom) {
    
    this._originalDom = originalDom;
    this._inspectorDom = inspectorDom;
    this._currentView = undefined;
  }
  
  showContainer(type='container') {
    // Create container view (create copied elements, etc.)
    this._createContainer(type);
    
    // Make background less prominent
    this._setOpacity('0.3');
    
    // Prevent user from creating container view twice
    this._disableShowContainerButton(true);
    
    // Enable standard buttons
    this._disableZoomableContainerButton(false);
    this._disableHideContainerButton(false);
    
    // Enable hierarchy button only if there are nested elements
    if(this._currentView.getMaxNestedLevel() > 0) {
      this._disableNextHierarchyButton(false);
    }
    
    if(this._currentView.getShowedLevel() > 0) {
      this._disablePreviousHierarchyButton(false);
    }
    
    // Adapt slider position
    this._setSliderPosition(1);
  }
  
  showPreviousHierarchyLevel() {
    this._currentView.showHierarchyLevel(this._currentView.getShowedLevel() - 1);
  
    this._disableNextHierarchyButton(false);
    
    if(this._currentView.getShowedLevel() === 0) {
      this._disablePreviousHierarchyButton(true);
    }
  }
  
  showNextHierarchyLevel() {
    this._currentView.showHierarchyLevel(this._currentView.getShowedLevel() + 1);
    
    this._disablePreviousHierarchyButton(false);
  
    if(this._currentView.getShowedLevel() === this._currentView.getMaxNestedLevel()) {
      this._disableNextHierarchyButton(true);
    }
  }
  
  zoomableContainer() {
    this._switchContainer('zoomable');
    
    // Adapt navigation buttons
    this._disableZoomableContainerButton(true);
    
    // Adapt slider position
    this._setSliderPosition(2);
  }
  
  zoomContainer() {
    this._switchContainer('zoom');
    
    // Called after the showContainer() method in order to prevent overwriting these settings
    this._setOpacity('0.1');
    this._disableZoomableContainerButton(true);
    this._disableZoomContainerButton(true);
    this._disableCodeContainerButton(false);
    
    // Adapt slider position
    this._setSliderPosition(3);
  }
  
  codeContainer() {
    this._switchContainer('code');
    
    // Called after the showContainer() method in order to prevent overwriting these settings
    this._setOpacity('0.1');
    this._disableZoomableContainerButton(true);
    this._disableCodeContainerButton(true);
    this._disableZoomContainerButton(false);
    
    // Adapt slider position
    this._setSliderPosition(4);
  }
  
  hideContainer() {
    // Reset changes
    if(this._currentView) {
      this._currentView.deleteElements();
    }
    this._currentView = undefined;
    
    this._setOpacity('1');
    this._disableShowContainerButton(false);
    this._disablePreviousHierarchyButton(true);
    this._disableNextHierarchyButton(true);
    this._disableZoomableContainerButton(true);
    this._disableZoomContainerButton(false);
    this._disableCodeContainerButton(false);
    this._disableHideContainerButton(true);
    this._setSliderPosition(0);
  }
  
  _createContainer(type) {
    let inspectorContent = this._originalDom.querySelector('#inspector-content')
    let originalParent = this._originalDom.querySelector('#inspector-content::shadow #container-root');
    let childElements = this._originalDom.querySelectorAll('#inspector-content > *');
    switch (type) {
      case 'zoom':
        this._currentView = new ZoomView(inspectorContent, originalParent, childElements);
        break;
      case 'zoomable':
        this._currentView = new ZoomableView(inspectorContent, originalParent, childElements);
        break;
      case 'code':
        this._currentView = new CodeView(inspectorContent, originalParent, childElements);
        break;
      default:
        this._currentView = new ContainerView(inspectorContent, originalParent, childElements);
    }
  }
  
  _switchContainer(type) {
    this.hideContainer();
    this.showContainer(type);
    
    if (this._currentView.getShowedLevel() === this._currentView.getMaxNestedLevel()) {
      this._disableNextHierarchyButton(true);
      this._disablePreviousHierarchyButton(false);
    }
  }
  
  //
  // Template helper functions for enabeling/disabeling buttons, setting slider and opacity
  //
  _disableShowContainerButton(expr) {
    this._inspectorDom.querySelector('#showContainerButton').disabled = expr;
  }
  
  _disablePreviousHierarchyButton(expr) {
    this._inspectorDom.querySelector('#previousHierarchyLevelButton').disabled = expr;
  }

  _disableNextHierarchyButton(expr) {
    this._inspectorDom.querySelector('#nextHierarchyLevelButton').disabled = expr;
  }
  
  _disableZoomableContainerButton(expr) {
    this._inspectorDom.querySelector('#zoomableContainerButton').disabled = expr;
  }
  
  _disableZoomContainerButton(expr) {
    this._inspectorDom.querySelector('#zoomContainerButton').disabled = expr;
  }
  
  _disableCodeContainerButton(expr) {
    this._inspectorDom.querySelector('#codeContainerButton').disabled = expr;
  }
  
  _disableHideContainerButton(expr) {
    this._inspectorDom.querySelector('#hideContainerButton').disabled = expr;
  }
  
  _setSliderPosition(value) {
    this._inspectorDom.querySelector('#slider').value = value;
  }
  
  _setOpacity(value) {
    let elementsSelector = '#inspector-content > *:not(#' + helper.getCreatedRootSelector() + ')';
    let elements = this._originalDom.querySelectorAll(elementsSelector)
    elements.forEach(function(element){
      element.style.opacity = value;
    });
  }
}
