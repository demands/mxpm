const {Task} = require('atom');

module.exports = {
  startTask: function (callback) {
    const results = [];
    const task = Task.once(
      require.resolve('./load-projects-handler'),
      function () { callback(results) }
    )

    task.on('load-projects:project-found', function (project) {
      results.push(project)
    })
  }
}
