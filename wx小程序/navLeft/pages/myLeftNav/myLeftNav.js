let navData = [
  { id: "_1", name: '水果' },
  { id: "_2", name: '蔬菜' },
  { id: "_3", name: '面食' },
  { id: "_4", name: '米类' },
  { id: "_5", name: '男服' },
  { id: "_6", name: '女服' },
  { id: "_7", name: '童装' },
  { id: "_8", name: '玩具' },
  { id: "_9", name: '家具' },
  { id: "_10", name: '家电' },
];
let contentData = [
  {
    type: "_1",
    values: [
      { id: 1, type: "_1", name: "水果类", image:"/images/shuiguo.jpg" },
      { id: 2, type: "_1", name: "水果类", image: "/images/shuiguo.jpg"},
      { id: 3, type: "_1", name: "水果类", image: "/images/shuiguo.jpg"},
      { id: 4, type: "_1", name: "水果类", image: "/images/shuiguo.jpg" },
      { id: 5, type: "_1", name: "水果类", image: "/images/shuiguo.jpg"},
      { id: 6, type: "_1", name: "水果类", image: "/images/shuiguo.jpg"},
      { id: 7, type: "_1", name: "水果类", image: "/images/shuiguo.jpg" },
    ]
  },
  {
    type: "_2",
    values:[
      { id: 8, type: 2, name: "蔬菜类", image: "/images/shucai.jpg"},
      { id: 9, type: 2, name: "蔬菜类", image: "/images/shucai.jpg" },
      { id: 10, type: 2, name: "蔬菜类", image: "/images/shucai.jpg" },
      { id: 11, type: 2, name: "蔬菜类", image: "/images/shucai.jpg"},
      { id: 12, type: 2, name: "蔬菜类", image: "/images/shucai.jpg" },
      { id: 13, type: 2, name: "蔬菜类", image: "/images/shucai.jpg" },
      { id: 14, type: 2, name: "蔬菜类", image: "/images/shucai.jpg"}
    ]
  },
  {
    type: "_3",
    values:[
      { id: 15, type: 3, name: "面食类", image: "/images/mianshi.jpg" },
      { id: 16, type: 3, name: "面食类", image: "/images/mianshi.jpg"  },
      { id: 17, type: 3, name: "面食类", image: "/images/mianshi.jpg"  },
      { id: 18, type: 3, name: "面食类", image: "/images/mianshi.jpg"  },
      { id: 19, type: 3, name: "面食类", image: "/images/mianshi.jpg" },
      { id: 20, type: 3, name: "面食类", image: "/images/mianshi.jpg"  },
    ]
  },
  {
    type: "_4",
    values:[
      { id: 21, type: 4, name: "米类", image: "/images/milei.jpg"  },
      { id: 22, type: 4, name: "米类", image: "/images/milei.jpg" },
      { id: 23, type: 4, name: "米类", image: "/images/milei.jpg"  },
      { id: 24, type: 4, name: "米类", image: "/images/milei.jpg" },
      { id: 25, type: 4, name: "米类", image: "/images/milei.jpg" }
    ]
  },
  {
    type: "_5",
    values: [
      { id: 26, type: 5, name: "男服类", image: "/images/nanzhuang.jpg" },
      { id: 27, type: 5, name: "男服类", image: "/images/nanzhuang.jpg" },
      { id: 28, type: 5, name: "男服类", image: "/images/nanzhuang.jpg"},
      { id: 29, type: 5, name: "男服类", image: "/images/nanzhuang.jpg" }
    ]
  },
  {
    type: "_6",
    values: [
      { id: 30, type: 6, name: "女服类", image: "/images/nvzhuang.jpg" },
      { id: 31, type: 6, name: "女服类", image: "/images/nvzhuang.jpg"},
      { id: 32, type: 6, name: "女服类", image: "/images/nvzhuang.jpg"}
    ]
  },
  {
    type: "_7",
    values: [
      { id: 33, type: 7, name: "童装类", image: "/images/tongzhuang.jpg"},
      { id: 34, type: 7, name: "童装类", image: "/images/tongzhuang.jpg"},
      { id: 35, type: 7, name: "童装类", image: "/images/tongzhuang.jpg"}
    ]
  },
  {
    type: "_8",
    values: [
      { id: 36, type: 8, name: "玩具类", image: "/images/wanju.jpg" },
      { id: 37, type: 8, name: "玩具类", image: "/images/wanju.jpg"  },
      { id: 38, type: 8, name: "玩具类",image: "/images/wanju.jpg"  }
    ]
  },
  {
    type: "_9",
    values: [
      { id: 39, type: 9, name: "家具类" ,image: "/images/jiaju.jpg"  },
      { id: 40, type: 9, name: "家具类" , image: "/images/jiaju.jpg" },
      { id: 41, type: 9, name: "家具类" , image: "/images/jiaju.jpg" },
    ]
  },
  {
    type: "_10",
    values: [
      { id: 42, type: 10, name: "家电类", image: "/images/jiadian.jpg"  },
      { id: 43, type: 10, name: "家电类", image: "/images/jiadian.jpg"},
      { id: 44, type: 10, name: "家电类", image: "/images/jiadian.jpg"},
    ]
  }
]
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    //左侧导航栏数据
    navData,  
    //右侧内容区数据
    contentData,
    //页面窗口高度
    windowHeight: "",
    //左侧激活导航id
    activeNavId: navData[0].id,
    //容器各部分内容的高度  
    heightArr: [],
    //容器的高度
    containerH: "",
    //每次被选中分类变时才设置setData否则就会一直触法setData导致滚动条没法滚动
    lastActive: ""


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.getSystemInfo({
      success(res){
        let { windowHeight, windowWidth} = res;
        windowHeight = (750 / windowWidth) * windowHeight;
        that.setData({
          windowHeight
        })
      }
    });
    this.getContentModuleHeight();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 左侧导航栏点击回调
   */
  navTap(e) {
    let { id } = e.target.dataset;
    this.setData({
      activeNavId: id,
    });
  },
  /**
   * 获取右侧内容各部分的高度
   */
  getContentModuleHeight() {
    let that = this;
    let s = 0;
    let heightArr = [];
    const query = wx.createSelectorQuery();
    query.selectAll(".module").boundingClientRect(res => {
      res.forEach(item => {
        let { height } = item;
        s += height;
        heightArr.push(s);
      });
      that.setData({
        heightArr,
      });
    });
    query.select(".content-part").boundingClientRect(res => {
      this.setData({
        containerH: res.height
      })
    });
    query.exec();
   
  },
  /**
   *右侧内容区的滚动事件 
   */
  contentScroll(e) {
    let { scrollTop} = e.detail;
    scrollTop += 10;
    let heightArr = this.data.heightArr;
    if (scrollTop >= heightArr[heightArr.length - 1] - this.data.containerH){ //超过最大的滑动距离
      return;
    } else {
      for(let i = 0;i < heightArr.length ;i++) {
        if (scrollTop >= 0 && scrollTop < heightArr[0] ){
          if(this.data.lastActive != 0) {
            this.setData({
              activeNavId: this.data.navData[0].id,
              lastActive: 0
            })
          }
        
        } else if(scrollTop >= heightArr[i-1] && scrollTop < heightArr[i]) {
          if(this.data.lastActive != i) {
            this.setData({
              activeNavId: this.data.navData[i].id,
              lastActive: i,
            })
          }
        }
      }
    }
  }
})