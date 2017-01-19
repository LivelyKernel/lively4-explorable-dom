'use strict';

import * as helper from './helper.js';

export default class ContainerView {
  
  constructor(inspectorContent, originalParent, originalElements) {
    
    this._inspectorContent = inspectorContent;
    this._showedLevel = 0;
    this._maxNestedLevel = 0;
    this._isSingleZoom = false;
    this.isGlobalZoom = false;
    this.isZoomable = false;
    this.isCodeView = false;
    
    this._create(originalParent, originalElements);
  }
  
  getShowedLevel() {
    return this._showedLevel;
  }
  
  getMaxNestedLevel() {
    return this._maxNestedLevel;
  }
  
  _create(originalParent, originalElements) {
    // Create a new div with the position and size of the original container.
    // This div will be used as new root and is absolutely positioned. Thus it 
    // is easier to position the actual elements correctly.
    var newParent = document.createElement('div');
    newParent.id = 'created--root';
    helper.copySpacing(newParent, originalParent);
    helper.copySize(newParent, originalParent);
    
    this._inspectorContent.appendChild(newParent);
    
    for (let i = 0; i < originalElements.length; i++) {
      if (originalElements[i].tagName != 'SCRIPT' && originalElements[i].tagName != 'LINK') {
        this._copyElement(newParent, originalElements[i]);
      }
    }
  }
  
  _copyElement(parentElement, element, nested = false, nestingLevel = 0) {
    let newElement = document.createElement('div');
    
    // Set style information for the new element
    helper.copySpacing(newElement, element);
    newElement.style.border = '1px solid' + helper.getRandomColor();
    newElement.style.display =  window.getComputedStyle(element, null).display;
    newElement.classList.add('created');
    
    // Child elements are hidden by default --> only first hierarchy level is shown
    if(nested) {
      newElement.style.visibility = 'hidden';
      newElement.classList.add('nested_' + nestingLevel);
    }
    
    if(element.id === "") {
      element.id = helper.getRandomId();
    }
    newElement.dataset.id = element.id;
    
    // This is a really ugly hack to get only the text of the actual element
    let text = jQuery(element).clone().children().remove().end().text().trim();
    newElement.dataset.content = (text.length > 0) ? text : element.tagName;
    parentElement.appendChild(newElement);
    
    // Only the last children of the hierarchy need an actual sizement. 
    // All other elements are sized by their children
    if(element.children.length === 0 || text.length !== 0 ) {
      helper.copySize(newElement, element);
    }
    
    // Keep hierarchy information by adding child elements recursively 
    if(element.children.length > 0) {
      nestingLevel += 1;
      
      for(let j = 0; j <  element.children.length; j++) {
        this._copyElement(newElement, element.children[j], true, nestingLevel);
      }
    }
    
    if (nestingLevel > this._maxNestedLevel) {
      this._maxNestedLevel = nestingLevel;
    } 
  
    // Click handler
    let context = this;
    newElement.onclick = function(e) {
      context._handleOnClick(e, newElement, element);
    }

  }
  
  zoom(elements) {
    if(!this.isZoomable) {
      this.makeElementsZoomable(elements);
    }
    
    let maxCount = 1;
    let count = 1;
    
    for(let i = 0; i < elements.length; i++){
      if(elements[i].children.length > 0) {
        let numberOfChildren = jQuery(elements[i]).find('.created').length;
        this._increaseByHierarchyLevel(elements[i], numberOfChildren, true);
        
        // Reset counters
        maxCount = 1;
        count = 1;
      } else {
        this._increaseByHierarchyLevel(elements[i], 1, false);
      }
      if(this.isGlobalZoom && !this.isCodeView) {
        elements[i].insertAdjacentHTML('afterbegin', elements[i].dataset.content);
      }
    }
  }
  
  codeView(elements) {
    this.zoom(elements);
    for(let i = 0; i < elements.length; i++) {
      elements[i].insertAdjacentHTML('afterbegin', elements[i].dataset.content);
      let originalElement = this._inspectorContent.querySelector('#' + elements[i].dataset.id);
      let firstCodeElement = this._createCodeElement(elements[i], originalElement);
      let secondCodeElement = this._createCodeElement(elements[i], originalElement, false);
      elements[i].insertBefore(firstCodeElement, elements[i].firstChild);
      elements[i].appendChild(secondCodeElement);
    }
  }
  
  makeElementsZoomable(elements) {
    // Define event handlers for the created elements
    let context = this;
    for(let i = 0; i < elements.length; i++) {
      elements[i].addEventListener('mouseover', function(e) {
        context._handleMouseOver(e, elements[i]);
      });
      elements[i].addEventListener('mouseleave', function(e) {
        context._handleMouseLeave(e, elements[i], elements);
      });
    }
    this.isZoomable = true;
  }
  
  deleteElements() {
    this._inspectorContent.querySelector('#created--root').remove();
    
    this._showedLevel = 0;
    this._maxNestedLevel = 0;
  }
  
  showNextHierarchyLevel(allElements) {
    // Find all elements with desired level and show them
    let elements = jQuery(allElements).find('.nested_' + (this._showedLevel + 1));
    if(elements.length > 0) {
      this.showElements(elements);
      this._showedLevel += 1;
    }
  }
  
  showElements(elements) {
    for(let i = 0; i < elements.length; i++) {
      elements[i].style.visibility = 'visible';
    }
  }
  
  
  //
  // Zoom view hover functionality
  //
  
  _handleMouseOver(e, element) {
    e.stopPropagation();
    
    let allParentElements = jQuery(element).parents('.created');
    let allChildElemets = jQuery(element).find('.created');
    let allElements = $.merge(allParentElements, allChildElemets);
    
    // Increase elements
    if(!this._isSingleZoom && !this.isGlobalZoom && this._isHighestElementOfHierarchy(element)){
      var elementsToZoom = $.merge([element], allElements);
      this.zoom(elementsToZoom); 
      this._isSingleZoom = true;
    }
     
    // Highlighting 
    for(let i = 0; i < allElements.length; i++) {
      allElements[i].style.backgroundColor = 'white';
    }
    element.style.backgroundColor = 'lightgrey';
  }
  
  _handleMouseLeave(e, element, allElements) {
    e.stopPropagation();
    
    // Reset highlighting
    for(let i = 0; i < allElements.length; i++) {
      allElements[i].style.backgroundColor = 'initial';
    }
    
    var infoLabels = this._inspectorContent.querySelectorAll(".infoLabel");
    for(let i = infoLabels.length - 1; 0 <= i; i--) {
      if(infoLabels[i] && infoLabels[i].parentElement) {
        if (infoLabels[i] != null) {
          infoLabels[i].parentElement.removeChild(infoLabels[i]);
        }
      }
    }
    
    // Decrease elements again
    if(this._isHighestElementOfHierarchy(element) && this._isSingleZoom) {
      this._undoZoom(element, element.children.length > 0);
      this._isSingleZoom = false;
    }
  }
   
   
  //
  // Zoom view helper functions
  //
  
  _increaseByHierarchyLevel(element, numberOfChildren, isParent)  {
    if (isParent) {
      // Increase by number of children + own increasement + cancel out padding of the child elements
      // The original element is necessary here because child elements increase automatically 
      // with their parents. Thus they would be way to big.
      let originalElement = this._inspectorContent.querySelector('#' + element.dataset.id);
      element.style.height = parseFloat(originalElement.offsetHeight) + 
        (numberOfChildren + 1) * helper.getDistanceValue() + 
        numberOfChildren * 3 * helper.getDistanceValue() +
        'px';
      element.style.width = parseFloat(originalElement.offsetWidth) + 
        (numberOfChildren + 1) * helper.getDistanceValue() + 
        numberOfChildren * 3 * helper.getDistanceValue() + 
        'px';
    }
    else {
      element.style.height = parseInt(element.style.height, 10) + 2 * helper.getDistanceValue() + 'px';
      element.style.width = parseInt(element.style.width, 10) + 2 * helper.getDistanceValue() + 'px';
    }
    
    var paddingValue = parseInt(element.style.padding, 10);
    if (paddingValue < 20 ) {
      element.style.padding = helper.getDistanceValue() + 'px';
    } 
  }
  
  _decreaseByHierarchyLevel(element, numberOfChildren, isParent)  {
    let originalElement = this._inspectorContent.querySelector('#' + element.dataset.id);
    if (isParent) {
      // Since parent elements did not have an inital size 
      // it is sufficient to remove the computed value here. 
      element.style.removeProperty('height');
      element.style.removeProperty('width');
    }
    else {
      element.style.height = parseInt(element.style.height, 10) - 2 * helper.getDistanceValue() + 'px';
      element.style.width = parseInt(element.style.width, 10) - 2 * helper.getDistanceValue() + 'px';
    }
    // Reset the added padding
    helper.copySpacing(element, originalElement);
  }
  
  _undoZoom(element, isParent) {
    // Resize element to its original size
    let tmp = jQuery(element).find('.created').length;
    let numberOfChildren = tmp > 0 ? tmp : 1 ;
    
    this._decreaseByHierarchyLevel(element, numberOfChildren, isParent);
    
    // Resize all child elements
    if(element.children.length > 0) {
      for (let i = 0; i < element.children.length; i++) {
        this._undoZoom(element.children[i], element.children[i].children.length > 0);
      }
    }
  }
  
  _isHighestElementOfHierarchy(element) {
    return element.parentElement == this._inspectorContent.querySelector('#created--root');
  }
  
  
  //
  // Click handlers
  //
  _handleOnClick(e, newElement, originalElement) {
    if(this.isGlobalZoom && !this.isCodeView) {
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
    } else if (this.isCodeView) {
      e.stopPropagation();
    } else {
      // Pass click event
      originalElement.click();
      
      // Highlight original element 
      originalElement.style.backgroundColor = 'red';
      window.setTimeout(function(){
        originalElement.style.backgroundColor = 'initial';
      }, 1000);
    }
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
    
    informationNode.addEventListener('mouseover', function() {
      this.style.overflow = 'visible';
      this.style.whiteSpace = 'normal';
    });
    
    informationNode.addEventListener('mouseleave', function() {
      this.style.overflow = 'hidden';
      this.style.whiteSpace = 'nowrap';
    });
    
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
  
  _getHtmlText(element) {
    let outerHtml = jQuery(element)
      .clone()    //clone the element
      .children() //select all the children
      .remove()   //remove all the children
      .end()[0].outerHTML
    var pre = document.createElement('pre');
    var text = document.createTextNode(outerHtml);
    pre.appendChild(text);
    return pre.innerHTML;
  }
  
  _createCodeElement(createdElement, originalElement, top=true) {
    let codeElement = document.createElement('div');
    codeElement.className = "codeElement";
    let content = this._getHtmlText(originalElement)
    if (top) {
      codeElement.innerHTML = content.match(/&lt;[a-zA-Z](.*?[^?])?&gt;/g);
      codeElement.style.left = parseFloat(createdElement.offsetLeft) + 1 + 'px';
      codeElement.style.top = parseFloat(createdElement.offsetTop) + 1 + 'px';
      codeElement.style.width = parseFloat(createdElement.offsetWidth) - 7 + 'px';
    } else {
      let tags = content.split(/&gt;(.|\n)*&lt;/g);
      if (tags.length > 1) {
        codeElement.innerHTML = '&lt;' + tags[tags.length-1].trim()
      }
      codeElement.style.left = parseFloat(createdElement.offsetLeft) + 1 + 'px';
      codeElement.style.top = parseFloat(createdElement.offsetTop) + parseFloat(createdElement.offsetHeight) -14 + 'px';
      codeElement.style.width = parseFloat(createdElement.offsetWidth) - 7 + 'px';
    }
    return codeElement;
  }
}
