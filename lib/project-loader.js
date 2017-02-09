const {Task} = require('atom');

module.exports = {
  startTask: function (callback) {
    const results = [];
    const task = Task.once(
      require.resolve('./load-projects-handler'),
      getProjectRootPaths(),
      function () { callback(results) }
    );

    task.on('load-projects:project-found', function (project) {
      results.push(project)
    });
  }
}

function getProjectRootPaths () {
  return getProjectRootString().split(',').map(normalizePath);
}

function normalizePath (path) {
  return path.trim().replace('~', getHomePath());
}

function getProjectRootString () {
  const setting = atom.config.get('mxpm.projectRoot');
  if (setting.trim().length > 0) {
    return setting;
  } else if (process.env.PROJECTS) {
    return process.env.PROJECTS;
  } else {
    return getHomePath();
  }
}

function getHomePath () {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}
