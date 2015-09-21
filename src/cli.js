#!/usr/bin/env node
'use strict'
const Publish = require('./index')
const meow = require('meow')
const cli = meow({
  help: [
    'Usage',
    '  $ electron-release',
    'Options',
    '  --app  [Required] The path to the .app to compress and upload.',
    '  --token  [Required] Github token to be able to publish the relase.',
    '  --tag  The git tag connected to the release, needs to be semver. Defaults to version in package.json',
    '  --repo  The github repo in the following format: "username/reponame". Defaults to repository.url in package.json',
    '  --name  The name of the relase. Defaults to --tag',
    '  --output  The .zip output folder. Defaults to same folder as .app'
  ]
})

var publish = new Publish(cli.flags)

publish.compress()
  .then(function () {
    return publish.release()
  })
  .then(function () {
    return publish.updateUrl()
  })
