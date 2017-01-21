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
    this.get("#showContainerButton").addEventListener('click', function(){
      inspector.showContainer();
    });
    this.get("#nextHierarchyLevelButton").addEventListener('click', function(){
      inspector.showNextHierarchyLevel();
    });
    this.get("#zoomableContainerButton").addEventListener('click', function(){
      inspector.zoomableContainer();
    });
    this.get("#zoomContainerButton").addEventListener('click', function(){
      inspector.zoomContainer();
    });
    this.get("#codeContainerButton").addEventListener('click', function(){
      inspector.codeContainer();
    });
    this.get("#hideContainerButton").addEventListener('click', function(){
      inspector.hideContainer();
    });
    this.parentElement.get('.window-close').addEventListener("click", function(){
      inspector.hideContainer();
    });
  }
  
  _bindSliderEvents(inspector) {
    this.get("#slider").onchange = function() {
      switch(this.value) {
        case "0":
          inspector.hideContainer();
          break;
        case "1":
          inspector.showContainer();
          break;
        case "2":
          inspector.zoomableContainer();
          break;
        case "3":
          inspector.zoomContainer();
          break;
        case "4":
          inspector.codeContainer();
          break;
        default:
      }
    }
  }
}