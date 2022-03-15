const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

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

// const readCounter = (callback) => {
//   fs.readFile(exports.counterFile, (err, fileData) => {
//     if (err) {
//       callback(null, 0);
//     } else {
//       callback(null, Number(fileData));
//     }
//   });
// };

exports.readAll = (callback) => {
  let data = [];
  if (err) {
    callback(null, []);
  } else {
    fs.readdir(testFolder, (err, fileData) => {
      files.forEach(file => {
        data.push(file);
      });
    });
    callback(null, data);
  }
};



// exports.readAll = (callback) => {
//   var data = _.map(items, (text, id) => {
//     return { id, text };
//   });
//   callback(null, data);
// };

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
