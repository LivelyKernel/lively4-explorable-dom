'use strict';

import ContainerView from './containerView.js';

export default class ExplorableDomInspector {
  
  constructor(originalDom, inspectorDom) {
    
    this._originalDom = originalDom;
    this._inspectorDom = inspectorDom;
    this._currentView = undefined;
  }
  
  showContainer() {
    // Delete old stuff
    if(this._getAllCreatedElements().length > 0) {
      this.hideContainer();
    }
    
    // Create container view (create copied elements, etc.)
    this._createContainer();
    
    // Make background less prominent
    this._setOpacity('0.3');
    
    // Prevent user from creating container view twice
    this._disableShowContainerButton(true);
    this._disableHideContainerButton(false);
    
    // Enable hierarchy button only if there are nested elements
    if(this._currentView.getMaxNestedLevel() > 0) {
      this._disableNextHierarchyButton(false);
    }
    
    this._disableZoomableElementsButton(false);
    
    // Adapt slider position
    this._setSliderPosition(1);
  }
  
  hideContainer() {
    // Reset changes
    if(this._getAllCreatedElements().length > 0) {
      this._currentView.deleteElements();
    }
    this._setOpacity('1');
    this._disableShowContainerButton(false);
    this._disableNextHierarchyButton(true);
    this._disableHideContainerButton(true);
    this._disableZoomableElementsButton(true);
    this._disableZoomContainerButton(false);
    this._setSliderPosition(0);
    
    this._currentView.isGlobalZoom = false;
    this._currentView.isZoomable = false;
  }
  
  makeElementsZoomable() {
    // Take care that all elements are shown if it was not done before
    if(this._getAllCreatedElements().length === 0) {
      this.showContainer();
      this._showAllHierarchyLevels();
    }
    
    this._disableZoomableElementsButton(true);
    
    this._currentView.makeElementsZoomable();
    
    // Adapt slider position
    this._setSliderPosition(2);
  }
  
  zoomContainer() {
    // Get all created elements
    let elements = this._getAllCreatedElements();
    
    // Take care that all elements are shown if it was not done before
    if(elements.length === 0) {
      this.showContainer();
      this._showAllHierarchyLevels();
    }
    
    // Called after the showContainer() method in order to prevent overwriting these settings
    this._setOpacity('0.1');
    this._disableZoomableElementsButton(true);
    this._disableZoomContainerButton(true);
    
    this._currentView.zoom(elements);
    this._currentView.isGlobalZoom = true;
    
    // Adapt slider position
    this._setSliderPosition(3);
  }
  
  showNextHierarchyLevel(){
    this._currentView.showNextHierarchyLevel();
  
    if(this._currentView.getShowedLevel() === this._currentView.getMaxNestedLevel()) {
      this._disableNextHierarchyButton(true);
    }
  }
  
  _createContainer() {
    this._initialParent = this._originalDom.querySelector('#inspector-content::shadow #container-root');
    this._childElements = this._originalDom.querySelectorAll('#inspector-content > *');
    this._currentView = new ContainerView(this._originalDom, this._initialParent, this._childElements);
  }
  
  //TODO: we need to find a better solution for this (duplicate with container view function)
  _getAllCreatedElements() {
    return this._originalDom.getElementsByClassName('created')
  }
  
  //
  // Template helper functions for enabeling/disabeling buttons, setting slider and opacity
  //
  
  _setOpacity(value) {
    this._originalDom.querySelector('#inspector-content').style.opacity = value;
  }
  
  _disableShowContainerButton(expr) {
    this._inspectorDom.querySelector('#showContainerButton').disabled = expr;
  }

  _disableNextHierarchyButton(expr) {
    this._inspectorDom.querySelector('#nextHierarchyLevelButton').disabled = expr;
  }
  
  _disableHideContainerButton(expr) {
    this._inspectorDom.querySelector('#hideContainerButton').disabled = expr;
  }
  
  _disableZoomContainerButton(expr) {
    this._inspectorDom.querySelector('#zoomContainerButton').disabled = expr;
  }
  
  _disableZoomableElementsButton(expr) {
    this._inspectorDom.querySelector('#zoomableElementsButton').disabled = expr;
  }
  
  _setSliderPosition(value) {
    this._inspectorDom.querySelector('#slider').value = value;
  }
  
  //
  // Zoom view helper functions
  //
  
  _showAllHierarchyLevels() {
    this._disableNextHierarchyButton(true);
    this._currentView.showAllHierarchyLevels();
  }
}
