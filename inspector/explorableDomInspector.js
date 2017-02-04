'use strict';

import ContainerView from './views/containerView.js';
import ZoomableElementsView from './views/zoomableElementsView.js';
import ZoomView from './views/zoomView.js';
import CodeView from './views/codeView.js';
import * as helper from './helper.js';

export default class ExplorableDomInspector {

  constructor(originalDom, inspectorDom) {
    this._originalDom = originalDom;
    this._inspectorDom = inspectorDom;
    this._currentView = undefined;
  }
  
  showView(viewType) {
    // Switch to specified view
    this._switchView(viewType);
  }

  hideView(switchView=false, switchFile=false) {
    // Reset changes
    if(switchFile) {
      // Do not need to set opacity or delete elements because the content gets overwritten anyway
      this._currentView = undefined;
    } else if(this._currentView) {
      this._setOpacity('1');
      this._currentView.deleteElements();

      if(!switchView) {
        this._currentView = undefined;
        this._updateHierarchyInformation(true);
        this._updateTagSelect(true);
      }
    }
    
    this._disablePreviousHierarchyButton(true);
    this._disableNextHierarchyButton(true);
    this._disableHideViewButton(true);
  }
  
  switchFile() {
    if(this._currentView) {
      this._switchView(this._currentView.getViewType(), true);
    }
  }
  
  showPreviousHierarchyLevel() {
    this._currentView.showHierarchyLevel(this._currentView.getShowedLevel() - 1);
    
    this._updateHierarchyInformation();

    this._disableNextHierarchyButton(false);
    if(this._currentView.getShowedLevel() === 0) {
      this._disablePreviousHierarchyButton(true);
    }
  }

  showNextHierarchyLevel() {
    this._currentView.showHierarchyLevel(this._currentView.getShowedLevel() + 1);
    
    this._updateHierarchyInformation();

    this._disablePreviousHierarchyButton(false);
    if(this._currentView.getShowedLevel() === this._currentView.getMaxNestedLevel()) {
      this._disableNextHierarchyButton(true);
    }
  }

  _switchView(type, isNewFile=false) {
    // Save hierarchy level
    let hierarchyLevel;
    if(this._currentView) {
      hierarchyLevel = this._currentView.getShowedLevel();
    }

    this.hideView(true, isNewFile);
    // Create view (create copied elements, etc.)
    this._createView(type, hierarchyLevel);
    
    // Update hierarchy level information and tagName filter
    this._updateHierarchyInformation();
    this._updateTagSelect();
    
    // Make background less prominent
    this._setOpacity(this._currentView.getOpacityValue());
    
    this._disableHideViewButton(false);

    // Enable hierarchy button only if there are nested elements
    if(this._currentView.getMaxNestedLevel() > 0) {
      this._disableNextHierarchyButton(false);
    }

    if(this._currentView.getShowedLevel() > 0) {
      this._disablePreviousHierarchyButton(false);
    }

    if (this._currentView.getShowedLevel() === this._currentView.getMaxNestedLevel()) {
      this._disablePreviousHierarchyButton(false);
      this._disableNextHierarchyButton(true);
    }
  }
  
  _createView(viewType, hierarchyLevel) {
    let inspectorContent = this._originalDom.querySelector('#inspector-content');
    let originalParent = this._originalDom.querySelector('#inspector-content::shadow #container-root');
    let childElements = this._originalDom.querySelectorAll('#inspector-content > *');
    let view;
    switch (viewType) {
      case 'basic':
        view = ContainerView;
        break;
      case 'zoom':
        view = ZoomView;
        break;
      case 'zoomableElements':
        view = ZoomableElementsView;
        break;
      case 'code':
        view = CodeView;
        break;
      default:
        view = ContainerView;
    }
    this._currentView = new view(inspectorContent, originalParent, childElements, hierarchyLevel);
  }

  //
  // Template helper functions for enabeling/disabeling buttons and setting opacity
  //

  _disablePreviousHierarchyButton(expr) {
    this._inspectorDom.querySelector('#previousHierarchyLevelButton').disabled = expr;
  }

  _disableNextHierarchyButton(expr) {
    this._inspectorDom.querySelector('#nextHierarchyLevelButton').disabled = expr;
  }

  _disableHideViewButton(expr) {
    this._inspectorDom.querySelector('#hideViewButton').disabled = expr;
  }

  _setOpacity(value) {
    if (this._currentView) {
      let wrapper = this._originalDom.querySelector('#inspector-content > #wrap--original');
      if(wrapper) {
        wrapper.style.opacity = value; 
      }
    }
  }
  
  _updateHierarchyInformation(setDefault=false) {
    if (setDefault) {
      this._inspectorDom.querySelector('#hierarchyLevel').innerText = '- / -';
    } else {
      let currentLvl = this._currentView.getShowedLevel() + 1;
      let maxLvl = this._currentView.getMaxNestedLevel() + 1;
      this._inspectorDom.querySelector('#hierarchyLevel').innerText = currentLvl + ' / ' + maxLvl;
    }
  }
  
  _updateTagSelect(setDefault=false) {
    let select = this._inspectorDom.querySelector('#tagSelect');
    // Clear select
    select.innerHTML = '';
    
    // Add default option
    let defaultOpt = document.createElement('option');
    defaultOpt.value = 0;
    defaultOpt.innerHTML = '-';
    if (setDefault) {
      // TODO: disable defaultOpt
    }
    select.appendChild(defaultOpt);
    
    if (!setDefault) {
      // Add tagName options
      let elements = this._currentView._getAllCreatedElements(); // TODO: fix private access, e.g get created tagNames as public method and move forloop to view
      let allTags = [].slice.call(elements).map(element => element.dataset.tagName);
      let tags = allTags.filter((element, index, self) => index == self.indexOf(element));
      for (let i = 0; i < tags.length; i++) {
        let opt = document.createElement('option');
        opt.value = i+1;
        opt.innerHTML = tags[i];
        select.appendChild(opt);
      }
    }
  }
}
