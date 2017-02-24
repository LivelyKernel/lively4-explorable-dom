'use strict';

import * as helper from '../helper.js';
import ContainerView from './containerView.js';

export default class ZoomableView extends ContainerView {

  _addContentToElements(elements) {
    for(let i = 0; i < elements.length; i++) {
      var br = document.createElement('br');
      elements[i].prepend(br);
      elements[i].insertAdjacentHTML('afterbegin', this._elementContentText(elements[i]));
    }
  }
  
  _elementContentText(element) {
    let content = element.dataset.content;
    let tag = element.dataset.tagName;
    return (content.length > 0) ? (tag + ': ' + content) : tag;
  }

  _zoom(elements) {
    let maxCount = 1;
    let count = 1;

    for(let i = 0; i < elements.length; i++){
      if(elements[i].children.length > 0) {
        let numberOfChildren = elements[i].getElementsByClassName('created').length;
        this._increaseByHierarchyLevel(elements[i], numberOfChildren, true);

        // Reset counters
        maxCount = 1;
        count = 1;
      } else {
        this._increaseByHierarchyLevel(elements[i], 1, false);
      }
      
      // Handle table row elements (Hack)
      if(elements[i].style.display.startsWith('table-row')) {
        elements[i].style.display = 'block';
      }
    }
  }

  _bindZoomEventHandlers(elements) {
    // Define event handlers for the created elements
    for(let i = 0; i < elements.length; i++) {
      elements[i].addEventListener('mouseover', (e) => this._handleMouseOver(e, elements[i]));
      elements[i].addEventListener('mouseleave', (e) => this._handleMouseLeave(e, elements[i], elements));
    }
  }
  
  _isOverflowed(element){
    return element.scrollWidth > element.clientWidth;
  }

  _handleMouseOver(e, element) {
    e.stopPropagation();

    let allParentElements = jQuery(element).parents('.created');
    let allChildElements = jQuery(element).find('.created');
    let allElements = jQuery.merge(allParentElements, allChildElements);

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
  }

  _increaseByHierarchyLevel(element, numberOfChildren, isParent)  {
    let distanceValue = 20; // factor for increasing an elements' size
    if (isParent) {
      // Increase by number of children + own increasement + cancel out padding of the child elements
      // The original element is necessary here because child elements increase automatically with their parents
      // Thus they would be way to big
      let originalElement = this._inspectorContent.querySelector('#' + element.dataset.id);
      element.style.height = parseFloat(originalElement.offsetHeight) +
        (numberOfChildren + 1) * distanceValue +
        numberOfChildren * 3 * distanceValue +
        'px';
      element.style.width = parseFloat(originalElement.offsetWidth) +
        (numberOfChildren + 1) * distanceValue +
        numberOfChildren * 3 * distanceValue +
        'px';
    }
    else {
      element.style.height = parseInt(element.style.height, 10) + 2 * distanceValue + 'px';
      element.style.width = parseInt(element.style.width, 10) + 2 * distanceValue + 'px';
    }

    var paddingValue = parseInt(element.style.padding, 10);
    if (paddingValue < 20 ) {
      element.style.padding = distanceValue + 'px';
    }
  }

  _decreaseByHierarchyLevel(element, isParent)  {
    let originalElement = this._inspectorContent.querySelector('#' + element.dataset.id);
    let text = jQuery(originalElement).clone().children().remove().end().text().trim();
    if (isParent) {
      // Since parent elements did not have an inital size it is sufficient to remove the computed value here
      element.style.removeProperty('height');
      element.style.removeProperty('width');
    }

    if(element.children.length === 0 || text.length !== 0 ) {
      helper.copySize(element, originalElement);
    }

    // Reset the added padding
    helper.copySpacing(element, originalElement);
  }
}
