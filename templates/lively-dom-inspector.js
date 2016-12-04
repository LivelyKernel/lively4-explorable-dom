/*
 * # LivelyDomInspector 
 */
 
'use strict';

import Morph from '../../lively4-core/templates/Morph.js';
import ExplorableDomInspector from '../explorableDomInspector.js';

// Dom Inspector class
export default class DomInspector extends Morph {

  initialize() {
    this.windowTitle = 'Lively DOM Inspector';
  }
  
  inspect(dom) {
    this._inspector = new ExplorableDomInspector(dom, this);
    this.get("#showContainerButton").onclick = this._showContainer;
    this.get("#hideContainerButton").onclick = this._hideContainer;
    this.get("#nextHierarchyLevelButton").onclick = this._showNextHierarchyLevel;
    this.get("#slider").onchange = this._sliderAction;
    window.that = this._inspector;
  }
  
  _showContainer() {
    window.that.showView(this._initialParent, this._childElements);
  }
  
  _hideContainer(){
    window.that.hideView();
  }

  _showNextHierarchyLevel() {
    window.that.showNextHierarchyLevel();
  }
  
  _sliderAction() {
    switch(this.value) {
      case "0":
        window.that.hideView();
        break;
      case "1":
        window.that.showView();
        break;
      case "2":
        //TODO
        break;
      default:
    }
  }
}