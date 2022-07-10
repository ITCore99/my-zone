let vm = new Vue({
  el: '#app',
  data: {
    // 当前选中规格数组
    currentSelectedList: [],
    // 规格数组
    list: [
      {
        category: 'color',
        values: [
          {name: '红色', checked: false, sort: 1, disable: false, category: 'color'}, 
          {name: '白色', checked: false, sort: 1, disable: false, category: 'color'}, 
          {name: '蓝色',   checked: false, sort: 1, disable: false, category: 'color',}
        ]
      }, 
      {
        category: 'size',
        values: [
          {name: '大', checked: false, sort: 2, disable: false,   category: 'size' }, 
          {name: '中', checked: false, sort: 2, disable: false,   category: 'size'}, 
          {name: '小' ,checked: false, sort: 2, disable: false,   category: 'size'}
        ]
      },
      {
        category: 'type',
        values: [
          {name: 'A', checked: false, sort: 3, disable: false, category: 'type'}, 
          {name: 'B', checked: false, sort: 3, disable: false, category: 'type'}, 
          {name: 'C', checked: false, sort: 3, disable: false,  category: 'type'}
        ]
      }
    ],
    // 当前存在库存的组合
    currentSku:[
      ["红色", "大", "A"],
      ["白色", "中", "B"],
      ["蓝色", "小", "C"]
    ],
    currentAllRoute: []
  },
  created() {
    this.getAllRoute()
  },
  methods: {
    handleChangeCheck(parent, cIndex, child) {
      let {category} = parent
      let {checked, disable}  = child
      let list = this.list
      let currentSelectedList = this.currentSelectedList
      if (checked) {   // 取消选中
        let index = currentSelectedList.findIndex(item => item.category === category)
        currentSelectedList.splice(index, 1)
      } else {  // 选中
        if (disable) {  // 点击被禁用的规格时将所有选中重置进行重新计算
          this.resetAllOfCategory()
          currentSelectedList.splice(0, currentSelectedList.length)
        }
        list.forEach(item => {  // 清空当前分类的选中的项
          if (item.category === category) {
            item.values.forEach(temp => {
              temp.checked = false
              temp.disable = false  
            })
          }
        })
        // 当前选中元素
        let currentSelectedItem = {
          category,
          value:child 
        }
        if (currentSelectedList.length == 0) {  // 当前无选中元素
          currentSelectedList.push(currentSelectedItem)
        } else {
          let index = currentSelectedList.findIndex(item => item.category === category)
          if (index !== -1) {  // 存在相同类型
            currentSelectedList.splice(index, 1, currentSelectedItem)
          } else {
            currentSelectedList.push(currentSelectedItem)
          }
        }
      }
      // 改变选中状态
      list.forEach(item => {
        if (item.category === category) {
          item.values[cIndex].checked = !item.values[cIndex].checked
        }
      });

      // 获取没被选中的元素
      let notCheckedItemArr = this.getNotSelectedItem()

      // 计算对不存在组合路径的未选中元素进行禁用
      this.calcNotSelectedIsDisable(notCheckedItemArr)
      currentSelectedList.sort(this.compare)
      this.list = list
    },

    // sort自定义回调
    compare(a, b) {
      let aSort = a.value.sort
      let bSort = b.value.sort
      return aSort < bSort ? -1 : 1 
    },
  
    // 获取未被选中的元素
    getNotSelectedItem() {
      let notSelectedItemArr = []
      this.list.forEach(item => {
        item.values.forEach(temp => {
          if (!temp.checked) {
            notSelectedItemArr.push(temp)
          }
        })
      })
      return notSelectedItemArr
    },

    // 生成一条组合路径
    createdRoute(routeArr) {
      let path = ''
      routeArr.forEach(item => {
        path += item.value.name + "-"
      })
      path = path.substring(0, path.length - 1)
      return path
    },
    
    // 计算对不存在组合路径的未选中元素进行禁用
    // 注意这里的思路是我们以未选中的元素与已选中的元素进行生成路径进行匹配
    calcNotSelectedIsDisable(notCheckedItemArr) {
      let currentSelectedList = this.currentSelectedList
      // 遍历未选中元素
      notCheckedItemArr.forEach(item => {
        let routeArr = []
        let justifyItem = {
          category: item.category,
          value: item 
        }
        routeArr.push(justifyItem)
        // 遍历规格数组
        this.list.forEach(ele => {
          let index  = currentSelectedList.findIndex(temp =>  ele.category === temp.category)
          if (index !==  -1) {  // 当前属性行有已选元素
            let selectedItem = currentSelectedList[index]
            if (item.category !== selectedItem.category) {
              routeArr.push(selectedItem)
            }
          } 
        })
        // 对已选的数组进行排序
        routeArr.sort(this.compare);
        // 生成一个路径
        let currentSelectedStr = this.createdRoute(routeArr);
        //判断存不存在这样的路径
        let flag = this.currentAllRoute.includes(currentSelectedStr)
        if (!flag) {
          item.disable = true
        } else {
          item.disable = false
        }
      })
    },

    // 清空所有规格的选中状态
    resetAllOfCategory() {
      this.list.forEach(item => {
        item.values.forEach(temp => {
          temp.checked = false
        })
      })
    },

    // 得到当前所有组合的可以匹配路径
    getAllRoute() {
      let currentSku = this.currentSku;
      let currentAllRoute = []
      for (let i = 0; i< currentSku.length; i++) {
        let subClass = this.generatorSubClass(currentSku[i])
        subClass.forEach(item => {
          currentAllRoute.push(item.join('-'))
        })
      }
      this.currentAllRoute = currentAllRoute
    },

    // 生成自己路径
    generatorSubClass(source) {
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
  }
})

// 参考资料： https://keelii.com/2016/12/22/sku-multi-dimensional-attributes-state-algorithm/#%E9%97%AE%E9%A2%98%E6%8F%8F%E8%BF%B0
