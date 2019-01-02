const fse = require('fs-extra');
const {
  xor,
} = require('lodash');

const {
  getExistFiles,
  underPath,
  colorStr: {
    cyan,
  },
  log: {
    logBoth,
    faillogBoth,
  },
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
  faillogBoth('already finished!');
}

const [next] = unReadList;

fse.copySync(
  underPath(SNIPPETS_SRC, next),
  underPath(SNIPPETS_TRANS, next),
);

logBoth(cyan(`${unReadList.length} left`));
