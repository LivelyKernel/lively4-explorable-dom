'use strict';

import * as helper from './helper.js';
import ContainerView from './containerView.js';

export default class ZoomView extends ContainerView {
  
  _create(originalParent, originalElements) {
    super._create(originalParent, originalElements);
    
    let elements = this._getAllCreatedElements();
    this._zoom(elements);
    
    // Show all hierarchy levels by default;
    // might be overwritten by constructor if level is specified
    this._showAllHierarchyLevels();
  }
  
  _hideElements(elements) {
    for(let i = 0; i < elements.length; i++) {
      elements[i].style.visibility = 'hidden';
      let informationNodes = elements[i].parentNode.querySelectorAll('.informationNode');
      for(let i = 0; i < informationNodes.length; i++) {
        informationNodes[i].style.visibility = 'hidden';
      }
    }
  }
  
  _zoom(elements) {
    super._zoom(elements);
    this._bindZoomEventHandlers(elements);
    
    for(let i = 0; i < elements.length; i++){
      var br = document.createElement('br');
      elements[i].prepend(br);
      elements[i].insertAdjacentHTML('afterbegin', elements[i].dataset.content);
    }
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
  
  _handleOnClick(e, newElement, originalElement) {
    e.stopPropagation();
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
    
    let informationNode = this._createInformationNode(newElement, content);
    newElement.parentNode.insertBefore(informationNode, newElement.nextSibling);
    
    // Remove information node after a few seconds
    window.setTimeout(function() {
      if (informationNode != null) {
        let intId = setInterval(function() {
            let newOpacity = parseFloat(informationNode.style.opacity) - 0.1;
            informationNode.style.opacity = newOpacity.toString();
            if(informationNode.style.opacity == '0'){
                clearInterval(intId);
            }
        }, fadeSpeed);
        newElement.parentNode.removeChild(informationNode);
      }
    }, 4000);
  }
  
  _createInformationNode(newElement, content) {
    let informationNode = document.createElement('div');
    informationNode.className = "informationNode";
    informationNode.innerHTML = content;
    
    informationNode.style.left = parseFloat(newElement.offsetLeft) + 1 + 'px';
    informationNode.style.top = parseFloat(newElement.offsetTop) + 1 + 'px';
    informationNode.style.opacity = '0';
    let informationNodeWidth =  parseFloat(newElement.offsetWidth) - 7 + 'px';
    informationNode.style.width = informationNodeWidth;
    
    let fadeSpeed = 25;
    let intId = setInterval(function(){
      let newOpacity = parseFloat(informationNode.style.opacity) + 0.1;
      informationNode.style.opacity = newOpacity.toString();
      if(informationNode.style.opacity == '1'){
          clearInterval(intId);
      }
    }, fadeSpeed);
      
    return informationNode;
  }
}