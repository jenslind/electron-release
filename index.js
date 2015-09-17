'use strict'
const Zip = require('adm-zip')
const publishRelease = require('publish-release')
const got = require('got')
const Promise = require('bluebird')
const fs = Promise.promisifyAll(require("fs"))

class Publish {

  constructor (opts) {
    this.opts = (opts) ? opts : {}
    if (!opts.repo) opts.repo = this._getRepo()
    if (!opts.tag) opts.tag = this._getTag()
    if (!opts.name) opts.name = opts.tag
    if (!opts.output) opts.output = opts.app + '.zip';

    if (!opts.tag || !opts.repo || !opts.app || !opts.token) {
      console.log('Missing required options.')
      process.exit()
    }

    this._releaseUrl = null
  }

  // Zip compress .app
  compress () {
    let self = this;

    return new Promise(function (resolve, reject) {
      let zip = new Zip()
      zip.addLocalFile(self.opts.app)
      zip.writeZip(self.opts.output, function () {
        resolve()
      })
    })
  }

  // Create new release with zip as asset.
  release () {
    let self = this

    return new Promise(function (resolve, reject) {
      publishRelease({
        token: self.opts.token,
        owner: self.opts.repo.split('/')[0],
        repo: self.opts.repo.split('/')[1],
        tag: self.opts.tag,
        name: self.opts.name,
        assets: [self.opts.output]
      }, function (err, release) {
        if (!err) {
          got(release.assets_url).then(function (res) {
            var jsonBody = JSON.parse(res.body)
            self._releaseUrl = jsonBody[0].browser_download_url
            resolve()
          })
        }
      })
    })
  }

  // Update auto_update.json file with latest url.
  updateUrl () {
    let self = this
    return new Promise(function (resolve) {
      let file = fs.readFileAsync('./auto_updater.json').then(JSON.parse).then(function (content) {
        content.url = self._releaseUrl
        fs.writeFileAsync('./auto_updater.json', JSON.stringify(content)).then(function () {
          resolve()
        })
      })
    })
  }

  // Get repo from package.json
  _getRepo () {
    let manifest = require('./package.json')
    let url = manifest.repository.url.split('/')

    return url[3] + '/' + url[4].replace(/\.[^/.]+$/, '')
  }

  // @TODO:
  // Get tag (version) from package.json
  _getTag () {
    return null
  }

}

module.exports = Publish
