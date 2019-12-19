require('./mapAsync')

const getFiles = require('./getFiles')
const fromCommaSeparatedListToArray = require('./fromCommaSeparatedListToArray')
const updateID3 = require('./updateID3')
const writeToMp3 = require('./writeToMp3')

module.exports = {
  getFiles,
  fromCommaSeparatedListToArray,
  updateID3,
  writeToMp3
}
