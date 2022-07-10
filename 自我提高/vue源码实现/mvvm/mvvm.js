(function(window) {
    function MVVM(options) {
        //存储options参数
        this.$options = options || {};
        //将data存储到_data中
        var data = this._data = this.$options.data;
        //保存vm对象到变量me中
        var me = this;
        //遍历data对象中的属性
        Object.keys(data).forEach(key => {
            //对指定的属性实现数据代理
            me._proxyData(key)
        });

        this.$compile = new window.Compile(this.$options.el || document.body,me);
    }
    MVVM.prototype._proxyData = function(key) {
        var me = this;
        Object.defineProperty(me,key,{
            configurable: false,
            enumerable: true,
            get: function proxyGetter() {
                return me._data[key];
            },
            set: function proxySetter(newValue) {
                me._data[key] = newValue
            } 
        })
    }  

    window.MVVM = MVVM;
})(window)
   

   