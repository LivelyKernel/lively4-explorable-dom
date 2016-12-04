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
    window.that = this._inspector;
  }
  
  _showContainer() {
    window.that.showView(this._initialParent, this._childElements);
  }
  
  _showNextHierarchyLevel() {
    window.that.showNextHierarchyLevel();
  }
  
  _hideContainer(){
    window.that.hideView();
  }
  
  _zoomContainer(){
    window.that.zoomView();
  }
  
  _sliderAction() {
    let context = this;
    switch(this.value) {
      case "0":
        context._hideContainer();
        break;
      case "1":
        context._showContainer();
        break;
      case "2":
        context._zoomContainer();
        break;
      default:
    }
  }
}