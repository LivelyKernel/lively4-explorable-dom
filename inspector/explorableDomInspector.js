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
  
  basicContainer() {
    // Switch to basic coontainer view
    this._switchContainer('basic');
    
    // Make background less prominent
    this._setOpacity('0.3');
    
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
    
    // Adapt inspector
    this._setOpacity('0.3');
    this._setSliderPosition(2);
  }
  
  zoomContainer() {
    this._switchContainer('zoom');
    
    // Adapt inspector
    this._setOpacity('0.1');
    this._setSliderPosition(3);
  }
  
  codeContainer() {
    this._switchContainer('code');
    
   // Adapt inspector
    this._setOpacity('0.1');
    this._setSliderPosition(4);
  }
  
  hideContainer(switchContainer=false) {
    // Reset changes
    if(this._currentView) {
      this._currentView.deleteElements();
      
      if(!switchContainer) {
        this._currentView = undefined;
      }
    }
    
    this._setOpacity('1');
    this._disablePreviousHierarchyButton(true);
    this._disableNextHierarchyButton(true);
    this._disableHideContainerButton(true);
    this._setSliderPosition(0);
  }
  
  _createContainer(type, hierarchyLevel) {
    let inspectorContent = this._originalDom.querySelector('#inspector-content')
    let originalParent = this._originalDom.querySelector('#inspector-content::shadow #container-root');
    let childElements = this._originalDom.querySelectorAll('#inspector-content > *');
    let view;
    switch (type) {
      case 'basic':
        view = ContainerView;
        break;
      case 'zoom':
        view = ZoomView;
        break;
      case 'zoomable':
        view = ZoomableView;
        break;
      case 'code':
        view = CodeView;
        break;
      default:
        view = ContainerView;
    }
    this._currentView = new view(inspectorContent, originalParent, childElements, hierarchyLevel);
    this._disableHideContainerButton(false);
  }
  
  _switchContainer(type) {
    // Save hierarchy level
    let hierarchyLevel;
    if(this._currentView) {
      hierarchyLevel = this._currentView.getShowedLevel();
    }
    
    this.hideContainer(true);
    // Create container view (create copied elements, etc.)
    this._createContainer(type, hierarchyLevel);
    
    // Enable hierarchy button only if there are nested elements
    if(this._currentView.getMaxNestedLevel() > 0) {
      this._disableNextHierarchyButton(false);
    }
    
    if(this._currentView.getShowedLevel() > 0) {
      this._disablePreviousHierarchyButton(false);
    }
    
    if (this._currentView.getShowedLevel() === this._currentView.getMaxNestedLevel()) {
      this._disablePreviousHierarchyButton(false);
      this._disableNextHierarchyButton(true);
    }
  }
  
  //
  // Template helper functions for enabeling/disabeling buttons, setting slider and opacity
  //
  
  _disablePreviousHierarchyButton(expr) {
    this._inspectorDom.querySelector('#previousHierarchyLevelButton').disabled = expr;
  }

  _disableNextHierarchyButton(expr) {
    this._inspectorDom.querySelector('#nextHierarchyLevelButton').disabled = expr;
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
