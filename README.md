# 棋子還是塞子？

[![NPM Version][npm-image]][npm-url]

`pors`是一個簡單的批次執行排程系統，能夠批量處理函式，這模式有很多人做過了，但都不能夠同時兼任棋子和塞子的角色，所以又花了一點時間做了這個。

## 棋子 - pawn

`pawn`是一個常駐物件，你可以不斷推送執行續給`pawn`，它會直接執行，若超過同步執行量則會限制運行的狀態。

### Example

```js
import { pawn } from 'pors'

let count = 0
pawn(2) // 一次允許的執行量，無填入則不會限制
    .add(done => {
        setTimeout(() => {
            count += 1
            done()
        }, 1000)
    })
    .add(done => {
        setTimeout(() => {
            count += 1
            done()
        }, 1000)
    })
    .add(done => {
        setTimeout(() => {
            count += 1
            done()
        }, 1000)
    })
setTimeout(() => {
    console.log(count) // 2
}, 1100)
```

## Event

```js
import { pawn } from 'pors'

let pw = pawn()
pw.on('done', (event) => {
    console.log(event)
    /*
        {
            "name": "Pawn",
            "type": "done",
            "context": {
                "id": "f73ac396-7202-461e-8eb2-e16ef273cf27",
                "thread": [Function]
            },
            "listener": {
                "id": "442a65ce-1972-4ebf-853b-4188dce42c14",
                "off": [Function]
            }
        }
    */
})
pw.add(done => done())
```

### 取消監聽

`event`事件呼叫後會回傳一個`listener`物件，藉由宣告`off`取消監聽：

```js
let listener = pawn().on('done', (event) => {})
listener.off()
```

藉由`off`與id接口取消`event`：

```js
let pw = pawn()
let listener = pw.on('done', (event) => {})
pw.off('done', listener.id)
```

### 系統事件

所有的事件都會觸發系統層監聽的事件：

```js
import { on } from 'pors'

on('done', () => {
    console.log('123')
})

pawn().add(done => done())
```

### 通用事件

不論棋子還是塞子都有以下三種事件

#### run

每個執行續執行前會觸發該事件。

#### done

每個執行續執行前完整結束後會觸發該事件。

#### error

每個執行續執行錯誤會觸發該事件。

```js
pawn().add((done, error) => {
    error() // 由此觸發
})
```

## 批量處裡

`each`可以一次迭代一個陣列：

```js
pawn().each([1,2,3,4], (value, index, done, error) => {
    // do something...
})
```

## 清空排程

`clear`可以清空所有正在等待執行的排程：

```js
pawn().add(d => d()).clear()
```

## 塞子 - stopper

塞子是預先加入執行續，最後再宣告執行：

### Example

```js
import { stopper } from 'pors'

let count = 0
stopper(2) // 一次允許的執行量，無填入則不會限制
    .add(done => {
        count += 1
        done()
    })
    .add(done => {
        count += 1
        done()
    })
    .start(() => {
        console.log(count) // 2
    })
```

### 錯誤處理

塞子在宣告error後會直接中斷所有程序，並將result傳入callback：

```js
import { stopper } from 'pors'

let count = 0
stopper(2) // 一次允許的執行量，無填入則不會限制
    .add((done, error) => {
        error('123')
    })
    .start((error) => {
        console.log(error) // '123'
    })
```

### 塞子事件

#### Process

> 系統監聽一樣可以監聽到該事件。

```js
let step = stopper()
step.on('process', ({ loaded, totalThread }) => {
    console.log(`${loaded}/${totalThread}`)
})
```

### 關閉程序

執行start後會得到一個`process`物件，宣告`close`可以中斷執行續：

```js
import { stopper } from 'pors'

let count = 0
stopper(2)
    .add((done, error) => {
        error('123')
    })
    .start((error) => {
        console.log(error)
    })
    .close()
```

## 幫浦 - pump

一個累積計數等待回呼的工具：

```js
import pors from 'pors'
let pump = pors.pump(() => console.log('OuO'))
pump.add(2)
pump.press()
pump.press() // 'OuO'
```

[npm-image]: https://img.shields.io/npm/v/pors.svg
[npm-url]: https://npmjs.org/package/pors
