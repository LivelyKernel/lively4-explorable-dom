'use strict';

import ZoomableView from './zoomableView.js';

export default class CodeView extends ZoomableView {
  
  constructor(inspectorContent, originalParent, originalElements, hierarchyLevel=undefined) {
    super(inspectorContent, originalParent, originalElements, hierarchyLevel);
    
    this._viewType = 'code';
    this._opacityValue = '0.1';
  }
  
  _create(originalParent, originalElements) {
    super._create(originalParent, originalElements);
    
    let elements = this._getAllToolElements();
    this._zoom(elements);
    this._addContentToElements(elements);
    
    for(let i = 0; i < elements.length; i++) {
      let originalElement = this._inspectorContent.querySelector('#' + elements[i].dataset.id);
      let startTagCodeElement = this._createCodeElement(elements[i], originalElement);
      let endTagElement = this._createCodeElement(elements[i], originalElement, false);
      elements[i].insertBefore(startTagCodeElement, elements[i].firstChild);
      elements[i].appendChild(endTagElement);
      
      if(this._isOverflowed(startTagCodeElement)) {
        startTagCodeElement.addEventListener('mouseover', () => {
          startTagCodeElement.classList.add('overflowed');
          // BackgroundColor needs to be set here and not in CSS-File because 
          // :hover does not catch moving over the scrollbar
          startTagCodeElement.style.backgroundColor =  '#BDBDBD';
        });
        
        startTagCodeElement.addEventListener('mouseleave', () => {
          startTagCodeElement.classList.remove('overflowed');
          startTagCodeElement.style.width = this._codeElementWidth(elements[i]);
          startTagCodeElement.style.backgroundColor =  'initial';
        });
      }
    }
    
    // Show all hierarchy levels by default
    // This might be overwritten by the constructor if a level is specified
    this._showAllHierarchyLevels();
  }
  
  _zoom(elements) {
    super._zoom(elements);
    this._bindZoomEventHandlers(elements);
  }
  
  _handleOnClick(e, toolElement, originalElement) {
      e.stopPropagation();
  }
  
  _createCodeElement(toolElement, originalElement, top=true) {
    let codeElement = document.createElement('div');
    codeElement.className = "codeElement";
    let content = this._getHtmlText(originalElement)
    if (top) {
      codeElement.innerHTML = content.match(/&lt;[a-zA-Z](.*?[^?])?&gt;/g);
      if(toolElement.style.position === 'relative') {
        codeElement.style.left = '0px';
        codeElement.style.top = '0px';
      } else {
        codeElement.style.left = parseFloat(toolElement.offsetLeft) + 1 + 'px';
        codeElement.style.top = parseFloat(toolElement.offsetTop) + 1 + 'px';
      }
    } else {
      let tags = content.split(/&gt;(.|\n)*&lt;/g);
      if (tags.length > 1) {
        codeElement.innerHTML = '&lt;' + tags[tags.length-1].trim()
      }
      if(toolElement.style.position === 'relative') {
        codeElement.style.left = '0px';
        codeElement.style.bottom = '0px';
      } else {
        codeElement.style.left = parseFloat(toolElement.offsetLeft) + 1 + 'px';
        codeElement.style.top = parseFloat(toolElement.offsetTop) + 
                                parseFloat(toolElement.offsetHeight) - 14 + 'px';
      }
    }
    codeElement.style.width = this._codeElementWidth(toolElement);
    
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
    return pre.innerHTML.replace(/(\r\n|\n|\r)/gm," ");
  }
  
  _codeElementWidth(orginalElement) {
    return parseFloat(orginalElement.offsetWidth) - 2 + 'px';
  }
}