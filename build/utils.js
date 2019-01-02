const {
  toLower,
} = require('lodash');

exports.strSortFn = (a, b) => {
  a = toLower(a);
  b = toLower(b);
  if (a < b) { return -1; }
  if (a > b) { return 1; }
  return 0;
};
