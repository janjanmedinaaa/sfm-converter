const fs = require('fs')
const nodeID3 = require('node-id3')
const converter = require('video-format-converter')
converter.setFfmpegPath('/usr/local/bin/ffmpeg')

const TARGET_FOLDER = '/Users/janjanmedinaaa/Downloads/Movies/Friends Season 1-10/Friends Season 10'
const PLAYLIST_FOLDER = 'Friends Season 10'
const PLAYLIST_LOCATION = `${TARGET_FOLDER}/${PLAYLIST_FOLDER}`

var files = []
require('./dir-structurer')({ 
  onFile: (file) => files.push(file), 
  filter: ['mkv'] 
}, TARGET_FOLDER)

const rewriteMP3 = (trackNumber, file, mp3File) => {
  console.log(`Started rewriting MP3 File: ${mp3File}`);

  return nodeID3.update({
    title: file.filename,
    artist: 'Friends',
    album: PLAYLIST_FOLDER,
    APIC: "playlist.jpg",
    TRCK: trackNumber
  }, mp3File)
}

const writeMP3 = (file, index) => {
  var mp3FileName = `${file.filename}.mp3`
  var mp3File = `${PLAYLIST_LOCATION}/${mp3FileName}`

  console.log(`Created MP3 File: ${mp3FileName}`)
  converter.convert(file.location, mp3File, function(err) {
    var success = rewriteMP3(index+1, file, mp3File)
    console.log(`Rewrite Status: ${success}`)
  })
}

fs.mkdirSync(PLAYLIST_LOCATION)
files.forEach(async(file, index) => {
  await writeMP3(file, index)
})