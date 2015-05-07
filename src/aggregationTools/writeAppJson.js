var Bluebird = require('bluebird');
var writeData = require('../github/writeData');

module.exports = function(appJson, unitCode, config) {
  return new Bluebird(function(fulfill, reject) {
    var githubSettings = JSON.parse(JSON.stringify(config.github));
    var githubPath = 'places_mobile/' + unitCode + '/app.json';
    writeData(JSON.stringify(appJson, null, 2), githubPath, githubSettings, config)
      .then(function(r) {
        delete githubSettings.filePath;
        var newGithubPath = githubPath.replace(/\.json$/, '.min.json');
        config.github.filePath = newGithubPath;
        writeData(JSON.stringify(appJson), newGithubPath, config.github, config)
          .then(function(r2) {
            fulfill([r, r2]);
          })
          .catch(reject);
      })
      .catch(reject);
  });
};