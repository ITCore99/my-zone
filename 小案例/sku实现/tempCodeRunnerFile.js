/**
 * 电商sku 组合集合生成算法 也是 所有的排列组合算法的万能模板
 */
let names = ['iphone X', 'iphone XS']
let colors = ['黑色', '白色']
let storages = ['64G', '256G']

// 生成所有组合的集合
let combine = function(...chunks) {
  // 存放组合的结构
  let res = [] ;
  // chunkIndex chunks的索引 prev上一次组合的结果
  let helper = function(chunkIndex, prev) {
    // 取到当前的chunk
    let chunk = chunks[chunkIndex]
    // 取到当前chunk索引
    let isLastIndex = chunkIndex === chunks.length - 1
    // 把当前的chunk与之前组合结果进行拼接
    for(let item of chunk) {
      let cur = prev.concat(item)
      if (isLastIndex) {
        res.push(cur)
      } else {
        helper(chunkIndex + 1, cur)
      }
    }
  }
  helper(0, [])
  return res
}

let result = combine(names, colors, storages)
console.log('result', result)

/**
 * 类似问题2 
 * 给定两个整数n和k 返回1-n中所以可能k个数的组合
 */
let combine2 = function(n, k) {
  // 存放组合结果
  let res = []
  // 当前要拼接的数start和上一次拼接玩的数组prev
  let helper = function(start, prev) {
    let len = prev.length;
    if (len === k) {
      res.push(prev)
    } else {
      for(let i = start; i <= n; i++) {
        helper(i + 1, prev.concat(i))
      }
    }
  }
  helper(1, [])
  return res
}
let result2 = combine2(4, 2)
console.log('result', result2)