'use strict';

import ContainerView from './containerView.js';
import CodeView from './codeView.js';
import ZoomView from './zoomView.js';
import ZoomableView from './zoomableView.js';

export default class ExplorableDomInspector {
  
  constructor(originalDom, inspectorDom) {
    
    this._originalDom = originalDom;
    this._inspectorDom = inspectorDom;
    this._currentView = undefined;
  }
  
  hideContainer() {
    // Reset changes
    if(this._currentView) {
      this._currentView.deleteElements();
    }
    this._currentView = undefined;
    
    this._setOpacity('1');
    this._disableShowContainerButton(false);
    this._disableNextHierarchyButton(true);
    this._disableHideContainerButton(true);
    this._disableZoomableContainerButton(true);
    this._disableZoomContainerButton(false);
    this._disableCodeContainerButton(false);
    this._setSliderPosition(0);
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
    
    // Adapt slider position
    this._setSliderPosition(1);
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
    this._showAllHierarchyLevels(this._getAllCreatedElements());
    
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
    this._showAllHierarchyLevels(this._getAllCreatedElements());
    
    // Called after the showContainer() method in order to prevent overwriting these settings
    this._setOpacity('0.1');
    this._disableZoomableContainerButton(true);
    this._disableCodeContainerButton(true);
    
    // Adapt slider position
    this._setSliderPosition(4);
  }
  
  showNextHierarchyLevel() {
    let createdElements = this._getAllCreatedElements();
    this._currentView.showNextHierarchyLevel(createdElements);
  
    if(this._currentView.getShowedLevel() === this._currentView.getMaxNestedLevel()) {
      this._disableNextHierarchyButton(true);
    }
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
  }
  
  _getAllCreatedElements() {
    return this._originalDom.querySelector('#inspector-content').getElementsByClassName('created');
  }
  
  //
  // Template helper functions for enabeling/disabeling buttons, setting slider and opacity
  //
  _disableShowContainerButton(expr) {
    this._inspectorDom.querySelector('#showContainerButton').disabled = expr;
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
    let elements = this._originalDom.querySelectorAll('#inspector-content > *:not(#created--root)')
    elements.forEach(function(element){
      element.style.opacity = value;
    });
  }
  
  //
  // Zoom view helper functions
  //
  _showAllHierarchyLevels(allElements) {
    this._disableNextHierarchyButton(true);
    this._currentView.showElements(allElements);
  }
}
