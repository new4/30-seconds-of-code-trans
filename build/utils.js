const {
  toLower,
} = require('lodash');

const {
  underPath,
} = require('@new4/utils');

exports.strSortFn = (a, b) => {
  a = toLower(a);
  b = toLower(b);
  if (a < b) { return -1; }
  if (a > b) { return 1; }
  return 0;
};

exports.SNIPPETS_SRC = underPath('root', 'snippets_src');

exports.SNIPPETS_TRANS = underPath('root', 'snippets_trans');

exports.DB_YML = underPath('root', 'db.yml');

exports.README = underPath('root', 'README.md');
