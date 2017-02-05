'use babel';

export default {
  activate (state) {
    this.active = true;

    atom.commands.add('atom-workspace', {
      'mxpm:toggle': () => this.createMxpmView().toggle(),
    });
  },

  createMxpmView() {
    if (!this.mxpmView) {
      MxpmView = require('./mxpm-view');
      this.mxpmView = new MxpmView();
    }
    return this.mxpmView;
  },
};
