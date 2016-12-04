/*
 * # LivelyDomInspector 
 */
import Morph from './Morph.js';
import ExplorableDomInspector from '../../lively4-explorable-dom/explorableDomInspector.js';

export default class DomInspector extends Morph {

  initialize() {
    lively.notify("[dom-inspector] intialize");
  }
  
  inspect(dom) {
    this._inspector = new ExplorableDomInspector(dom, this);
    this.get("#showContainerButton").onclick = this._showContainer;
    this.get("#hideContainerButton").onclick = this._hideContainer;
    this.get("#nextHierarchyLevelButton").onclick = this._showNextHierarchyLevel;
    window.that = this._inspector;
  }
  
  _showContainer() {
    window.that.showView(this._initialParent, this._childElements);
  }
  
  _hideContainer(){
    window.that.hideView();
  }

  _showNextHierarchyLevel() {
    window.that.showNextHierarchyLevel();
  }
}