#!/usr/bin/env node

'use strict';
var Publish = require('./index');
var meow = require('meow');
var cli = meow({
  help: ['Usage', '  $ electron-release', 'Options', '  --app  [Required] The path to the .app to compress and upload.', '  --token  [Required] Github token to be able to publish the relase.', '  --tag  The git tag connected to the release, needs to be semver. Defaults to version in package.json', '  --repo  The github repo in the following format: "username/reponame". Defaults to repository.url in package.json', '  --name  The name of the relase. Defaults to --tag', '  --output  The .zip output folder. Defaults to same folder as .app']
});

var opts = cli.flags;

var publish = new Publish(opts);

if (!opts.tag || !opts.repo || !opts.app || !opts.token) {
  console.log('Missing required options.');
  process.exit();
}

publish.compress()['catch'](function (err) {
  console.log(err);
  process.exit();
}).then(function () {
  return publish.release();
})['catch'](function (err) {
  console.log(err);
  process.exit();
}).then(function () {
  return publish.updateUrl();
});