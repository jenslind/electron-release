'use strict';
Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var exec = require('child_process').exec;
var publishRelease = require('publish-release');
var got = require('got');
var Promise = require('bluebird');
var loadJsonFile = require('load-json-file');
var writeJsonFile = require('write-json-file');
var path = require('path');

var Publish = (function () {
  function Publish(opts) {
    _classCallCheck(this, Publish);

    this.opts = opts ? opts : {};
    if (!opts.repo) opts.repo = this._getRepo();
    if (!opts.tag) opts.tag = this._getTag();
    if (!opts.name) opts.name = opts.tag;
    if (!opts.output) opts.output = opts.app;

    this._releaseUrl = null;
  }

  // Zip compress .app

  _createClass(Publish, [{
    key: 'compress',
    value: function compress() {
      var self = this;

      if (!Array.isArray(self.opts.app)) self.opts.app = self.opts.app.replace(/ /g, '').split(',');
      if (!Array.isArray(self.opts.output)) self.opts.output = self.opts.output.replace(/ /g, '').split(',');

      return new Promise(function (resolve, reject) {
        if (self.opts.app.length !== self.opts.output.length) reject(new Error('Output length does not match app length'));

        for (var i in self.opts.app) {
          var output = path.extname(self.opts.output[i]) === '.zip' ? self.opts.output[i] : self.opts.output[i] + '.zip';
          var cmd = 'ditto -c -k --sequesterRsrc --keepParent ' + self.opts.app[i] + ' ' + output;
          exec(cmd, function (err) {
            if (!err) {
              resolve();
            } else {
              reject(new Error('Unable to compress app.'));
            }
          });
        }
      });
    }

    // Create new release with zip as asset.
  }, {
    key: 'release',
    value: function release() {
      var self = this;

      return new Promise(function (resolve, reject) {
        publishRelease({
          token: self.opts.token,
          owner: self.opts.repo.split('/')[0],
          repo: self.opts.repo.split('/')[1],
          tag: self.opts.tag,
          name: self.opts.name,
          assets: self.opts.output
        }, function (err, release) {
          if (!err) {
            got(release.assets_url).then(function (res) {
              var jsonBody = JSON.parse(res.body);
              self._releaseUrl = jsonBody[0].browser_download_url;
              resolve();
            });
          } else {
            reject(new Error('Unable to create a new release on GitHub.'));
          }
        });
      });
    }

    // Update auto_update.json file with latest url.
  }, {
    key: 'updateUrl',
    value: function updateUrl() {
      var self = this;
      return new Promise(function (resolve) {
        loadJsonFile('./auto_updater.json').then(function (content) {
          content.url = self._releaseUrl;
          writeJsonFile('./auto_updater.json', content).then(function () {
            resolve();
          });
        });
      });
    }

    // Load package.json
  }, {
    key: '_loadPackageJson',
    value: function _loadPackageJson() {
      try {
        return loadJsonFile.sync('./package.json');
      } catch (err) {
        return;
      }
    }

    // Get repo from package.json
  }, {
    key: '_getRepo',
    value: function _getRepo() {
      var pkg = this._loadPackageJson();

      var url = pkg.repository.url.split('/');
      return url[3] + '/' + url[4].replace(/\.[^/.]+$/, '');
    }

    // Get tag (version) from package.json
  }, {
    key: '_getTag',
    value: function _getTag() {
      var pkg = this._loadPackageJson();

      var version = pkg.version;
      return 'v' + version;
    }
  }]);

  return Publish;
})();

exports['default'] = Publish;
module.exports = exports['default'];