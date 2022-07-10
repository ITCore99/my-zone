import "../css/scss/index.scss";
import "../utils/index.js"
import { setTimeout } from "timers";
window.onload = function() {
    var controls = document.querySelector(".controls");
    var video = document.querySelector("#myVideo");
    var wrap2 = document.querySelector(".wrap2");
    var innerBtn = document.querySelector(".controls > .progress .inner");
    var progress = document.querySelector("#progress");
    var soundInnerBtn = document.querySelector(".sound > .sound-progress .inner");
    var soundWrap2= document.querySelector(".sound  .wrap2");
    var soundProgress = document.querySelector('.sound-progress');
    var startBtn = document.querySelector(".start");
    var startIcon = document.querySelector('#startIcon');
    var stopBtn = document.querySelector(".stop");
    var currentTimeSpan = document.querySelector("#currentTime");
    var totalTimeSpan = document.querySelector("#totalTime");
    var soundIconContainer = document.querySelector('.sound .soundIcon');
    var soundIcon = document.querySelector("#soundIcon");
    var fullScreenContainer = document.querySelector('.fullScreen');
    var fullScreenICon = document.querySelector('.fullScreen > span')

    video.width = document.documentElement.clientWidth;
    video.height = document.body.clientHeight - controls.offsetHeight;
    //全局变量存储定时器实例
    var timer = 0;
    //全局变量存储上一次音量百分比
    var lastsSoundScale = 1;
    window.addEventListener('resize',resizeHandler);
    function resizeHandler() {
        if(document.documentElement.clientWidth < 700) {
            return;
        }
        video.width = document.documentElement.clientWidth;
        video.height = document.body.clientHeight - controls.offsetHeight;
    }
    //主进度条拖拽
    let innerDrag = new window.Drag(innerBtn,{
        move(distance) {
            wrap2.style.width = distance + 'px';
            video.currentTime = video.duration * (distance / (progress.offsetWidth - innerBtn.offsetHeight));
            //注意这里不需要在调用progressMove方法因为拖动的时候会触发点击函数里面的progressMove
        },
    });
    innerDrag.drag();
    //音量主进度条拖拽
    let soundInnerDrag =new window.Drag( soundInnerBtn, {
        move(distance) {
            soundWrap2.style.width = distance + 'px';
            var scale = lastsSoundScale = distance / (soundProgress.offsetWidth - soundInnerBtn.offsetWidth);
            video.volume = scale;
            if(scale == 0) {
                soundIcon.classList.remove('fa-volume-up');
                soundIcon.classList.add('fa-volume-off')
                video.muted = true;
            } else {
                video.muted = false;
            }
        }
    });
    soundInnerDrag.drag();

    //播放器启动函数
    function player() {
        //监听没起到效果不知为何
        video.addEventListener('loadeddata',function() {
            console.log("yy",video.duration);
            totalTimeSpan.innerHTML = calcTime(video.duration);
        });
        //获取视频长度
        setTimeout(() => {
            totalTimeSpan.innerHTML = calcTime(video.duration);
        },500);
        //首次进来将音量置为最大
        video.volume = 1;
        soundInnerBtn.style.left = soundWrap2.style.width = video.volume * (soundProgress.offsetWidth - soundInnerBtn.offsetWidth) + 'px';

        //事件绑定
        soundIconContainer.addEventListener('click',soundClick);
        startBtn.addEventListener('click',play);
        stopBtn.addEventListener('click',stop);
        progress.addEventListener('click',progressClick);
        fullScreenContainer.addEventListener('click',handlerFullscreen)
        //开启视频播放
        function play() {
            if(video.paused) {
                video.play();
                startIcon.classList.remove("fa-play-circle");
                startIcon.classList.add("fa-pause");
                timer = setInterval(() =>{
                    progressMove();
                },1/60)
            } else {
                video.pause();
                startIcon.classList.remove("fa-pause");
                startIcon.classList.add("fa-play-circle");
                if(timer) {
                    clearInterval(timer);
                }
            }
            
        }
        //停止视频播放
        function stop() {
            video.currentTime = 0;
            innerBtn.style.left = wrap2.style.width = 0 + 'px';
            video.pause();
            startIcon.classList.remove("fa-pause");
            startIcon.classList.add("fa-play-circle")
            if(timer) {
                clearInterval(timer);
            }
        }
        //进度条滑动事件
        function progressMove() {
            let range = progress.offsetWidth - innerBtn.offsetWidth;
            innerBtn.style.left = wrap2.style.width = (video.currentTime / video.duration)*range + 'px';
            currentTimeSpan.innerHTML = calcTime(video.currentTime)
            if(video.currentTime == video.duration) {
                if(timer) {
                    clearInterval(timer);
                    video.pause();
                    startIcon.classList.remove("fa-pause");
                    startIcon.classList.add("fa-play-circle");
                }
            }
        }
        //视频主进度条点击事件
        function progressClick(e) {
            let event = e || window.event;
            video.currentTime = video.duration*((event.clientX - progress.offsetLeft) / (progress.offsetWidth - innerBtn.offsetHeight));
            video.play();
            startIcon.classList.remove("fa-play-circle");
            startIcon.classList.add("fa-pause");
            timer = setInterval(() =>{
                progressMove();
            },100)
        }
        //音量点击
        function soundClick() {
            if(video.muted) {
                soundIcon.classList.remove('fa-volume-off')
                soundIcon.classList.add('fa-volume-up');
                if(lastsSoundScale == 0) {      //当一次拖到静音时 点击变为最大声音
                    lastsSoundScale = 1;
                }
                soundInnerBtn.style.left = soundWrap2.style.width = lastsSoundScale * (soundProgress.offsetWidth - soundInnerBtn.offsetWidth) + 'px';
                //注意这里volume和muted属性不同步需要手动去设置
                video.volume = lastsSoundScale;
                video.muted = false;
            } else {
                soundIcon.classList.remove('fa-volume-up');
                soundIcon.classList.add('fa-volume-off')
                video.muted = true;
                soundInnerBtn.style.left = soundWrap2.style.width = 0 + 'px';
            }
        }

        function handlerFullscreen() {
            //!document.webkitIsFullScreen都为true。因此用!!
            var isFull=!!(document.webkitIsFullScreen || document.mozFullScreen || 
                document.msFullscreenElement || document.fullscreenElement
            );
            if(isFull) {
                fullScreenICon.classList.remove('fa-compress');
                fullScreenICon.classList.add('fa-arrows-alt');
                closeFullScreen();
            } else {
                fullScreenICon.classList.remove('fa-arrows-alt');
                fullScreenICon.classList.add('fa-compress');
                openFullScreen();
            }
        }
        //开启全屏
        function openFullScreen() {
            var element = document.documentElement;
            if(element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if (element.mozRequestFullscreen) {
                element.mozRequestFullscreen();
            } else {
                element.msRequestFullscreen();
            }
        }
        function closeFullScreen() {
            if(document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozExitFullscreen) {
                document.mozExitFullscreen();
            } else  {
                document.msExitFullscreen();
            }
        }
        //事件计算辅助函数
        function calcTime(num) {
        num = parseInt(num)
        var h = parseInt((num / 3600));
        var m = parseInt((num % 3600) / 60);
        var s = parseInt(((num % 3600) % 60));
        return `${h > 10 ? h : "0" + h }:${m > 10 ? m : "0" + m }:${s > 10 ? s : "0" + s }`
        }
    }   

    player();
}