const path = require('path');
const fs = require('fs');
const async = require('async');

module.exports = function () {
  callback = this.async(); // I HATE THIS PATTERN.

  const projectDir = process.env.PROJECTS;
  fs.readdir(projectDir, function (err, files) {
    if (err) return callback(err);
    async.each(
      files,
      function (filename, next) {
        const fullpath = path.join(projectDir, filename);
        fs.lstat(fullpath, (err, stats) => {
          if (err) {
            return next(err);
          }
          if (stats && stats.isDirectory()) {
            const project = {
              fullpath,
              filename,
            };
            emit('load-projects:project-found', project)
            return next(null, project);
          }
          else {
            return next();
          }
        })
      },
      callback
    );
  });
}
