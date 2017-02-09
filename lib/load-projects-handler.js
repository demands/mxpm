const path = require('path');
const fs = require('fs');
const async = require('async');

const foundProjectPaths = new Set();

module.exports = function (projectDirs) {
  callback = this.async(); // I HATE THIS PATTERN.
  return async.each(projectDirs, checkDirectoryForProjects, callback);
}

function createProject (filename, fullpath) {
  if (foundProjectPaths.has(fullpath)) {
    // filter out duplicates
    return;
  }
  
  foundProjectPaths.add(fullpath);
  const project = {filename, fullpath};
  emit('load-projects:project-found', project);
  return project;
}

function checkDirectoryForProjects (projectDir, callback) {
  return fs.readdir(projectDir, function (err, files) {
    if (err) {
      console.error(`mxpm: Problem reading project directory ${projectDir}`, err)
      return callback();
    }
    async.each(
      files,
      function (filename, next) {
        const fullpath = path.join(projectDir, filename);
        return checkIfProject(filename, fullpath, next);
      },
      callback
    );
  });
}

function checkIfProject (filename, fullpath, callback) {
  return fs.lstat(fullpath, (err, stats) => {
    if (err) {
      /* probably ENOENT, because of a bad symlink or permissions issue. move on. */
      console.error(`mxpm: Error while trying to lstat ${fullpath}`, err);
      return callback()
    }
    if (!stats) { return callback() }
    if (stats.isDirectory()) { return callback(undefined, createProject(filename, fullpath)) }
    if (stats.isSymbolicLink()) {
      return fs.readlink(fullpath, (err, linkString) => {
        if (err) {
          /* ??? */
          console.error(`mxpm: Error while trying to readlink ${fullpath}`, err);
          return callback();
        }
        return checkIfProject(filename, linkString, callback);
      });
    }
    return callback();
  });
}

