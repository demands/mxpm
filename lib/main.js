'use babel';

export default {
  activate (state) {
    this.active = true;

    atom.commands.add('atom-workspace', {
      'mxpm:toggle-path-list': () => this.togglePathList(),
      'mxpm:reset-project': () => this.resetProject(),
    });
  },

  createPathListView() {
    if (!this.mxpmView) {
      PathListView = require('./path-list-view');
      this.mxpmView = new PathListView();
    }
    return this.mxpmView;
  },
  
  /* opens (or closes) the path list view */
  togglePathList () {
    this.createPathListView().toggle();
  },
  
  /* removes all folders from the current project */
  resetProject() {
    atom.project.getPaths().forEach(path => atom.project.removePath(path))
    this.togglePathList();
  }
};
