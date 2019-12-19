const nodeID3 = require('node-id3')

const updateID3 = (
  file,
  {
    tag = {
      filename: '',
      trackNumber: 0,
      artist: '',
      albumPath: '',
      APIC: ''
    }
  }
) =>
  new Promise(resolve => {
    const { filename, artist, albumPath, APIC, trackNumber } = tag

    return nodeID3.update(
      {
        title: file.filename || filename,
        artist,
        album: albumPath,
        APIC,
        TRCK: trackNumber
      },
      file,
      () => {
        resolve()
      }
    )
  })

module.exports = updateID3
