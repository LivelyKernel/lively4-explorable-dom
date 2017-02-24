'use strict';

import * as helper from '../helper.js';

export default class ContainerView {

  constructor(inspectorContent, originalParent, originalElements, hierarchyLevel=null) {
    this._viewType = 'basic';
    this._opacityValue = '0.3'; // defines the opacity value for the original elements
    this._inspectorContent = inspectorContent;
    this._showedLevel = 0;
    this._maxNestedLevel = 0;

    this._create(originalParent, originalElements);

    // Show defined hierarchy level if specified
    if (hierarchyLevel != null) {
      this.showHierarchyLevel(hierarchyLevel);
    }
  }
  
  getViewType() {
    return this._viewType;
  }
  
  getOpacityValue() {
    return this._opacityValue;
  }

  getShowedLevel() {
    return this._showedLevel;
  }

  getMaxNestedLevel() {
    return this._maxNestedLevel;
  }
  
  getTagNames() {
    let elements = this._getAllCreatedElements();
    let allTags = [].slice.call(elements).map(element => element.dataset.tagName);
    return allTags;
  }

  showHierarchyLevel(level) {
    if (level > this._maxNestedLevel || level < 0) {
      return;
    }

    if (level >= this._showedLevel) {
      let allElements = this._getAllCreatedElements();
      let elements = jQuery(allElements).not('[class*="nested"]');
      
      // Find all elements with desired level
      for(let i = 1; i <= level; i++) {
        elements = jQuery.merge(elements, jQuery(allElements).find('.nested_' + i));
      }

      // Show them
      if(elements.length > 0) {
        this._showElements(elements);
      }
    } else if(level < this._showedLevel) {
      let allElements = this._getAllCreatedElements();
      this._showElements(allElements);
      
      // Find all elements with desired level
      let elements = [];
      for(let i = this._maxNestedLevel; i > level; i--) {
        elements = jQuery.merge(elements, jQuery(allElements).find('.nested_' + i));
      }

      // Hide them
      if(elements.length > 0) {
        this._hideElements(elements);
      }
    }

    this._showedLevel = level;
  }
  
  showElementsByTag(tag) {
    let elements = this._getAllCreatedElements();
    this.showHierarchyLevel(this._showedLevel);
    let elementsToHide = [].slice.call(elements).filter(element => element.dataset.tagName !== tag);
    this._hideElements(elementsToHide);
  }

  deleteElements() {
    this._inspectorContent.querySelector('#' + this._toolElementsRootId()).remove();
    let elements = this._inspectorContent.querySelectorAll('#wrap--original > *');
    jQuery(elements).unwrap('#wrap--original')

    this._showedLevel = 0;
    this._maxNestedLevel = 0;
  }

  _create(originalParent, originalElements) {
    var wrapDiv = document.createElement('div');
    wrapDiv.id = 'wrap--original';
    jQuery(originalElements).wrapAll(wrapDiv);
    
    // Create a new div with the position and size of the original container
    // This div will be used as new root and is absolutely positioned
    // Thus it is easier to position the actual elements correctly
    var newParent = document.createElement('div');
    newParent.id = this._toolElementsRootId();
    helper.copySpacing(newParent, originalParent);
    helper.copySize(newParent, originalParent);

    this._inspectorContent.appendChild(newParent);

    for (let i = 0; i < originalElements.length; i++) {
      if (originalElements[i].tagName != 'SCRIPT' && originalElements[i].tagName != 'LINK') {
        this._copyElement(newParent, originalElements[i]);
      }
    }
  }

  _copyElement(parentElement, element, nested = false, nestingLevel = 0, fixedPosition = false) {
    let toolElement = document.createElement('div');

    // Set style information for the new element
    helper.copySpacing(toolElement, element);
    toolElement.style.borderColor = helper.getColourFromInt(nestingLevel);
    toolElement.style.display =  window.getComputedStyle(element, null).display;
    toolElement.classList.add(this._toolElementsClassName());

    // Child elements are hidden by default --> only first hierarchy level is shown
    if(nested) {
      toolElement.style.visibility = 'hidden';
      toolElement.classList.add('nested_' + nestingLevel);
    }

    if(element.id === "") {
      element.id = helper.generateRandomId();
    }

    // Set elements content data, save the id and the tag name
    toolElement.dataset.id = element.id;
    toolElement.dataset.tagName = element.tagName;
    
    
    // This is a really ugly hack to get only the text of the actual element
    let text = jQuery(element).clone().children().remove().end().text().trim();
    toolElement.dataset.content = text;
    
    parentElement.appendChild(toolElement);

    // Only the last children of the hierarchy and element with text inside need an actual sizement
    // All other elements are sized by their children
    if(element.children.length === 0 || text.length !== 0 ) {
      helper.copySize(toolElement, element);
    }

    // Elements whose parent has some text inside need a concrete positioning
    // Because we do not copy the text the position gets lost
    if(fixedPosition) {
      helper.copyPosition(toolElement, element, parentElement);
    }

    // Keep hierarchy information by adding child elements recursively
    if(element.children.length > 0) {
      nestingLevel += 1;

      for(let j = 0; j <  element.children.length; j++) {
        this._copyElement(toolElement, element.children[j], true, nestingLevel, text.length !== 0);
      }
    }

    if (nestingLevel > this._maxNestedLevel) {
      this._maxNestedLevel = nestingLevel;
    }

    // Add click handler
    toolElement.addEventListener('click', e => this._handleOnClick(e, toolElement, element));
  }

  _showElements(elements) {
    for(let i = 0; i < elements.length; i++) {
      elements[i].style.visibility = 'visible';
    }
  }

  _hideElements(elements) {
    for(let i = 0; i < elements.length; i++) {
      elements[i].style.visibility = 'hidden';
    }
  }

  _getAllCreatedElements() {
    return this._inspectorContent.getElementsByClassName(this._toolElementsClassName());
  }

  _showAllHierarchyLevels() {
    let elements = this._getAllCreatedElements();
    this._showElements(elements);
    this._showedLevel = this._maxNestedLevel;
  }

  _handleOnClick(e, toolElement, originalElement) {
    e.stopPropagation()
    // Pass click event
    originalElement.click();

    // Highlight original element
    originalElement.style.backgroundColor = 'red';
    window.setTimeout(() => {
      originalElement.style.backgroundColor = 'initial';
    }, 1000);
  }
  
  // Id of the div root element of the created tool elements
  // Extra method because the id is used across multiple views
  _toolElementsRootId() {
    return 'created--root';
  }
  
  // Class of the created tool elements
  _toolElementsClassName() {
    return 'created';
  }
}
