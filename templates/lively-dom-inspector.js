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
  
  inspect(dom) {
    this._inspector = new ExplorableDomInspector(dom, this);
    this.get("#showContainerButton").onclick = this._showContainer;
    this.get("#hideContainerButton").onclick = this._hideContainer;
    this.get("#zoomContainerButton").onclick = this._zoomContainer;
    this.get("#zoomableElementsButton").onclick = this._makeElementsZoomable;
    this.get("#nextHierarchyLevelButton").onclick = this._showNextHierarchyLevel;
    this.get("#slider").onchange = this._sliderAction;
    this.parentElement.get('.window-close').addEventListener("click", this._hideContainer);
    window.inspector = this._inspector;
    window.that = this;
  }
  
  _showContainer() {
    window.inspector.showContainer(this._initialParent, this._childElements);
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
  
  _sliderAction() {
    switch(this.value) {
      case "0":
        window.that._hideContainer();
        break;
      case "1":
        window.that._showContainer();
        break;
      case "2":
        window.that._makeElementsZoomable();
        break;
      case "3":
        window.that._zoomContainer();
        break;
      default:
    }
  }
}