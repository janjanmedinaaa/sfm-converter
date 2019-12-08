const fs = require('fs')
const nodeID3 = require('node-id3')
const ffmpeg = require('fluent-ffmpeg')

const season = 1
const TARGET_FOLDER = `/Users/janjanmedinaaa/Downloads/Movies/Friends Season 1-10/Friends Season ${season}`
const PLAYLIST_FOLDER = `Friends Season ${season}`
const PLAYLIST_LOCATION = `${TARGET_FOLDER}/${PLAYLIST_FOLDER}`

var files = []
require('./dir-structurer')({ 
  onFile: (file) => files.push(file), 
  filter: ['mkv'] 
}, TARGET_FOLDER)

const rewriteMP3 = (trackNumber, file, mp3File) => {
  console.log(`Started rewriting MP3 File: ${file.filename}.mp3`);

  return nodeID3.update({
    title: file.filename,
    artist: 'Friends',
    album: PLAYLIST_FOLDER,
    APIC: "playlist.jpg",
    TRCK: trackNumber
  }, mp3File)
}

const writeMP3 = async (file, index) => {
  var mp3FileName = `${file.filename}.mp3`
  var mp3File = `${PLAYLIST_LOCATION}/${mp3FileName}`

  console.log(`Started MP3 File: ${mp3FileName}`)
  ffmpeg(file.location)
    .audioBitrate('128k')
    .format('mp3')
    .on('progress', function(info) {
      console.log(`${mp3FileName}: ${info.percent}`);
    })
    .on('end', function() {
      console.log(`Created MP3 File: ${mp3FileName}`);
      rewriteMP3(index+1, file, mp3File)
    })
    .save(mp3File)
}

fs.mkdirSync(PLAYLIST_LOCATION)
files.forEach((file, index) => writeMP3(file, index))