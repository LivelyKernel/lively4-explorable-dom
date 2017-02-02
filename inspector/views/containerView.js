'use strict';

import * as helper from '../helper.js';

export default class ContainerView {

  constructor(inspectorContent, originalParent, originalElements, hierarchyLevel=undefined) {
    this._inspectorContent = inspectorContent;
    this._showedLevel = 0;
    this._maxNestedLevel = 0;

    this._create(originalParent, originalElements);

    // Show defined hierarchy level if specified
    if (hierarchyLevel !== undefined) {
      this.showHierarchyLevel(hierarchyLevel);
    }
  }

  getShowedLevel() {
    return this._showedLevel;
  }

  getMaxNestedLevel() {
    return this._maxNestedLevel;
  }

  showHierarchyLevel(level) {
    if (level > this._maxNestedLevel || level < 0) {
      return;
    }

    if (level > this._showedLevel) {
      // Find all elements with desired level
      let allElements = this._getAllCreatedElements();
      let elements = [];
      for(let i = 1; i <= level; i++) {
        elements = jQuery.merge(elements, jQuery(allElements).find('.nested_' + i));
      }

      // Show them
      if(elements.length > 0) {
        this._showElements(elements);
      }
    } else if(level < this._showedLevel) {
      // Find all elements with desired level
      let allElements = this._getAllCreatedElements();
      let elements = [];
      for(let i = this._maxNestedLevel; i > level; i--) {
        elements = jQuery.merge(elements, jQuery(allElements).find('.nested_' + i));
      }

      // Hide them
      if(elements.length > 0) {
        this._hideElements(elements);
      }
    } else {
      return;
    }

    this._showedLevel = level;
  }

  deleteElements() {
    this._inspectorContent.querySelector('#' + helper.getCreatedRootSelector()).remove();

    this._showedLevel = 0;
    this._maxNestedLevel = 0;
  }

  _create(originalParent, originalElements) {
    // Create a new div with the position and size of the original container.
    // This div will be used as new root and is absolutely positioned. Thus it
    // is easier to position the actual elements correctly.
    var newParent = document.createElement('div');
    newParent.id = helper.getCreatedRootSelector();
    helper.copySpacing(newParent, originalParent);
    helper.copySize(newParent, originalParent);
    // newParent.style.top = this._inspectorContent.querySelector('#inspector-content').shadowRoot.querySelector('#container-root').getBoundingClientRect().top + 'px';
    // newParent.style.left = this._inspectorContent.querySelector('#inspector-content').shadowRoot.querySelector('#container-root').getBoundingClientRect().left + 'px';

    this._inspectorContent.appendChild(newParent);

    for (let i = 0; i < originalElements.length; i++) {
      if (originalElements[i].tagName != 'SCRIPT' && originalElements[i].tagName != 'LINK') {
        this._copyElement(newParent, originalElements[i]);
      }
    }
  }

  _copyElement(parentElement, element, nested = false, nestingLevel = 0, fixedPosition = false) {
    let newElement = document.createElement('div');

    // Set style information for the new element
    helper.copySpacing(newElement, element);
    newElement.style.borderColor = helper.getColourFromInt(nestingLevel);
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

    // Set elements content data
    // This is a really ugly hack to get only the text of the actual element
    let text = jQuery(element).clone().children().remove().end().text().trim();
    newElement.dataset.content = (text.length > 0) ? text : element.tagName;
    
    parentElement.appendChild(newElement);

    // Only the last children of the hierarchy and element with text inside need an actual sizement.
    // All other elements are sized by their children
    if(element.children.length === 0 || text.length !== 0 ) {
      helper.copySize(newElement, element);
    }

    // Elements whose parent has some text inside need a concrete positioning.
    // Because we do not copy the text the position gets lost.
    if(fixedPosition) {
      helper.copyPosition(newElement, element, parentElement);
    }

    // Keep hierarchy information by adding child elements recursively
    if(element.children.length > 0) {
      nestingLevel += 1;

      for(let j = 0; j <  element.children.length; j++) {
        this._copyElement(newElement, element.children[j], true, nestingLevel, text.length !== 0);
      }
    }

    if (nestingLevel > this._maxNestedLevel) {
      this._maxNestedLevel = nestingLevel;
    }

    // Add click handler
    newElement.onclick = (e) => this._handleOnClick(e, newElement, element);
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
    return this._inspectorContent.getElementsByClassName('created');
  }

  _showAllHierarchyLevels() {
    let elements = this._getAllCreatedElements();
    this._showElements(elements);
    this._showedLevel = this._maxNestedLevel;
  }

  //
  // Click handlers
  //
  _handleOnClick(e, newElement, originalElement) {
    e.stopPropagation()
    // Pass click event
    originalElement.click();

    // Highlight original element
    originalElement.style.backgroundColor = 'red';
    window.setTimeout(() => {
      originalElement.style.backgroundColor = 'initial';
    }, 1000);
  }
}
