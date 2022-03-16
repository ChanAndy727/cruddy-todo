const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

const Promise = require('bluebird');
const readFilePromise = Promise.promisify(fs.readFile);

// Public API - Fix these CRUD functions ///////////////////////////////////////


// adding text to our items objects
exports.create = (text, callback) => {

  counter.getNextUniqueId((err, counter) => {
    fs.writeFile(path.join(exports.dataDir, `${counter}.txt`), text, (err) => {
      if (err) {
        throw ('error creating file');
      } else {
        callback(null, { id: counter, text: text });
      }
    });
  });
};

exports.readAll = (callback) => {

  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('error reading data folder');
    }
    var data = _.map(files, (file) => {
      var id = path.basename(file, '.txt');
      var filepath = path.join(exports.dataDir, file);
      return readFilePromise(filepath).then(fileData => {
        return {
          id: id,
          text: fileData.toString()
        };
      });
    });
    Promise.all(data)
      .then(items => callback(null, items), err => callback(err));
  });
};


// fs.readFile(exports.counterFile, (err, fileData) => {
//   if (err) {
//     callback(null, 0);
//   } else {
//     callback(null, Number(fileData));
//   }
// });

exports.readOne = (id, callback) => {
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), 'utf8', (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id: id, text: data });
    }
  });
};

// fs.writeFile(exports.counterFile, counterString, (err) => {
//   if (err) {
//     throw ('error writing counter');
//   } else {
//     callback(null, counterString);
//   }
// });

// fs.writeFile('mynewfile3.txt', 'This is my text', function (err) {
//   if (err) throw err;
//   console.log('Replaced!');
// });

exports.update = (id, text, callback) => {
  if (fs.existsSync(path.join(exports.dataDir, `${id}.txt`))) {
    fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err, data) => {
      if (err) {
        new Error('no file exists');
      } else {
        callback(null, { id: id, text: data });
      }
    });
  } else {
    callback(new Error(`No item with id: ${id}`));
  }
};



exports.delete = (id, callback) => {
  if (fs.existsSync(path.join(exports.dataDir, `${id}.txt`))) {
    fs.unlink(path.join(exports.dataDir, `${id}.txt`), (err, data) => {
      if (err) {
        new Error('no file exists');
      } else {
        callback(null, { id: id, text: data });
      }
    });
  } else {
    callback(new Error(`No item with id: ${id}`));
  }
};


//  var item = items[id];
//   delete items[id];
//   if (!item) {
//     // report an error if item not found
//     callback(new Error(`No item with id: ${id}`));
//   } else {
//     callback();
//   }
// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
