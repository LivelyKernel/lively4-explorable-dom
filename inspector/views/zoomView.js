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
    if(jQuery(toolElement).children('.' + this._informationNodeClassName()).length > 0) {
      return;
    };
    
    let time, id, classes;
    // Measure click event of original element
    let start = new Date().getTime();
    originalElement.click();
    let end = new Date().getTime();
    time = '<b>Time:</b> ' + (end-start).toString() + ' ms';
    
    if(originalElement.classList.length > 0) {
      classes = '<b>Class(es):</b> ' + originalElement.classList; 
    }
    
    if(originalElement.id != undefined) {
      id = '<b>ID:</b> ' + originalElement.id ;
    }
    
    let content = [time, id, classes].filter(el => el !== undefined);
    
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
    }
    
    if (this._isOverflowed(informationNode)) {
      informationNode.addEventListener('mouseover', e => {
          informationNode.style.height = '50px';
          informationNode.style.overflow = 'scroll';
          informationNode.style.whiteSpace = 'normal';
          informationNode.style.zIndex = '+1';
          if (parseFloat(informationNode.style.width) < 200) {
            informationNode.style.width = '200px';
          }
          informationNode.innerHTML = content.join(',<br/>');
      })
      
      informationNode.addEventListener('mouseleave', e => {
          informationNode.style.height = '';
          informationNode.style.width = this._informationNodeWidth(toolElement);
          informationNode.style.overflow = 'hidden';
          informationNode.style.whiteSpace = 'nowrap';
          informationNode.style.zIndex = 'auto';
          informationNode.innerHTML = content.join(', ');
      })
    }
  }
  
  _createInformationNode(toolElement, content) {
    let informationNode = document.createElement('div');
    informationNode.className = this._informationNodeClassName();
    informationNode.innerHTML = content.join(', ');
    
    informationNode.style.left = parseFloat(toolElement.offsetLeft) + 1 + 'px';
    informationNode.style.top = parseFloat(toolElement.offsetTop) + 1 + 'px';
    informationNode.style.opacity = '0';
    informationNode.style.width = this._informationNodeWidth(toolElement);
    
    let fadeSpeed = 25;
    let intId = setInterval(() => {
      let newOpacity = parseFloat(informationNode.style.opacity) + 0.1;
      informationNode.style.opacity = newOpacity.toString();
      if(informationNode.style.opacity == '1'){
          clearInterval(intId);
      }
    }, fadeSpeed);
    
    informationNode.addEventListener('click', e => {
      e.stopPropagation();
      e.currentTarget.remove();
    });
      
    return informationNode;
  }

  _informationNodeClassName() {
    return 'informationNode';
  }
  
  _informationNodeWidth(toolElement) {
    return parseFloat(toolElement.offsetWidth) - 7 + 'px';
  }
}