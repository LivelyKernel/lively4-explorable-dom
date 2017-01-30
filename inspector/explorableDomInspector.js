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

  basicView() {
    // Switch to basic view
    this._switchView('basic');

    // Make background less prominent
    this._setOpacity('0.3');

    // Adapt slider position
    this._setSliderPosition(1);
  }

  showPreviousHierarchyLevel() {
    this._currentView.showHierarchyLevel(this._currentView.getShowedLevel() - 1);

    this._disableNextHierarchyButton(false);

    if(this._currentView.getShowedLevel() === 0) {
      this._disablePreviousHierarchyButton(true);
    }
  }

  showNextHierarchyLevel() {
    this._currentView.showHierarchyLevel(this._currentView.getShowedLevel() + 1);

    this._disablePreviousHierarchyButton(false);

    if(this._currentView.getShowedLevel() === this._currentView.getMaxNestedLevel()) {
      this._disableNextHierarchyButton(true);
    }
  }

  zoomableElementsView() {
    this._switchView('zoomableElements');

    // Adapt inspector
    this._setOpacity('0.3');
    this._setSliderPosition(2);
  }

  zoomView() {
    this._switchView('zoom');

    // Adapt inspector
    this._setOpacity('0.1');
    this._setSliderPosition(3);
  }

  codeView() {
    this._switchView('code');

   // Adapt inspector
    this._setOpacity('0.1');
    this._setSliderPosition(4);
  }

  hideView(switchView=false) {
    // Reset changes
    if(this._currentView) {
      this._currentView.deleteElements();

      if(!switchView) {
        this._currentView = undefined;
      }
    }

    this._setOpacity('1');
    this._disablePreviousHierarchyButton(true);
    this._disableNextHierarchyButton(true);
    this._disableHideViewButton(true);
    this._setSliderPosition(0);
  }

  _createView(type, hierarchyLevel) {
    let inspectorContent = this._originalDom.querySelector('#inspector-content');
    let originalParent = this._originalDom.querySelector('#inspector-content::shadow #container-root');
    let childElements = this._originalDom.querySelectorAll('#inspector-content > *');
    let view;
    switch (type) {
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
    this._disableHideViewButton(false);
  }

  _switchView(type) {
    // Save hierarchy level
    let hierarchyLevel;
    if(this._currentView) {
      hierarchyLevel = this._currentView.getShowedLevel();
    }

    this.hideView(true);
    // Create view (create copied elements, etc.)
    this._createView(type, hierarchyLevel);

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

  //
  // Template helper functions for enabeling/disabeling buttons, setting slider and opacity
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

  _setSliderPosition(value) {
    this._inspectorDom.querySelector('#slider').value = value;
  }

  _setOpacity(value) {
    let elementsSelector = '#inspector-content > *:not(#' + helper.getCreatedRootSelector() + ')';
    let elements = this._originalDom.querySelectorAll(elementsSelector)
    // let elements = [this._originalDom.querySelector('#inspector-content').shadowRoot.querySelector('#container-root')]
    if(value < 1) {
      elements.forEach(element => element.style.opacity = value);
    } else {
      elements.forEach(element => element.style.opacity = 'initial');
    }
    // if(this._currentView) {
      // let created = this._originalDom.querySelector('#inspector-content > #'  + helper.getCreatedRootSelector());
      // created.style.opacity = '1';
    // }
  }
}
