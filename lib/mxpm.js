'use babel';

import MxpmView from './mxpm-view';
import { CompositeDisposable } from 'atom';
import path from 'path';
import fs from 'fs';

export default {

  mxpmView: null,
  modalPanel: null,
  subscriptions: null,

  activate (state) {
    this.active = true;
    
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'mxpm:toggle': () => this.createMxpmView().toggle()
    }));
  },

  deactivate () {
    if (this.mxpmView) {
      this.mxpmView.destroy();
      this.modalPanel.destroy();
    }
    this.subscriptions.dispose();
  },

  serialize () {
    return {
      // mxpmViewState: this.mxpmView.serialize()
    };
  },
  
  createMxpmView() {
    if (!this.mxpmView) {
      this.mxpmView = new MxpmView(['foo', 'bar'])
    }
    return this.mxpmView;
  },
  
  getProjectList() {
    const projectDir = process.env.PROJECTS;
    fs.readdir(projectDir, function (err, files) {
      if (err) console.error(err);
      files.forEach((filename) => {
        const fullpath = path.join(projectDir, filename);
        fs.lstat(fullpath, (err, stats) => {
          if (err) console.error(err);
          if(stats && stats.isDirectory()) {
            console.log(filename);
          }
        })
      })
    });
  },

  toggle() {
    this.getProjectList();
    
    this.createMxpmView();
    
    // return (
    //   this.modalPanel.isVisible() ?
    //   this.modalPanel.hide() :
    //   this.modalPanel.show()
    // );
  }

};
