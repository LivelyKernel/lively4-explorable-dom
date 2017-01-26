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
  }
  
  _bindClickEvents(inspector) {
    this.get("#basicViewButton").addEventListener('click', function(){
      inspector.basicView();
    });
    this.get("#previousHierarchyLevelButton").addEventListener('click', function(){
      inspector.showPreviousHierarchyLevel();
    });
    this.get("#nextHierarchyLevelButton").addEventListener('click', function(){
      inspector.showNextHierarchyLevel();
    });
    this.get("#zoomableElementsViewButton").addEventListener('click', function(){
      inspector.zoomableElementsView();
    });
    this.get("#zoomViewButton").addEventListener('click', function(){
      inspector.zoomView();
    });
    this.get("#codeViewButton").addEventListener('click', function(){
      inspector.codeView();
    });
    this.get("#hideViewButton").addEventListener('click', function(){
      inspector.hideView();
    });
    this.parentElement.get('.window-close').addEventListener("click", function(){
      inspector.hideView();
    });
  }
  
  _bindSliderEvents(inspector) {
    this.get("#slider").onchange = function() {
      switch(this.value) {
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