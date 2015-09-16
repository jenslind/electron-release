'use strict'
const Publish = require('./index')
const meow = require('meow')
const cli = meow({
  help: [
    'Usage',
    '  $ publish-release',
    'Options',
    '  --tag  [Required] The git tag connected to the release, needs to be semver.',
    '  --app  [Required] The path to the .app to compress and upload.',
    '  --token  [Required] Github token to be able to publish the relase.',
    '  --repo  [Required] The github repo in the following format: "username/reponame".',
    '  --name  The name of the relase',
    '  --output  The .zip output folder. Defaults to same folder as .app'
  ]
})

var publish = new Publish(cli.flags)

publish.compress()
  .then(function () {
    publish.release()
  })
  .then(function () {
    publish.updateUrl()
  })
