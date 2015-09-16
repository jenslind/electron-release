# Electron-publish-release [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
> Publish a new release of your app to Github. Should be used togheter with: [electron-gh-releases](https://github.com/jenslind/electron-gh-releases).

## Install

WIP

## Usage

```
Usage
  $ electron-release
Options
  --tag  [Required] The git tag connected to the release, needs to be semver.
  --app  [Required] The path to the .app to compress and upload.
  --token  [Required] Github token to be able to publish the relase.
  --repo  [Required] The github repo in the following format: "username/reponame".
  --name  The name of the relase. Defaults to --tag
  --output  The .zip output folder. Defaults to same folder as .app
```

## Tests

```
npm test
```

## License
MIT
