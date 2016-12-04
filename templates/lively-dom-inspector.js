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
    this.get("#nextHierarchyLevelButton").onclick = this._showNextHierarchyLevel;
    this.get("#slider").onchange = this._sliderAction;
    window.inspector = this._inspector;
    window.that = this;
  }
  
  _showContainer() {
    window.inspector.showView(this._initialParent, this._childElements);
  }
  
  _showNextHierarchyLevel() {
    window.inspector.showNextHierarchyLevel();
  }
  
  _hideContainer(){
    window.inspector.hideView();
  }
  
  _zoomContainer(){
    window.inspector.zoomView();
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
        window.that._zoomContainer();
        break;
      default:
    }
  }
}