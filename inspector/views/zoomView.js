'use strict';

import ZoomableView from './zoomableView.js';

export default class ZoomView extends ZoomableView {
  
  constructor(inspectorContent, originalParent, originalElements, hierarchyLevel=undefined) {
    super(inspectorContent, originalParent, originalElements, hierarchyLevel);
    
    this._viewType = 'zoom';
    this._opacityValue = '0.1';
  }
  
  _create(originalParent, originalElements) {
    super._create(originalParent, originalElements);
    
    let elements = this._getAllCreatedElements();
    this._zoom(elements);
    this._bindZoomEventHandlers(elements);
    this._addContentToElements(elements);
    
    // Show all hierarchy levels by default;
    // might be overwritten by constructor if level is specified
    this._showAllHierarchyLevels();
  }
  
  _handleMouseLeave(e, element, allElements) {
    super._handleMouseLeave(e, element, allElements);
    
    // Remove info labels
    var infoLabels = this._inspectorContent.querySelectorAll(".infoLabel");
    for(let i = infoLabels.length - 1; 0 <= i; i--) {
      if(infoLabels[i] && infoLabels[i].parentElement) {
        if (infoLabels[i] != null) {
          infoLabels[i].parentElement.removeChild(infoLabels[i]);
        }
      }
    }
  }
  
  _handleOnClick(e, toolElement, originalElement) {
    e.stopPropagation();
    
    // Do not create informationNode twice
    if(jQuery(toolElement).children('.' + this._getInformationNodeClassName()).length > 0) {
      return;
    };
    
    // Measure click event of original element
    let start = new Date().getTime();
    originalElement.click();
    let end = new Date().getTime();
    
    // Write the time below the newly created element
    let content = 'Time: ' + (end-start).toString() + ' ms';
    if(originalElement.classList.length > 0) {
      content += ', Class(es): ' + originalElement.classList; 
    }
    if(originalElement.id != undefined) {
      content += ', ID: ' + originalElement.id ;
    }
    
    let informationNode = this._createInformationNode(toolElement, content);
    toolElement.insertBefore(informationNode, toolElement.firstChild);
    
    if (informationNode != null) {
      let fadeSpeed = 25;
      let intId = setInterval(() => {
          let newOpacity = parseFloat(informationNode.style.opacity) - 0.1;
          informationNode.style.opacity = newOpacity.toString();
          if(informationNode.style.opacity == '0'){
              clearInterval(intId);
          }
      }, fadeSpeed);
      informationNode.addEventListener('click', e => {
        e.stopPropagation();
        e.currentTarget.remove();
      });
    }
  }
  
  _createInformationNode(toolElement, content) {
    let informationNode = document.createElement('div');
    informationNode.className = this._getInformationNodeClassName();
    informationNode.innerHTML = content;
    
    informationNode.style.left = parseFloat(toolElement.offsetLeft) + 1 + 'px';
    informationNode.style.top = parseFloat(toolElement.offsetTop) + 1 + 'px';
    informationNode.style.opacity = '0';
    let informationNodeWidth =  parseFloat(toolElement.offsetWidth) - 7 + 'px';
    informationNode.style.width = informationNodeWidth;
    
    let fadeSpeed = 25;
    let intId = setInterval(() => {
      let newOpacity = parseFloat(informationNode.style.opacity) + 0.1;
      informationNode.style.opacity = newOpacity.toString();
      if(informationNode.style.opacity == '1'){
          clearInterval(intId);
      }
    }, fadeSpeed);
      
    return informationNode;
  }
  
  _getInformationNodeClassName() {
    return 'informationNode';
  }
}