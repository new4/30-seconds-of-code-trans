const fse = require('fs-extra');
const {
  xor,
} = require('lodash');

const {
  getExistFiles,
  underPath,
} = require('@new4/utils');

const {
  strSortFn,
} = require('./utils');

const SNIPPETS_SRC = underPath('root', 'snippets_src');
const SNIPPETS_TRANS = underPath('root', 'snippets_trans');

const srcFiles = getExistFiles(SNIPPETS_SRC);
const transFiles = getExistFiles(SNIPPETS_TRANS);

const unReadList = xor(transFiles, srcFiles).sort(strSortFn);

if (!unReadList || !unReadList.length) {
  console.log('already finished!');
}

const [next] = unReadList;

fse.copySync(
  underPath(SNIPPETS_SRC, next),
  underPath(SNIPPETS_TRANS, next),
);
