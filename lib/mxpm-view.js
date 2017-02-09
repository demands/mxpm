'use babel';

import { SelectListView } from 'atom-space-pen-views';

export default class MxpmView extends SelectListView {
  constructor() {
    super()
    this.addClass('overlay from-top')
  }

  toggle () {
    if (this.panel && this.panel.isVisible()) {
      this.cancel();
    } else {
      this.show();
    }
  }

  getEmptyMessage (itemCount) {
    if (itemCount === 0)
      return 'Project is empty';
    return super.getEmptyMessage(itemCount);
  }

  destroy () {
    if (this.panel) {
      this.panel.destroy();
    }
  }

  show () {
    if (!this.panel) {
      this.panel = atom.workspace.addModalPanel({item: this});
    }
    this.panel.show()
    this.startLoadProjectsTask();
    this.focusFilterEditor();
  }

  hide () {
    if (this.panel) {
      this.panel.hide();
    }
    this.stopLoadProjectsTask();
  }

  viewForItem (item) {
    return `<li class="two-lines selected" is="space-pen-li">
      <div class="primary-line file icon icon-repo">${item.filename}</div>
      <div class="secondary-line path no-icon">${item.fullpath}</div>
    </li>`;
  }

  getFilterKey (item) {
    return "filename";
  }

  confirmed (item) {
    if (atom.project.getPaths().indexOf(item.fullpath) >= 0) {
      atom.project.removePath(item.fullpath);
    } else {
      atom.project.addPath(item.fullpath);
    }
    this.hide();
  }

  cancelled () {
    this.hide()
  }

  startLoadProjectsTask() {
    this.stopLoadProjectsTask();
    ProjectLoader = require('./project-loader');
    this.loadProjectsTask = ProjectLoader.startTask((projects) => {
      this.setItems(projects);
    })
  }

  stopLoadProjectsTask() {
    if (!this.active) return;
    if (this.loadProjectsTask) {
      this.loadProjectsTask.terminate();
      this.loadProjectsTask = null;
    }
  }
}
