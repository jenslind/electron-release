# Electron-release [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard) [![Build Status](https://travis-ci.org/jenslind/electron-release.svg?branch=master)](https://travis-ci.org/jenslind/electron-release)
> Publish a new release of your app to Github. Could be used together with: [electron-gh-releases](https://github.com/jenslind/electron-gh-releases).

## Install

```
npm install -g electron-release
```

## What it does

1. Zip compresses your `.app`
2. Publishes a new release on GitHub with the zip as an asset.
3. Updates `auto_updater.json` with the new url (if exists).

## Usage

```
Usage
  $ electron-release
Options
  --app  [Required] The path to the app to compress and upload, separate with `,` (--app=test.app,test.exe).
  --token  [Required] GitHub token to be able to publish the release.
  --tag  The git tag connected to the release, needs to be semver. Defaults to version in package.json
  --repo  The GitHub repo in the following format: "username/reponame". Defaults to repository.url in package.json
  --name  The name of the release. Defaults to --tag
  --output  The .zip output folder. Defaults to same folder as app. separate with `,` (--output=test-app.zip,test-exe.zip).
```

## Tests

```
npm test
```

## License
MIT
