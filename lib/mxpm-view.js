'use babel';

import { SelectListView } from 'atom-space-pen-views';

export default class MxpmView extends SelectListView {

  constructor(serializedState) {
    super()
    this.addClass('overlay from-top')
    this.setItems(['Hello', 'World'])
    if (!this.panel) {
      this.panel = atom.workspace.addModalPanel({item: this});
    }
    this.panel.show();
    this.focusFilterEditor();
  }
  
  toggle () {
    console.log('toggle');
    if (this.panel && this.panel.isVisible()) {
      return this.cancel();
    } else {
      return this.show();
    }
  }
  
  viewForItem (item) {
    `<li>${item}</li>`
  }
  
  confirmed (item) {
    console.log(`${item} was selected`);
  }
  
  cancelled () {
    console.log("this view was cancelled");
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

}
