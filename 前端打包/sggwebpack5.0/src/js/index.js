import '../less/index.less';
import '../assets/iconfont/iconfont.css';
import '../css/a.css';
import '../css/b.css';
import $ from 'jquery';
import { print } from './print';
// import { mul } from './test';

// eslint-disable-next-line
console.log('index.js被加载了');

function add(x, y) {
  return x + y;
}

// 下一行不进行eslint检查
// eslint-disable-next-line
console.log(add(1, 2, 3));

// eslint-disable-next-line
// console.log(mul(5, 6));

print();

if (module.hot) {
  // 一旦module.hot为true，说明了开启HMR功能 ----> 让HMR功能生效
  module.hot.accept('./print.js', () => {
    // 监听print.js 文件变化，一旦发生变化，其他模块不会重新打包构建 会执行回调
    print();
  });
}

// eslint-disable-next-line
console.log($);

/*
  通过js代码，让某个文件单独打包成一个chunk 有点问题不知道为啥跑不起来 有空再搞
 */
// import(/* webpackChunkName: 'test' */'./test')
//   .then((res) => {
//     // eslint-disable-next-line
//     console('result', res);
//   })
//   .catch((err) => {
//     // eslint-disable-next-line
//     console.log('文件获取失败', err);
//   });

/**
 * 需要注意的是eslint不认识 window、navigator 等全局配置所以我们需要修改package.json的配置为如下指定为浏览* 器环境
 * "eslintConfig": {
    "extends": "airbnb-base",
    "env": {
      "browser": true
    }
  },

  sw的代码必须运行到服务器上
  ---> 1.node.js
  ---> 2.npm i serve -g  安装一个服务器 serve -s build 启动服务器将build的目录下的资源当做静态资源暴露出去

 */
// 注册serviceworker
if (window.navigator.serviceWorker) {
  window.addEventListener('load', () => {
    // 文件是webpack打包生成的
    window.navigator.serviceWorker.register('/service-worker.js')
      .then(() => {
        console.log('ws注册成功了');
      })
      .catch(() => {
        console.log('ws注册失败了');
      });
  });
}
