const fs = require('fs');
const path = require('path');
const {
  flatten,
} = require('lodash');

const {
  strSortFn,
} = require('./utils');

const objectFromPairs = arr => arr.reduce((acc, curValue) => ((acc[curValue[0]] = curValue[1]), acc), {}); // eslint-disable-line

const TAG_DB_PATH = path.resolve(__dirname, '../tag_database');
const OUTPUT = path.resolve(__dirname, '../db.yml');

const readTags = () => {
  let tagDbData = {};
  try {
    tagDbData = objectFromPairs(
      fs
        .readFileSync(TAG_DB_PATH, 'utf8')
        .split('\n')
        .filter(v => v.trim() !== '')
        .map((v) => {
          const data = v.split(':').slice(0, 2);
          data[1] = data[1].split(',').map(t => t.trim());
          return data;
        }),
    );
  } catch (err) {
    console.error(`ERROR! During tag database loading: ${err}`);
    process.exit(1);
  }
  return tagDbData;
};

const tagsInfo = readTags();

const obj = {};
Object
  .entries(tagsInfo)
  .forEach(([key, [tag]]) => {
    if (!obj[tag]) {
      obj[tag] = [];
    }
    obj[tag].push(key);
  });

const strArr = Object.keys(obj).sort(strSortFn)
  .map((tag) => {
    const temp = obj[tag].map(name => `  - ${name}`);
    temp.sort(strSortFn).unshift(`${tag}:`);
    return temp;
  });

fs.writeFileSync(OUTPUT, flatten(strArr).join('\n'));

