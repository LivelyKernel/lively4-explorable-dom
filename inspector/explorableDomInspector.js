'use strict';

import ContainerView from './containerView.js';

export default class ExplorableDomInspector {
  
  constructor(originalDom, inspectorDom) {
    
    this._originalDom = originalDom; //TODO: set main-content instead of document
    this._inspectorDom = inspectorDom;
    this._currentView = undefined;
  }
  
  showView() {
    // Delete old stuff
    if(this._getAllCreatedElements().length > 0) {
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
    this._disableNextHierarchyButton(true);
    this._disableHideContainerButton(true);
    this._disableZoomContainerButton(false);
    this._setSliderPosition(0);
  }
  
  zoomView() {
    // Take care that all elements are shown if it was not done before
    if(this._getAllCreatedElements().length === 0) {
      this.showView();
      this._showAllHierarchyLevels();
    }
    
    // Needs to be called after the showView()
    this._setOpacity('0.1');
    this._disableNextHierarchyButton(true);
    this._disableZoomContainerButton(true);
    
    let elements = this._getAllCreatedElements();
    let maxCount = 1;
    let count = 1;
    
    for(let i = 0; i < elements.length; i++){
      // Change styling
      elements[i].style.position = 'relative';
      elements[i].style.top = 0;
      elements[i].style.pointerEvents = 'auto';
      
      if(elements[i].children.length > 0) {
        let numberOfChildren = jQuery(elements[i]).find('.created').length;
        this._increaseByHierarchyLevel(elements[i], numberOfChildren, true);
        
        // Reset counters
        maxCount = 1;
        count = 1;
      } else {
        this._increaseByHierarchyLevel(elements[i], 1, false);
      }
      
      elements[i].style.padding = this._getDistanceValue() + 'px';
      elements[i].style.margin = this._getDistanceValue() + 'px';
      
      let context = this;
      elements[i].onmouseover = function(){
        context._handleMouseOver(event, elements[i]);
      };
      elements[i].onmouseleave = function(){
        context._handleMouseLeave(event, elements[i]);
      };
      elements[i].onmouseenter = function(){
        //handleMouseEnter(elements[i]);
      };
    }
  
    // Adapt slider position
    this._setSliderPosition(2);
  }
  
  showNextHierarchyLevel(){
    this._currentView.showNextHierarchyLevel();
  
    if(this._currentView.getShowedLevel() === this._currentView.getMaxNestedLevel()) {
      this._disableNextHierarchyButton(true);
    }
  }
  
  _createView() {
    this._initialParent = this._originalDom.getElementsByTagName('body')[0];
    this._childElements = this._originalDom.querySelectorAll('#main-content > *');
    this._currentView = new ContainerView(this._originalDom, this._initialParent, this._childElements);
  }
  
  //TODO: we need to find a better solution for this (duplicate with container view function)
  _getAllCreatedElements() {
    return this._originalDom.getElementsByClassName('created');
  }
  
  //
  // Template helper functions for enabeling/disabeling buttons, setting slider and opacity
  //
  
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
  
  _disableZoomContainerButton(expr) {
    this._inspectorDom.get('#zoomContainerButton').disabled = expr;
  }
  
  _setSliderPosition(value) {
    this._inspectorDom.get('#slider').value = value;
  }
  
  //
  // Zoom view helper functions
  //
  
  _showAllHierarchyLevels() {
    this._currentView.showAllHierarchyLevels();
  }
  
  _increaseByHierarchyLevel(element, numberOfChildren, isParent)  {
    if (isParent) {
      // Increase by number of children + own increasement + cancel out padding & margin of the child elements
      element.style.height = element.clientHeight + 
        (numberOfChildren + 1) * this._getDistanceValue() + 
        numberOfChildren * 4 * this._getDistanceValue() 
        + 'px';
      element.style.width = element.clientWidth + 
        (numberOfChildren + 1) * this._getDistanceValue() + 
        numberOfChildren * 4 * this._getDistanceValue() + 
        'px';
    }
    else {
      element.style.height = element.clientHeight + numberOfChildren * this._getDistanceValue() + 'px';
      element.style.width = element.clientWidth + numberOfChildren * this._getDistanceValue() + 'px';
    }
  }
  
  _getDistanceValue() {
    return 20;
  }
  
  //
  // Zoom view hover functionality
  //
  
  _handleMouseOver(e, element) {
    e.stopPropagation();
    
    let allParentElements = jQuery(element).parents('.created');
    let allChildElemets = jQuery(element).find('.created');
    let allElements = $.merge(allParentElements, allChildElemets);
    for(let i = 0; i < allElements.length; i++) {
      allElements[i].style.backgroundColor = 'white';
    }
    
    element.style.backgroundColor = 'lightgrey';
  }
  
  _handleMouseLeave(e, element) {
    e.stopPropagation();
    
    var allElements = this._getAllCreatedElements();
    for(let i = 0; i < allElements.length; i++) {
      allElements[i].style.backgroundColor = 'initial';
    }
    
    var infoLabels = this._originalDom.getElementsByClassName("infoLabel");
    for(let i = infoLabels.length - 1; 0 <= i; i--) {
      if(infoLabels[i] && infoLabels[i].parentElement) {
        infoLabels[i].parentElement.removeChild(infoLabels[i]);
      }
    }
  }
  
  _handleMouseEnter(element) {
    var originalElement = this._originalDom.getElementById(element.dataset.id);
    var additionalInfoLabel = this._originalDom.createElement('label');
    
    additionalInfoLabel.classList += 'infoLabel';
    additionalInfoLabel.innerHTML = originalElement.tagName;
    additionalInfoLabel.innerHTML += element.dataset.id;
    
    element.appendChild(additionalInfoLabel);
  }
}
