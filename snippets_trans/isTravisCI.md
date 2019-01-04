### isTravisCI

检测当前环境是否是 [Travis CI](https://travis-ci.org/).

是否有环境变量 `TRAVIS` 和 `CI`  ([reference](https://docs.travis-ci.com/user/environment-variables/#Default-Environment-Variables)).

```js
const isTravisCI = () => 'TRAVIS' in process.env && 'CI' in process.env;
```

```js
isTravisCI(); // true (if code is running on Travis CI)
```
