'use babel';

import { SelectListView } from 'atom-space-pen-views';
import _ from 'lodash';
import path from 'path';

export default class MxpmView extends SelectListView {
  constructor() {
    super()
    this.addClass('fuzzy-finder mxpm-project-list')
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
    let primaryLine = item.filename;
    let className = "two-lines";
    if (item.isOpen) {
      primaryLine += " [OPENED]"
      className += " is-open";
    }
    return `<li class="${className}">
      <div class="primary-line file icon icon-repo">${primaryLine}</div>
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
      this.setItems(
        _(atom.project.getPaths())
          .map((fullpath) => ({
            fullpath,
            filename: path.basename(fullpath),
            isOpen: true,
          }))
          .concat(_.sortBy(projects, 'filename'))
          .uniqBy('fullpath')
          .value()
      );
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
