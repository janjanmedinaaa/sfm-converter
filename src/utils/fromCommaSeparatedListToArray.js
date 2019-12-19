const fromCommaSeparatedListToArray = str =>
  (String(str) && str.split(',')) || []

module.exports = fromCommaSeparatedListToArray
