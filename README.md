<br>
<p align="center"><img src="./logo.png"></p>

<h1 align="center">Pors</h1>
<h3 align="center">Flow control system</h3>

<p align="center">
    <a href="https://www.npmjs.com/package/pors">
        <img src="https://img.shields.io/npm/v/pors.svg">
    </a>
    <a href='https://github.com/KHC-ZhiHao/pors/actions'>
        <img src='https://github.com/KHC-ZhiHao/pors/actions/workflows/build-stage.yml/badge.svg'/>
    </a>
    <a href="https://lgtm.com/projects/g/KHC-ZhiHao/pors/context:javascript">
        <img src="https://img.shields.io/lgtm/grade/javascript/g/KHC-ZhiHao/pors.svg?logo=lgtm&logoWidth=18"/>
    </a>
    <a href="https://coveralls.io/github/KHC-ZhiHao/pors?branch=master">
        <img src="https://coveralls.io/repos/github/KHC-ZhiHao/pors/badge.svg?branch=master" alt="Coverage Status"  style="max-width:100%;">
    </a>
    <a href="https://standardjs.com/">
        <img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg" alt="Standard Code Style"  style="max-width:100%;">
    </a>
    <a href="https://github.com/KHC-ZhiHao/pors">
        <img src="https://img.shields.io/github/stars/KHC-ZhiHao/pors.svg?style=social">
    </a>
    <br>
</p>

<br>

`pors` 是一個簡單的批次執行排程系統，能夠批量處理函式，這模式有很多人做過了，但都不能夠同時兼任棋子和塞子的角色，所以又花了一點時間做了這個。

---

## 棋子 - pawn

`pawn` 是一個常駐物件，你可以不斷推送執行續給 `pawn`，它會直接執行，若超過同步執行量則會限制同步運行的數量。

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

### 優先執行

可以透過 `addFirst` 將該排程插入貯列的最優先：

```js
import { pawn } from 'pors'

let array = [] as number[]
pawn(1)
    .add((done) => {
        setTimeout(() => {
            array.push(1)
            done()
        }, 25)
    })
    .add((done) => {
        setTimeout(() => {
            array.push(2)
            done()
        }, 25)
    })
    .addFirst((done) => {
        setTimeout(() => {
            array.push(3)
            done()
        }, 25)
    })
setTimeout(() => {
    console.log(array.join()) // 1,3,2
}, 100)
```

### 透過 Async Function

可以透過 `addAsync` 省略 `done`、`error` 等 `callback`：

```js
import { pawn } from 'pors'

let array = [] as number[]
pawn(1).addAsync(async() => {
    array.push(1)
})
```

### 成員

#### size

```js
let pawn = pawn(2).add(done => {
    setTimeout(() => {
        count += 1
        done()
    }, 1000)
})
console.log(pawn.size) // 1
```

### 事件

#### empty

當系統執行完佇列後觸發

> 系統監聽一樣可以監聽到該事件。

```js
let pawn = pawn()
pawn.on('empty', () => {
    console.log('done')
})
```

##### 建議使用onEmpty

跟 `on` 不同的地方在於 `onEmpty` 宣告的當下若已經沒有執行續，會觸發一次 `callback`。

```js
let pawn = pawn()
pawn.onEmpty(() => {
    console.log('done')
})
```

---

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

`event` 事件呼叫後會回傳一個 `listener` 物件，藉由宣告 `off` 取消監聽：

```js
let listener = pawn().on('done', (event) => {})
listener.off()
```

藉由 `off` 與id接口取消 `event`：

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

---

## 批量處裡

`each` 可以一次迭代一個陣列：

```js
pawn().each([1,2,3,4], (value, index, done, error) => {
    // do something...
})
```

也可以直接填入數字：

```js
pawn().each(5, (value, index, done, error) => {
    console.log(value === index) // true
    // do something...
})
```

---

## 清空排程

`clear` 可以清空所有正在等待執行的排程：

```js
pawn().add(d => d()).clear()
```

---

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

塞子在宣告 `error` 後會直接中斷所有程序，並將 `result` 傳入 `callback`：

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

### 透過 Async Function

可以透過 `addAsync` 省略 done、error 等 callback：

```js
import { stopper } from 'pors'

let array = [] as number[]
stopper(1).addAsync(async() => {
    array.push(1)
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

執行 `start` 後會得到一個 `process` 物件，宣告 `close` 可以中斷執行續：

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

---

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
