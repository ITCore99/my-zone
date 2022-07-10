var textEl = document.querySelector('#text');
var texts = JSON.parse(textEl.getAttribute('data-text'));
//文本数组下标
var index = 0;
//文本中的字下标
var charIndex = 0;
//打字的间隔时间
var delta = 500;
//动画开始时间
var start = null;
//当每行文本打印完之后将其设置为true 删除该文本开始下一行文本的展示
var isDeleting = false;

function type(time) {
    if(!start) {
        start = time; //动画开始的事件
    }
    let progress = time - start;
    if(progress > delta) {    //如果间隔大于500ms
        let text = texts[index];  //获取文本
        if(!isDeleting) {
            textEl.innerHTML = text.slice(0,++charIndex);
            //模拟人工打字
            delta = 500 - Math.random()*400
        }else {
            textEl.innerHTML = text.slice(0,--charIndex);
        }
        //表明打完一个字/删除一个字
        start = time;

        if(charIndex == text.length) {  //文本全部打印完 开始删除
            isDeleting = true;
            delta = 200;
            start = time  + 1000;   //隔1200秒后删除
        }

        if(charIndex == 0) { //一组文字删除完毕
            isDeleting = false;
            start = time + 200;
            index = ++index % texts.length;
            charIndex = 0;
        }
    }
    window.requestAnimationFrame(type)
}
window.requestAnimationFrame(type);
