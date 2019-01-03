const fs = require('fs');
const yaml = require('js-yaml');

const {
  underPath,
} = require('@new4/utils');

const {
  SNIPPETS_TRANS,
  DB_YML,
  README,
} = require('./utils');

const HEAD = '# 30-seconds-of-code-trans';
const DESC = '闲暇阅读 [30-seconds-of-code](https://github.com/30-seconds/30-seconds-of-code) 里的代码。';

const EMOJIS = {
  'adapter': '🔌',
  'array': '📚',
  'browser': '🌐',
  'date': '⏱️',
  'function': '🎛️',
  'logic': '🔮',
  'math': '➗',
  'media': '📺',
  'node': '📦',
  'object': '🗃️',
  'string': '📜',
  'type': '📃',
  'utility': '🔧',
};

const markdown = [
  `${HEAD}\n`,
  `${DESC}\n`,
];

const createReadme = () => {
  const doc = yaml.safeLoad(fs.readFileSync(DB_YML, 'utf8'));

  Object.entries(doc).forEach(([tag, arr]) => {
    const contents = [];
    arr.forEach((name) => {
      const filePath = underPath(SNIPPETS_TRANS, `${name}.md`);
      if (fs.existsSync(filePath)) {
        contents.push(fs.readFileSync(filePath, 'utf8'));
      }
    });
    if (contents.length) {
      contents.unshift(
        `## ${EMOJIS[tag]} ${tag}\n`,
        '<details>\n',
        '<summary>展开</summary>\n',
      );

      markdown.push(
        ...contents,
        '</details>\n',
      );
    }
  });

  fs.writeFileSync(README, markdown.join('\n'));
};

module.exports = createReadme();
