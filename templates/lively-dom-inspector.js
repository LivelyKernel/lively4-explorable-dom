'use strict';

import Morph from '../../lively4-core/templates/Morph.js';
import ExplorableDomInspector from '../inspector/explorableDomInspector.js';

export default class DomInspector extends Morph {

  initialize() {
    this.windowTitle = 'Lively DOM Inspector';
    
    // Create browser component (lively-container) and attach it to div#container
    let container = document.createElement('lively-container');
    container.id = 'inspector-content';
    container.setAttribute('load', 'auto');
    container.style.width = "calc(100%)";
    container.style.height = "calc(100%)";
    container.setAttribute('mode', 'read');
    container.setAttribute('data-lively4-donotpersist', 'all');
    lively.components.openIn(this.get('#container'), container);
  }
  
  inspect() {
    let inspector = new ExplorableDomInspector(this.get('#container'), this.get('#navigation'));
    this._bindEvents(inspector);
  }
  
  _bindEvents(inspector) {
    this._bindClickEvents(inspector);
    this._bindChangeEvents(inspector);
    
    // Add listener for custom event fired when the browsers path has changed
    this.addEventListener("path-changed", () => inspector.switchFile());
  }
  
  _bindClickEvents(inspector) {
    this.get("#basicViewButton").addEventListener('click', () => {
      inspector.showView('basic');
      this.get("#slider").value = 1;
    });
    this.get("#previousHierarchyLevelButton").addEventListener('click', () => {
      inspector.showPreviousHierarchyLevel();
    });
    this.get("#nextHierarchyLevelButton").addEventListener('click', () => {
      inspector.showNextHierarchyLevel();
    });
    this.get("#zoomableElementsViewButton").addEventListener('click', () => {
      inspector.showView('zoomableElements');
      this.get("#slider").value = 2;
    });
    this.get("#zoomViewButton").addEventListener('click', () => {
      inspector.showView('zoom');
      this.get("#slider").value = 3;
    });
    this.get("#codeViewButton").addEventListener('click', () => {
      inspector.showView('code');
      this.get("#slider").value = 4;
    });
    this.get("#hideViewButton").addEventListener('click', () => {
      inspector.hideView();
      this.get("#slider").value = 0;
    });
    this.parentElement.get('.window-close').addEventListener("click", () => {
      inspector.hideView();
    });
  }
  
  _bindChangeEvents(inspector) {
    this.get("#slider").addEventListener("change", e => {
      switch(e.currentTarget.value) {
        case "0":
          inspector.hideView();
          break;
        case "1":
          inspector.showView('basic');
          break;
        case "2":
          inspector.showView('zoomableElements');
          break;
        case "3":
          inspector.showView('zoom');
          break;
        case "4":
          inspector.showView('code');
          break;
        default:
      }
    });
    
    this.get("#tagSelect").addEventListener("change", e => {
      inspector.filterTag(e.currentTarget.value);
    });
  }
}