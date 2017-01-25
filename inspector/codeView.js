'use strict';

import * as helper from './helper.js';
import ContainerView from './containerView.js';

export default class CodeView extends ContainerView {
  
  _create(originalParent, originalElements) {
    super._create(originalParent, originalElements);
    
    let elements = this._getAllCreatedElements();
    this._zoom(elements);
    
    for(let i = 0; i < elements.length; i++) {
      var br = document.createElement('br');
      elements[i].prepend(br);
      elements[i].insertAdjacentHTML('afterbegin', elements[i].dataset.content);
      let originalElement = this._inspectorContent.querySelector('#' + elements[i].dataset.id);
      let startTagCodeElement = this._createCodeElement(elements[i], originalElement);
      let endTagElement = this._createCodeElement(elements[i], originalElement, false);
      elements[i].insertBefore(startTagCodeElement, elements[i].firstChild);
      elements[i].appendChild(endTagElement);
      
      if(this._isOverflowed(startTagCodeElement)) {
        let hoverWidth = elements[i].offsetWidth + 100 + 'px';
        startTagCodeElement.addEventListener('mouseover', function() {
          startTagCodeElement.style.backgroundColor = 'gray';
          startTagCodeElement.style.whiteSpace = 'normal';
          startTagCodeElement.style.zIndex = '+1';
          startTagCodeElement.style.width = hoverWidth;
        });
        let newElementWidth = this._getCodeElementWidth(elements[i]);
        startTagCodeElement.addEventListener('mouseleave', function() {
          startTagCodeElement.style.backgroundColor = 'initial';
          startTagCodeElement.style.whiteSpace = 'nowrap';
          startTagCodeElement.style.zIndex = 'auto';
          startTagCodeElement.style.width = newElementWidth;
        });
      }
    }
    
    // Show all hierarchy levels by default;
    // might be overwritten by constructor if level is specified
    this._showAllHierarchyLevels();
  }
  
  _zoom(elements) {
    super._zoom(elements);
    this._bindZoomEventHandlers(elements);
  }
  
  _handleOnClick(e, newElement, originalElement) {
      e.stopPropagation();
  }
  
  _createCodeElement(createdElement, originalElement, top=true) {
    let codeElement = document.createElement('div');
    codeElement.className = "codeElement";
    let content = this._getHtmlText(originalElement)
    if (top) {
      codeElement.innerHTML = content.match(/&lt;[a-zA-Z](.*?[^?])?&gt;/g);
      if(createdElement.style.position === 'relative') {
        codeElement.style.left = '0px';
        codeElement.style.top = '0px';
      } else {
        codeElement.style.left = parseFloat(createdElement.offsetLeft) + 1 + 'px';
        codeElement.style.top = parseFloat(createdElement.offsetTop) + 1 + 'px';
      }
    } else {
      let tags = content.split(/&gt;(.|\n)*&lt;/g);
      if (tags.length > 1) {
        codeElement.innerHTML = '&lt;' + tags[tags.length-1].trim()
      }
      if(createdElement.style.position === 'relative') {
        codeElement.style.left = '0px';
        codeElement.style.bottom = '0px';
      } else {
        codeElement.style.left = parseFloat(createdElement.offsetLeft) + 1 + 'px';
        codeElement.style.top = parseFloat(createdElement.offsetTop) + parseFloat(createdElement.offsetHeight) -14 + 'px';
      }
    }
    codeElement.style.width = this._getCodeElementWidth(createdElement);
    
    return codeElement;
  }
  
  _getHtmlText(element) {
    let outerHtml = jQuery(element)
      .clone()    //clone the element
      .children() //select all the children
      .remove()   //remove all the children
      .end()[0].outerHTML
    let pre = document.createElement('pre');
    let text = document.createTextNode(outerHtml);
    pre.appendChild(text);
    return pre.innerHTML;
  }
  
  _getCodeElementWidth(orginalElement) {
    return parseFloat(orginalElement.offsetWidth) - 2 + 'px';
  }
  
  _isOverflowed(element){
    return element.scrollWidth > element.clientWidth;
  }
}