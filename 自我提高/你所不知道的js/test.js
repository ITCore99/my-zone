/**
 * 实现一个
 */
Function.prototype.before = function (beforeFn) {
  // 保存原函数的引用
  var _self = this
  // 返回函数 是为了后面的引用
  return function () {
    // 先执行befor的回调函数
    beforeFn.apply(this, arguments)
    // 执行原函数 返回结果
    return _self.apply(this.arguments)
  }
}
Function.prototype.after = function (afterFn) {
  // 保存函数引用
  var _self = this
  return function () {
    // 执行函数
    let result = _self.apply(this, arguments)
    // 执行后回调
    afterFn.apply(this, arguments)
    return result
  }
}
let func = function () {
  console.log('run')
}
func = func.before(function () {
  console.log('before run')
}).after(function () {
  console.log('after run')
})
func()

/**
 * 这里我们实现一个 currying柯力化函数 来时实现一个懒运行函数
 *  
 */
function currying(fn) {
  const len = fn.length
  let args = Array.prototype.slice.call(arguments, 1)
  return function inner() {
    args = args.concat(...arguments)
    if (args.length >= len) {
      return fn.apply(this, args)
    } else {
      return function () {
        return inner.apply(this, arguments)
      }
    }
  }
}

// function sum(a, b, c) {
//   return a + b + c
// }
// const currySum = currying(sum, 1)
// console.log('执行结果1', currySum(2, 3))
// const currySum2 = currying(sum)
// console.log('执行结果2', currySum2(1)(1)(3))
// const currySum3 = currying(sum)
// console.log('执行结果2', currySum3(1, 2, 3))

/**
 * 这里我们实现一个分时函数 一般在我们需要在页面中插入大量的
 * dom时候 如果一次插入太多dom会导致页面的卡顿 所以我们使用分时函数 断续的插入 可以提高性能
 */
const dataSource = new Array(1000).fill('雨')


/**
 * 创建dom 并插入到文档中
 * @param {*} text 
 */
function createDomAppendDoc(text) {
  const div = document.createElement('div')
  div.innerText = text
  document.body.append(div)
}

/**
 * 分时函数
 * @param {*} dataSource 数据源
 * @param {*} fn         分时执行函数
 * @param {*} count      分时插入条数
 * @param {*} duration   时间间隔
 */
function timeChunk(dataSource, fn, count = 1, duration = 200) {
  let timer
  dataSource = JSON.parse(JSON.stringify(dataSource))
  const start = () => {
    const mixCount = Math.min(count, dataSource.length)
    for (let i = 0; i < mixCount; i++) {
      fn(dataSource.shift())
    }
  }
  return () => {
    timer = setInterval(() => {
      if (dataSource.length === 0) {
        clearInterval(timer)
        return
      }
      start()
    }, duration)
  }
}

const newRender = timeChunk(dataSource, createDomAppendDoc)