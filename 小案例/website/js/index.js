const glide = new Glide('.glide');
const captionEl = document.querySelectorAll('.slide-caption');
//监听轮播图的加载后和轮播后事件
glide.on(['mount.after','run.after'],() => {
    //获取当前的轮播索引
    const caption = captionEl[glide.index];
    anime({
        targets: caption.children,
        opacity:[0,1],
        duration: 400,
        easing:'linear',
        delay: anime.stagger(400,{start:300}),
        translateY:[anime.stagger([40,10]),0]
    });
})
//轮播之前将所有的内容透明度设置为0
glide.on('run.before',() => {
    document.querySelectorAll('.slide-caption > *').forEach(el => {
        el.opacity = 0;
    })
});
glide.mount();

//成功案例切换效果
const isotope = new Isotope(".cases",{
    layoutMode: 'fitRows',
    itemSelector: '.case-item'
});
const filterBtns = document.querySelector('.filter-btns')
filterBtns.addEventListener('click',e => {
    let {target} = e;
    const filterOptions = target.getAttribute('data-filter');
    if(filterOptions) {
        document.querySelectorAll('.filter-btn.active').forEach(btn => btn.classList.remove('active'));
        target.classList.add('active');
        isotope.arrange({filter:filterOptions});
    }
});

//固定导航栏
const header = document.querySelector('header');
document.addEventListener('scroll',() => {
    if(Math.round(document.documentElement.scrollTop ||document.body.scrollTop)  > 800) {
        if(!header.classList.contains('strict')) {
            header.classList.add('strict')
        }
    }else {
        header.classList.remove('strict');
    }
});

//平滑滚动
var scroll = new SmoothScroll('nav a[href*="#"], .scrollToTop a[href*="#"]',{
    header:"header",
    offset:80

});

