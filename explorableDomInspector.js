import ContainerView from './containerView.js';

export default class ExplorableDomInspector {
  
  constructor(originalDom, inspectorDom) {
    
    this._originalDom = originalDom;
    this._inspectorDom = inspectorDom;
    this._currentView = undefined;
  }
  
  showView() {
    if(this._originalDom.getAllCreatedElements().length > 0) {
      this.hideView();
    }
    
    this._createView();
    this._setOpacity('0.3');
    this._disableShowContainerButton(true);
    this._disableHideContainerButton(false);
    if(this._currentView.getMaxNestedLevel() > 0) {
      this._disableNextHierarchyButton(false);
    }
  }
  
  hideView() {
    this._currentView.deleteElements();
    this._setOpacity('1');
    this._disableShowContainerButton(false);
    this._disableHideContainerButton(true);
    this._disableNextHierarchyButton(true);
  }
  
  showNextHierarchyLevel(){
    this._currentView.showNextHierarchyLevel();
  
    if(this._currentView.getShowedLevel() === this._currentView.getMaxNestedLevel()) {
      this._disableNextHierarchyButton(true);
    }
  }
  
  _createView() {
    this._initialParent = this._originalDom.getElementsByTagName('body')[0];
    this._childElements = this._originalDom.querySelectorAll('#main-content > *');
    this._currentView = new ContainerView(this._initialParent, this._childElements);
  }
  
  _setOpacity(value) {
    this._originalDom.getElementById('main-content').style.opacity = value;
  }
  
  _disableShowContainerButton(expr) {
   this._inspectorDom.get('#showContainerButton').disabled = expr;
  }

  _disableNextHierarchyButton(expr) {
    this._inspectorDom.get('#nextHierarchyLevelButton').disabled = expr;
  }
  
  _disableHideContainerButton(expr) {
    this._inspectorDom.get('#hideContainerButton').disabled = expr;
  }
}