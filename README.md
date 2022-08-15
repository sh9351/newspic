# 개요
빠르고 간단한 [뉴스픽 파트너스](https://partners.newspic.kr) API SDK

![npm](https://img.shields.io/npm/v/newspic)
![npm](https://img.shields.io/npm/dw/newspic)
```js
const NewsPic = require('newspic')
const newspic = new NewsPic('EMAIL', 'PASSWORD')
await newspic.login()
```

# 설치
newspic은 npm을 통하여 설치할 수 있습니다.

`$ npm install newspic`

# 기능
* 손쉬운 사용
* Async/Await, Promise 지원
* Chaining 지원

# 시작

`$ npm install newspic`
```js
const NewsPic = require('newspic')
const newspic = new NewsPic('EMAIL', 'PASSWORD')
await newspic.login()
const newsData = await newspic.fetchChannel(12, 1)
console.log(newsData)
const URL = await newsData[0].fetchURL()
// nid로 URL 생성하기
// const URL = await newspic.fetchURL(newsData[0].nid)
console.log('https://vodo.kr/' + URL)
```

# 문서
[JSDoc](https://sh9351.github.io/newspic) 참고

# 제작
임세훈 - [포트폴리오](https://sh9351.github.io)