'use babel';

import { SelectListView } from 'atom-space-pen-views';
import _ from 'lodash';
import path from 'path';

export default class PathListView extends SelectListView {
  constructor() {
    super()
    this.addClass('fuzzy-finder mxpm-path-list')
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
    let liClassName = "two-lines";
    let primaryLineClassName = "primary-line file icon"
    let primaryLineText = item.filename;
    if (item.isOpen) {
      liClassName += " is-open";
      primaryLineClassName += " icon-book"
      primaryLineText += " [OPENED]"
    } else {
      primaryLineClassName += " icon-repo"
    }
    return `<li class="${liClassName}">
      <div class="${primaryLineClassName}">${primaryLineText}</div>
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
