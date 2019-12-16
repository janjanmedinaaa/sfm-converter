const fs = require('fs')
const nodeID3 = require('node-id3')
const ffmpeg = require('fluent-ffmpeg')

const { mapAsync } = require('./utils/mapAsync');

const season = 1
const TARGET_FOLDER = `/Users/janjanmedinaaa/Downloads/Movies/Friends Season 1-10/Friends Season ${season}`
const PLAYLIST_FOLDER = `Friends Season ${season}`
const PLAYLIST_LOCATION = `${TARGET_FOLDER}/${PLAYLIST_FOLDER}`

var files = []
require('./dir-structurer')({ 
  onFile: (file) => files.push(file), 
  filter: ['mkv', 'mov'] 
}, TARGET_FOLDER)

const rewriteMP3 = (trackNumber, file, mp3File) => {
  return new Promise((resolve) => {
    console.log(`Started rewriting MP3 File: ${file.filename}.mp3`);
    return nodeID3.update({
      title: file.filename,
      artist: 'Friends',
      album: PLAYLIST_FOLDER,
      APIC: "playlist.jpg",
      TRCK: trackNumber
    }, mp3File, () => {
      console.log(`Finished rewriting MP3 File: ${file.filename}.mp3`);
      resolve();
    });
  });
}

const writeMP3 = (file, index) => {
  return new Promise((resolve, reject) => {
    const mp3FileName = `${file.filename}.mp3`
    const mp3File = `${PLAYLIST_LOCATION}/${mp3FileName}`
  
    ffmpeg(file.location)
      .audioBitrate('128k')
      .format('mp3')
      .on('error', reject)
      .on('start', () => {
        console.log(`Started MP3 File: ${mp3FileName}`)
      })
      .on('progress', function(info) {
        console.log(`${mp3FileName}: ${info.percent}`);
      })
      .on('end', async function() {
        console.log(`Created MP3 File: ${mp3FileName}`);
        await rewriteMP3(index+1, file, mp3File)
        resolve();
      })
      .save(mp3File)
  });
}

(async () => {
  console.log('files', files);

  if (!fs.existsSync(PLAYLIST_LOCATION)) {
    fs.mkdirSync(PLAYLIST_LOCATION);
  }

  await mapAsync(writeMP3)(files);
})();
