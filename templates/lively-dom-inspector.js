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
    let inspector = new ExplorableDomInspector(this.get('#container'), this.get('#navigation'));
    this._bindEvents(inspector);
  }
  
  _bindEvents(inspector) {
    this._bindClickEvents(inspector);
    this._bindSliderEvents(inspector);
    this.addEventListener("path-changed", () => inspector.switchFile())
  }
  
  _bindClickEvents(inspector) {
    this.get("#basicViewButton").addEventListener('click', () => inspector.basicView());
    this.get("#previousHierarchyLevelButton").addEventListener('click', () => inspector.showPreviousHierarchyLevel());
    this.get("#nextHierarchyLevelButton").addEventListener('click', () => inspector.showNextHierarchyLevel());
    this.get("#zoomableElementsViewButton").addEventListener('click', () => inspector.zoomableElementsView());
    this.get("#zoomViewButton").addEventListener('click', () => inspector.zoomView());
    this.get("#codeViewButton").addEventListener('click', () => inspector.codeView());
    this.get("#hideViewButton").addEventListener('click', () => inspector.hideView());
    this.parentElement.get('.window-close').addEventListener("click", () => inspector.hideView());
  }
  
  _bindSliderEvents(inspector) {
    this.get("#slider").onchange = (e) => {
      switch(e.currentTarget.value) {
        case "0":
          inspector.hideView();
          break;
        case "1":
          inspector.basicView();
          break;
        case "2":
          inspector.zoomableElementsView();
          break;
        case "3":
          inspector.zoomView();
          break;
        case "4":
          inspector.codeView();
          break;
        default:
      }
    }
  }
}