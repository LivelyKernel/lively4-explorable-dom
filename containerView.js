class ContainerView {
  
  constructor(initialParent, originalElements) {
    
    this._showedLevel = 0;
    this._maxNestedLevel = 0;
    
    this._create(initialParent, originalElements);
  }
  
  getShowedLevel() {
    return this._showedLevel;
  }
  
  getMaxNestedLevel() {
    return this._maxNestedLevel;
  }
  
  _create(initialParent, originalElements) {
    for (let i = 0; i < originalElements.length; i++) {
      if (originalElements[i].tagName != 'SCRIPT') {
        this._copyElement(initialParent, originalElements[i]);
      }
    }
  }
  
  _copyElement(parentElement, element, nested = false, nestingLevel = 0) {
    var newElement = document.createElement('div');
    
    // Set style information for the new element
    newElement.style.borderColor = getRandomColor();
    newElement.style.borderWidth = '2px';
    newElement.style.borderStyle = 'solid';
    newElement.style.top = element.getBoundingClientRect().top - parentElement.getBoundingClientRect().top + 'px';
    newElement.style.left = element.getBoundingClientRect().left - parentElement.getBoundingClientRect().left + 'px';
    newElement.style.width = element.offsetWidth + 'px';
    newElement.style.height = element.offsetHeight + 'px';
    newElement.style.position = 'absolute';
    newElement.style.opacity = '1';
    //newElement.style.pointerEvents = 'none';
    var style =  window.getComputedStyle(element, null).display;
    if ((style == 'inline-block') || (style == 'block') || (style == 'inline')) {
      newElement.style.display = style;
    } else {
      newElement.style.display = 'block';
    }
    
    // Child elements are hidden by default --> only first hierarchy level is shown
    if(nested) {
      newElement.style.visibility = 'hidden';
      newElement.classList.add('nested_' + nestingLevel);
    }
    
    newElement.innerHTML += element.tagName;
    newElement.classList.add('created');
    
    if(element.id === "") {
      element.id = getRandomId();
    }
    newElement.dataset.id = element.id;
    
    parentElement.appendChild(newElement);
    
    
    // Keep hierarchy information by adding child elements recursively 
    if(element.children.length > 0) {
      var childNodes = getDirectChildNodes(element);
      nestingLevel += 1;
      disableNextHierarchyButton(false);
      
      for(let j = 0; j < childNodes.length; j++) {
        this._copyElement(newElement, childNodes[j], true, nestingLevel);
      }
    }
    
    if (nestingLevel > this._maxNestedLevel) {
      this._maxNestedLevel = nestingLevel;
    }  
  }
  
  deleteElements() {
    var elements = document.getElementsByClassName('created');
    while(elements.length > 0) {
      elements[0].remove();
    }
    
    this._showedLevel = 0;
    this._maxNestedLevel = 0;
  }
  
  showNextHierarchyLevel() {
    var elements = document.getElementsByClassName('created nested_' + (this._showedLevel + 1));
    
    // Find all elements with desired level and show them
    if(elements.length > 0) {
      for(let i = 0; i < elements.length; i++) {
        elements[i].style.visibility = 'visible';
      }
      this._showedLevel += 1;
    }
  }
  
  // currently not used
  showAllHierarchyLevels() {
    var elements = document.getElementsByClassName('created');
    for(let i = 0; i < elements.length; i++) {
      elements[i].style.visibility = 'visible';
    }
  }
}