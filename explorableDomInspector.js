'use strict';

import * as View from './containerView.js';

export default class ExplorableDomInspector {
  
  constructor(originalDom, inspectorDom) {
    
    this._originalDom = originalDom;
    this._inspectorDom = inspectorDom;
    this._currentView = undefined;
  }
  
  showView() {
    // Delete old stuff
    if(View.getAllCreatedElements().length > 0) {
      this.hideView();
    }
    
    // Create container view (create copied elements, etc.)
    this._createView();
    
    // Make background less prominent
    this._setOpacity('0.3');
    
    // Prevent user from creating container view twice
    this._disableShowContainerButton(true);
    this._disableHideContainerButton(false);
    
    // Enable hierarchy button only if there are nested elements
    if(this._currentView.getMaxNestedLevel() > 0) {
      this._disableNextHierarchyButton(false);
    }
    
    // Adapt slider position
    this._setSliderPosition(1);
  }
  
  hideView() {
    // Reset changes
    this._currentView.deleteElements();
    this._setOpacity('1');
    this._disableShowContainerButton(false);
    this._disableHideContainerButton(true);
    this._disableNextHierarchyButton(true);
    this._setSliderPosition(0);
  }
  
  showNextHierarchyLevel(){
    this._currentView.showNextHierarchyLevel();
  
    if(this._currentView.getShowedLevel() === this._currentView.getMaxNestedLevel()) {
      this._disableNextHierarchyButton(true);
    }
  }
  
  showAllHierarchyLevels() {
    this._currentView.showAllHierarchyLevels();
  }
  
  _createView() {
    this._initialParent = this._originalDom.getElementsByTagName('body')[0];
    this._childElements = this._originalDom.querySelectorAll('#main-content > *');
    this._currentView = new View(this._initialParent, this._childElements);
  }
  
  _setOpacity(value) {
    this._originalDom.getElementById('main-content').style.opacity = value;
  }
  
  _disableShowContainerButton(expr) {
    this._inspectorDom.get('#showContainerButton').disabled = expr;
  }

  _disableNextHierarchyButton(expr) {
    this._inspectorDom.get('#nextHierarchyLevelButton').disabled = expr;
  }
  
  _disableHideContainerButton(expr) {
    this._inspectorDom.get('#hideContainerButton').disabled = expr;
  }
  
  _setSliderPosition(value) {
    this._inspectorDom.get('#slider').value = value;
  }
}