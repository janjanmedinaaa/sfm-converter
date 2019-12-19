const fs = require('fs')
const ffmpeg = require('fluent-ffmpeg')
const Spinner = require('cli-spinner').Spinner

const writeToMP3 = (
  file,
  options = {
    path: ''
  }
) => {
  const { path } = options
  const spinner = Spinner()

  if (!fs.existsSync(path)) {
    fs.mkdirSync(path)
  }

  return new Promise((resolve, reject) => {
    const mp3FileName = `${file.filename}.mp3`
    const mp3File = `${path}/${mp3FileName}`

    spinner.setSpinnerString(18)

    ffmpeg(file.path)
      .audioBitrate('128k')
      .format('mp3')
      .on('error', reject)
      .on('start', () => {
        spinner.setSpinnerTitle(`%s Creating ${mp3FileName}`)
        spinner.start()
      })
      .on('end', () => {
        resolve(mp3File)
      })
      .save(mp3File)
  }).finally(() => {
    spinner.stop()
  })
}

module.exports = writeToMP3
