'use babel';

export default {
  activate (state) {
    this.active = true;

    atom.commands.add('atom-workspace', {
      'mxpm:togglePathList': () => this.createPathListView().toggle(),
    });
  },

  createPathListView() {
    if (!this.mxpmView) {
      PathListView = require('./path-list-view');
      this.mxpmView = new PathListView();
    }
    return this.mxpmView;
  },
};
