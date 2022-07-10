    // 生成自己路径
function generatorSubClass(source) {
      let result = [[]]
      for(let i = 0; i< source.length; i++) {
        let len = result.length
        for(let j = 0; j < len; j++) {
          result.push(result[j].concat(source[i]))
        }
      }
      result.splice(0, 1)
      return result
    }
    console.log(generatorSubClass([1,2,3]))