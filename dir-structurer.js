const fs = require('fs')

const extname = (filename) => {
  return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename)[0] : undefined;
}

const defaultOption = {
  read: false,
  filter: [],
  onFile: () => {}
}

const structure = function(option = defaultOption, dir = '.', filestruct = { type: 'dir' }, currentKey = null) {
  var files = fs.readdirSync(dir)
  files.forEach(function(file) {
    var fileloc = `${dir}/${file}`
    if (fs.statSync(fileloc).isDirectory()) {
      filestruct[file] = { 'type': 'dir' }
      var key = currentKey || filestruct[file]
      structure(option, fileloc, filestruct[file], key)
    }
    else {
      var split = file.split('.')
      var filename = split.slice(0, split.length-1).join('.')

      if (filename === '') filename = file
      var fileObject = { 
        type: extname(file) || '',
        location: fileloc,
        filename
      }
      if (option.filter !== undefined) {
        if (Array.isArray(option.filter) && option.filter.length !== 0) {
          if (option.filter.includes(fileObject.type)) {
            filestruct[filename] = fileObject
          } else return
        } else {
          filestruct[filename] = fileObject
        }
      } else {
        filestruct[filename] = fileObject
      }

      if (option.read && option.onFile !== undefined) {
        filestruct[filename]['content'] = fs.readFileSync(fileloc, { encoding: 'utf8' }) 
      }

      if (option.onFile !== undefined && typeof option.onFile === "function") {
        option.onFile(filestruct[filename])
      }
    }
  });
  return filestruct;
};

module.exports = structure