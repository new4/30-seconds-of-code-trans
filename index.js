const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

const HEAD = '# 30-seconds-of-code-trans';
const DESC = '闲暇阅读 [30-seconds-of-code](https://github.com/30-seconds/30-seconds-of-code) 里的代码。';

const underPath = name => path.resolve(__dirname, `snippets_trans/${name}`);

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

const doc = yaml.safeLoad(fs.readFileSync('db.yml', 'utf8'));

Object.entries(doc).forEach(([tag, arr]) => {
  const contents = [];
  arr.forEach((name) => {
    const filePath = underPath(`${name}.md`);
    if (fs.existsSync(filePath)) {
      contents.push(fs.readFileSync(filePath, 'utf8'));
    }
  });
  if (contents.length) {
    contents.unshift(`## ${EMOJIS[tag]} ${tag}\n`);
    markdown.push(...contents);
  }
});

fs.writeFileSync('README.md', markdown.join('\n'));
