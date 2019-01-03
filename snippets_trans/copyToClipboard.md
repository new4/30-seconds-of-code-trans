### copyToClipboard

⚠️ **注意:** 相同功能可以通过使用新的异步 [Clipboard API](https://github.com/w3c/clipboard-apis/blob/master/explainer.adoc#writing-to-the-clipboard) 使用，虽然它目前还处于实验阶段。

复制一个字符串到剪切板

只在用户操作下会生效（如，`click` 事件处理）

新建一个 `<textarea>` 元素, 用提供的数据填充它并将其加到 HTML 文档中

使用 `Selection.getRangeAt()` 储存选中区域（如果有的话）

Use `document.execCommand('copy')` to copy to the clipboard.

使用 `document.execCommand('copy')` 复制到剪切板去

从 HTML 文档中移除 `<textarea>` 元素

最后使用 `Selection().addRange()` 重新覆盖选中区域（如果有的话）

```js
const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  const selected =
    document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  if (selected) {
    document.getSelection().removeAllRanges();
    document.getSelection().addRange(selected);
  }
};
```

```js
copyToClipboard('Lorem ipsum'); // 'Lorem ipsum' copied to clipboard.
```
