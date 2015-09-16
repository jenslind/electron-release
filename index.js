'use strict'
const Zip = require('adm-zip')
const publishRelease = require('publish-release')
const fs = require('fs')
const got = require('got')

class Publish {

  constructor (opts) {
    this.opts = (opts) ? opts : {}
    if (!opts.repo) opts.repo = this._getRepo()
    if (!opts.name) opts.name = opts.version
    if (!opts.output) opts.output = opts.app + '.zip';

    if (!opts.version || !opts.repo || !opts.app) {
      console.log('Missing options')
      process.exit()
    }

    this._releaseUrl = null
  }

  // Zip compress .app
  compress () {
    let zip = new Zip()
    zip.addLocalFile(this.opts.app)
    zip.writeZip(this.opts.output)
  }

  // Create new release with zip as asset.
  release () {
    let self = this

    publishRelease({
      token: this.opts.token,
      owner: this.opts.repo.split('/')[0],
      repo: this.opts.repo.split('/')[1],
      tag: this.opts.version,
      name: this.opts.name,
      assets: [this.opts.output]
    }, function (err, release) {
      if (!err) {
        got(release.assets_url).then(function (res) {
          var jsonBody = JSON.parse(res.body)
          self._releaseUrl = jsonBody[0].browser_download_url
        })
      }
    })
  }

  // Update auto_update.json file with latest url.
  updateAutoUpdater () {
    let file = fs.readFileSync('./auto_updater.json')
    let content = JSON.parse(file)
    content.url = this._releaseUrl
    fs.writeFileSync('./auto_updater.json', JSON.stringify(content))
  }

  // @TODO:
  // Get repo from package.json
  _getRepo () {
    return null
  }

}

module.exports = Publish
