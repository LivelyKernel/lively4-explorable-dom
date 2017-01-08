/*
 * # LivelyDomInspector 
 */
 
'use strict';

import Morph from '../../lively4-core/templates/Morph.js';
import ExplorableDomInspector from '../inspector/explorableDomInspector.js';

// Lively DOM Inspector class
export default class DomInspector extends Morph {

  initialize() {
    this.windowTitle = 'Lively DOM Inspector';
  }
  
  inspect() {
    window.inspector = new ExplorableDomInspector(this.get('#container'), this.get('#navigation'));
    this._bindClickEvents();
    this._bindSliderEvents(this);
  }
  
  _bindClickEvents() {
    this.get("#showContainerButton").onclick = this._showContainer;
    this.get("#hideContainerButton").onclick = this._hideContainer;
    this.get("#zoomContainerButton").onclick = this._zoomContainer;
    this.get("#zoomableElementsButton").onclick = this._makeElementsZoomable;
    this.get("#nextHierarchyLevelButton").onclick = this._showNextHierarchyLevel;
    this.parentElement.get('.window-close').addEventListener("click", this._hideContainer);
  }
  
  _bindSliderEvents(inspectorComponent) {
    this.get("#slider").onchange = function() {
      switch(this.value) {
        case "0":
          inspectorComponent._hideContainer();
          break;
        case "1":
          inspectorComponent._showContainer();
          break;
        case "2":
          inspectorComponent._makeElementsZoomable();
          break;
        case "3":
          inspectorComponent._zoomContainer();
          break;
        default:
      }
    }
  }
  
  _showContainer() {
    window.inspector.showContainer();
  }
  
  _showNextHierarchyLevel() {
    window.inspector.showNextHierarchyLevel();
  }
  
  _hideContainer(){
    window.inspector.hideContainer();
  }
  
  _makeElementsZoomable() {
    window.inspector.makeElementsZoomable();
  }
  _zoomContainer(){
    let elements = window.inspector._getAllCreatedElements();
    window.inspector.zoomContainer(elements);
  }
}