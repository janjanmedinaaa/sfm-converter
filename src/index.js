const { join } = require('path')
const program = require('commander')

const {
  getFiles,
  fromCommaSeparatedListToArray,
  writeToMp3,
  updateID3
} = require('./utils')

const packageJSON = require('../package.json')

;(async () => {
  program
    .version(packageJSON.version)
    .requiredOption(
      '-s, --source <source>',
      'Folder directory to scan for files'
    )
    .option(
      '--extensions [extensions]',
      'File extension to retrieve',
      fromCommaSeparatedListToArray,
      ['mkv', 'mov', 'avi', 'mp4']
    )
    .parse(process.argv)

  const { source, extensions } = program

  const files = await getFiles({
    directoryPath: source,
    extensions
  })

  console.log('TARGET FOLDER', source)
  console.log('files', files)

  await files.mapAsync(async (file, index) => {
    const mp3File = await writeToMp3(file, {
      path: join(file.rootPath, 'mp3')
    })
    await updateID3(mp3File, {
      tag: {
        albumPath: file.rootPath,
        artist: '',
        APIC: '',
        trackNumber: index + 1
      }
    })
  })
})()
