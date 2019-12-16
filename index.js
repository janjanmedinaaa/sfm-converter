const fs = require('fs')
const nodeID3 = require('node-id3')
const ffmpeg = require('fluent-ffmpeg')
const Spinner = require('cli-spinner').Spinner;

require('./utils/mapAsync')

const season = 1
const TARGET_FOLDER = `/Users/janjanmedinaaa/Downloads/Big Bang Theory/Season ${season}`
const PLAYLIST_FOLDER = `Big Bang Theory Season ${season}`
const PLAYLIST_LOCATION = `${TARGET_FOLDER}/${PLAYLIST_FOLDER}`

var files = []
require('./dir-structurer')({ 
  onFile: (file) => files.push(file), 
  filter: ['mkv', 'mov', 'avi', 'mp4'] 
}, TARGET_FOLDER)

const rewriteMP3 = (trackNumber, file, mp3File) => {
  return new Promise((resolve) => {
    return nodeID3.update({
      title: file.filename,
      artist: 'Big Bang Theory',
      album: PLAYLIST_FOLDER,
      APIC: "bbt.jpg",
      TRCK: trackNumber
    }, mp3File, () => {
      resolve();
    });
  });
}

const writeMP3 = (file, index) => {
  return new Promise((resolve, reject) => {
    const mp3FileName = `${file.filename}.mp3`
    const mp3File = `${PLAYLIST_LOCATION}/${mp3FileName}`
    var spinner = Spinner(`%s Creating ${mp3FileName}`)
    spinner.setSpinnerString(18)
  
    ffmpeg(file.location)
      .audioBitrate('128k')
      .format('mp3')
      .on('error', reject)
      .on('start', () => {
        spinner.start()
      })
      .on('end', async function() {
        await rewriteMP3(index+1, file, mp3File)
        spinner.stop()
        resolve();
      })
      .save(mp3File)
  });
}

(async () => {
  if (!fs.existsSync(PLAYLIST_LOCATION)) {
    fs.mkdirSync(PLAYLIST_LOCATION);
  }

  await files.mapAsync(writeMP3);
})();