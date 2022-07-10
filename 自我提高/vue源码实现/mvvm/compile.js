(function(window) {
    class Compile {
        constructor(el,vm) {
           this.$vm = vm; 
           this.$el = this.isElementNode(el) ? el : document.querySelector(el);

           if(this.$el) { 
                //将真实的Dom通过documentFragment 添加到内存中使只多次修改DOm操作的情况变为只修改一次 提高效率 但是//缺点只能用于局部
                this.$fragment = this.node2Fragment(this.$el);
                //进行Dom的编译
                this.init()
                //将生成的documentFragment添加页面Dom中
                this.$el.appendChild(this.$fragment)
           }
        }
        //将真实的Dom节点移到documentFragment放到内存中
        node2Fragment(el) {
            //创建一个documentFragment容器进行存放Dom结构
            var fragment = document.createDocumentFragment(),child;
            //循环遍历添加dom的节点到createDocumentFragment容器中
            while(child = el.firstChild) {
                fragment.appendChild(child);
            }
            return fragment;
        }
        //编译Dom模板
        init() {
            this.compileElement(this.$fragment)
        }
        //编译元素
        compileElement(el) {
            //获取根节点下的所有子节点包括换行
            var childNodes = el.childNodes,
            me = this;
            [].slice.call(childNodes).forEach((node) => {
                //获取节点的文本
                var text = node.textContent;
                //进行匹配{{}}表达式
                var reg = /\{\{(.*)\}\}/;
                //判断是不是元素节点 因为里面含有换行节点所以要判断
                if(this.isElementNode(node)) {   //编译元素节点指令
                    this.compile(node)
                }else if(this.isTextNode(node) && reg.test(text)) { //判断是文本节点且内容符合大括号表达式则编译
                    this.compileText(node,RegExp.$1.trim())
                }
                //递归遍历所有元素节点
                if(node.childNodes && node.childNodes.length) {
                    this.compileElement(node)
                }
            })
        }
        //编译元素节点
        compile(node) {
            //获取元素节点上的所有属性
            var nodeAttrs = node.attributes;
            [].slice.call(nodeAttrs).forEach(item => {
                var attrName = item.name
                //判断是不是vue指令
                if(this.isDirective(attrName)) {
                   var exp = item.value;
                   var dir = attrName.substring(2);
                   //判断是不是事件指令
                   if(this.isEventDirective(dir)){
                        compileUtil.eventHandler(node,this.$vm,exp,dir)
                   }else {     //普通指令
                        console.log('normal',dir,compileUtil[dir]);
                        compileUtil[dir] && compileUtil[dir](node,this.$vm,exp);
                    }
                    node.removeAttribute(attrName)
                }
            })
        }
        //编译文本节点
        compileText(node,exp) {
            compileUtil.text(node,this.$vm,exp)
        }
        //判断是不是一个元素节点
        isElementNode(el) {
            return el.nodeType === 1;
        }
        //判断是不是一个文本节点
        isTextNode(el) {
            return el.nodeType === 3;
        }
        //判断是不是vue指令
        isDirective(name) {
            return name.indexOf('v-') === 0;
        }
        //判断是不是事件指令
        isEventDirective(dir) {
            return dir.indexOf('on') === 0;
        }
    }
    //编译工具类
    window.compileUtil = {
        text(node,vm,exp) {
            this.bind(node,vm,exp,'text');
        },
        html(node,vm,exp) {
            this.bind(node,vm,exp,'html')
        },
        bind(node,vm,exp,dir) {
            var updateFn = updater[dir + 'Updater'];
            updateFn && updateFn(node,this._getVMVal(vm,exp))
        },
        //从vm中获取数据
        _getVMVal(vm,exp) {
           var val = vm;
           var expArr = exp.split('.');
           expArr.forEach((name) => {
               val = val[name]
           });
           return val;
        },
        //事件处理函数
        eventHandler(node,vm,exp,dir) {
            //获取事件类型
            var eventType = dir.split(':')[1];
            //获取对应的事件
            var fn = vm.$options.methods && vm.$options.methods[exp];
            if(eventType && fn) {
                node.addEventListener(eventType,fn.bind(vm),false);
            }
        }   
    }
    window.updater = {
        textUpdater(node,value) {
            node.textContent = typeof value == 'undefined' ? '' : value;
        },
        htmlUpdater(node,value) {
            node.innerHTML = typeof value == 'undefined' ? '' : value
        }
    }
    window.Compile = Compile;
})(window)