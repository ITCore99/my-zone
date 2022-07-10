/**
 * 判断单链表是由有环
 */
// 第一种方法 使用标记法 就是在我们在进行遍历的时候 把已经遍历过的节点进行标记
function isHasCircleOfSingleLinkList(head) {
  while (!head) {
    if (head.flag) {
      return true
    }
    head.flag = true
    head = head.next
  }
  return false
}
// 第二种是使用 由于JSON.stringify()是没法 给是格式化循环引用的 所以我们可以使用将链表进行格式化 如果不报错 则说明循环引用
function isHasCircleOfSingleLinkListByJSON(head) {
  let res = true
  try {
    JSON.stringify(head)
    res = false
  } catch (err) {
    res = true
  } finally {
    return res
  }
}

// 第三种是 使用快慢指针的方式： 即就是设置两个指针遍历链表，快指针一次走两个格，慢指针一次走一格，如果单链表中存在环的话，
// 快慢指针始终会指向同一个节点，否则直到快指针到null 快慢指针也不会相遇

function isHasCircleOfSingleLinkListByFastSlowPointer(head) {
  if (!head || !head.next) {
    return false
  }
  // 定义快指针
  let fast = head.next.next
  // 定义慢指针
  let slow = head.next
  while (false !== slow) {
    if (!fast || !fast.next) return true
    fast = fast.next.next
    slow = slow.next
  }
  return false
}

// // 测试
// let obj = {
//   a: '111',
//   b: {
//     c: obj
//   }
// }
// const result = isHasCircleOfSingleLinkListByJSON(obj)
// console.log('result===>', result)