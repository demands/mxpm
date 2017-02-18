'use babel';

import Mxpm from '../lib/main';

describe('Mxpm', () => {
  let workspaceElement, activationPromise;

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace);
    activationPromise = atom.packages.activatePackage('mxpm');
  });

  describe('when the mxpm:toggle-path-list event is triggered', () => {
    it('hides and shows the modal panel', () => {
      atom.commands.dispatch(workspaceElement, 'mxpm:toggle-path-list');
      waitsForPromise(() => activationPromise);

      runs(() => {
        let mxpmElement = workspaceElement.querySelector('.mxpm-path-list');
        expect(mxpmElement).toExist();

        let mxpmPanel = atom.workspace.getModalPanels().find(p => p.isVisible());
        expect(mxpmPanel.item[0]).toBe(mxpmElement);
        
        atom.commands.dispatch(workspaceElement, 'mxpm:toggle-path-list');
        expect(mxpmPanel.isVisible()).toBe(false);
      });
    });
  });
});
