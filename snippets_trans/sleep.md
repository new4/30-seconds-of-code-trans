### sleep

延迟执行异步函数

其实就是将其放入 `setTimeout` 中，再在外面裹上一层 `Promise`

```js
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
```

```js
async function sleepyWork() {
  console.log("I'm going to sleep for 1 second.");
  await sleep(1000);
  console.log('I woke up after 1 second.');
}
```
