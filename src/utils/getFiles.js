const { promisify } = require('util')
const { basename, extname, resolve, dirname } = require('path')
const fs = require('fs')
const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)

const getDirectoryFiles = async dir => {
  const subdirs = await readdir(dir)
  const files = await Promise.all(
    subdirs.map(async subdir => {
      const res = resolve(dir, subdir)
      return (await stat(res)).isDirectory() ? getDirectoryFiles(res) : res
    })
  )
  return files.reduce((a, f) => a.concat(f), [])
}

const getFileExtension = file => extname(file)
const getFilename = extension => file => basename(file, extension)
const sanitizeExtension = extension =>
  String(extension)
    .toLowerCase()
    .replace(/[^a-zA-Z]/g, '') // no special characters/whitespaces
const applyExtensionFilter = extensions => file =>
  (Array.isArray(extensions) &&
    extensions
      .map(ext => ['.', ext.toLowerCase()].join(''))
      .includes(getFileExtension(file).toLowerCase())) ||
  false

const getFiles = async (options = { directoryPath, extensions }) => {
  const { directoryPath, extensions } = options
  const files = await getDirectoryFiles(directoryPath)
  return files.filter(applyExtensionFilter(extensions)).map(file => ({
    path: file,
    filename: getFilename(getFileExtension(file))(file),
    type: sanitizeExtension(getFileExtension(file)),
    rootPath: dirname(file)
  }))
}

module.exports = getFiles
