/**
 * 定义自己promise模块
 */
(function (window) {
  const PENDING = "pending";
  const RESOLVE = "resolve";
  const REJECT = "reject";
  //定义promise的构造函数
  function Promise(executor) {
    //定义promise状态
    this.status = PENDING;
    //保存数据
    this.data = "";
    //当为pending状态也就是先定义回调在进行改变状态的情况下保存定义的回调函数 [{onResolved,onRejected}]
    this.callBacks = [];

    let that = this;
    //定义resolve函数 resolve调用时主要要做的是改变状态和保存成功数据 异步执行回调成功函数
    function resolve(value) {       //注意这个函数如果写成ES5的由于是回调函数所以this是window而不是promise实例 

      //为了保证状态值只能改变一次
      if (that.status != PENDING) {
        return
      }

      that.status = RESOLVE;
      that.data = value;

      //如果存在回调函数则以异步执行回调函数
      if (that.callBacks.length > 0) {
        setTimeout(() => {
          that.callBacks.forEach(callBackItem => {
            callBackItem.onResolved(value);
          })
        }, 0)
      }
    }

    //定义reject函数 reject函数调用时要做的是改变状态保存错误的原因 异步执行失败的回调
    function reject(reason) {

      //为了保证状态值只能改变一次
      if (that.status != PENDING) {
        return
      }

      that.status = REJECT;
      that.data = reason;

      //如果存在回调函数则要异步的去执行错误的会回调
      if (that.callBacks.length > 0) {
        setTimeout(() => {
          that.callBacks.forEach(callBackItem => {
            callBackItem.onRejected(reason);
          })
        }, 0)
      }
    }

    //同步执行执行器函数 执行器报错直接调用reject
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }

  }

  //promise.then方法返回一个promise
  Promise.prototype.then = function (onResolved, onRejected) {

    onResolved = typeof onResolved === "function" ? onResolved : (value) => value;  //向后传递成功的value
    //实现异常的穿透
    onRejected = typeof onRejected === "function" ? onRejected : (reason) => { throw reason };    //向后传递失败的reason

    const that = this;
    //返回一个promise 新的promise状态的由回调函数的执行结果决定
    return new Promise((resolve, reject) => {

      //调用指定的回调函数处理，并影响返回新的promise的结果
      function handler(callback) {
        /**
        * 由于新的promise的结果由回调函数的执行结果决定 分为三种状态
        * 1、执行时出现异常 返回的promise就会失败 reason是异常出现的原因
        * 2、返回的是一个promise则 返回的promise就是 返回promise的结果
        * 3、如果返回的不是promise 返回的promise就是成功 成功的值就是返回回来的值
        */
        try {
          let result = callback(that.data);
          if (result instanceof Promise) {     //2、返回的是一个promise
            result.then(resolve, reject);    // result.then(value => {resolve(value)},reason => {reject(reason)});
          } else {                             //3、如果返回的不是promise
            resolve(result);
          }
        } catch (error) {                        //1、执行时出现异常 直接调用reject reason是异常出现的原因
          reject(error);
        }
      }

      if (that.status == PENDING) {    //当前的状态为pending状态 时存储成功和失败的回调函数
        that.callBacks.push({       //如果直接onResolved 是没法改变新promise的状态的 而我们定义的handler函数恰巧具备两个功能执行回调和改变新promise的状态
          onResolved() {
            handler(onResolved)
          },
          onRejected() {
            handler(onRejected)
          }
        });
      } else if (that.status == RESOLVE) {   //如果当前是resolve的状态 异步的去执行onResolved 并且改变返回新的promise状态
        setTimeout(() => {
          handler(onResolved)
        }, 0);
      } else if (that.status == REJECT) {   //如果当前是reject状态 异步的去执行onRejected 并且改变返回新的promise状态
        setTimeout(() => {
          handler(onRejected)
        }, 0);
      }
    })
  }

  //promise实例的catch方法
  Promise.prototype.catch = function (onRejected) {
    return this.then(undefined, onRejected);
  }

  //返回一个成功的promise
  Promise.resolve = function (value) {
    return new Promise((resolve, reject) => {
      if (value instanceof Promise) {  //是promise
        value.then(resolve, reject)
      } else { //非promise
        resolve(value);
      }
    })
  }

  //返回一个失败的promise
  Promise.reject = function (reason) {
    return new Promise((resolve, reject) => {
      reject(reason);
    })
  }

  //promise.all返回一个promise的函数对象方法 
  Promise.all = function (promises) {
    let resultArr = [];
    return new Promise((resolve, reject) => {
      promises.forEach((item, index) => {
        item.then(value => {
          resultArr[index] = value;
          if (resultArr.length == promises.length) {
            return resolve(resultArr);
          }
        }, reason => {
          reject(reason)
        })
      });
    })


  }
  //将promise 暴露出去
  window.Promise = Promise;

})(window)