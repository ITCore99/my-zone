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

// 这里我们实现一个 currying柯力化函数 来时实现一个懒运行函数
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

function sum(a, b, c) {
  return a + b + c
}
const currySum = currying(sum, 1)
console.log('执行结果1', currySum(2, 3))
const currySum2 = currying(sum)
console.log('执行结果2', currySum2(1)(1)(3))
const currySum3 = currying(sum)
console.log('执行结果2', currySum3(1, 2, 3))

// 实现数字的reducer
Array.prototype.myReduce = function (cb, prev) {
  let i = 0
  if (prev == undefined) {
    prev = this[0];
    i = 1
  }
  for (; i < this.length; i++) {
    prev = cb(prev, this[i], i, this)
  }
  return prev
}
const res = [1, 2, 3, 4, 5].myReduce((prev, curr) => {
  return prev + curr
}, 5);
console.log(res)[addPrefix, len, sum]
const add1 = str => str + '1'
const add2 = str => str + '2'
const add3 = str => str + '3'
function compose(...fns) {
  return function (args) {
    return fns.reduceRight((prev, curr) => {
      return curr(prev(args))
    })
  }
}
console.log(compose([add3, add2, add1])('a'))
const compose2 = (...fns) => fns.reduce((prev, curr) => (...args) => curr(prev(...args)))

console.log(222, compose2(add1, add2, add3, add4)('a'))