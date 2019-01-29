const fse = require('fs-extra');
const execa = require('execa');

const {
  xor,
} = require('lodash');

const {
  getExistFiles,
  underPath,
  colorStr: {
    cyan,
    yellow,
  },
  log: {
    logBefore,
    logAfter,
  },
  shouldBe: {
    sbValidArray,
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

sbValidArray(unReadList, 'already finished!');

const [next] = unReadList;

fse.copySync(
  underPath(SNIPPETS_SRC, next),
  underPath(SNIPPETS_TRANS, next),
);

logBefore(cyan(`Total:${srcFiles.length}`));
logAfter(yellow(` Left:${unReadList.length}`));

(async () => {
  const { stdout } = await execa('code', [underPath(SNIPPETS_TRANS, next)]);
  console.log(stdout);
})();
