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
  const mxpmHomes = atom.config.get('mxpm.projectHomes');
  const coreHome = atom.config.get('core.projectHome');
  if (mxpmHomes.trim().length > 0) {
    return mxpmHomes;
  } else if (coreHome.trim().length > 0) {
    return coreHome;
  } else if (process.env.PROJECTS) {
    return process.env.PROJECTS;
  } else {
    return getHomePath();
  }
}

function getHomePath () {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}
