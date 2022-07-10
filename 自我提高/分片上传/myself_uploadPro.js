var template = `
<div>
    <input 
        type="file"
        @change="fileChanged"
        style="display:none;"
        ref="file"
        multiple
    />
</div>
`;
Vue.component('upload',{
    template,
    data() {
        return {
            //用来存放文件
            files: [],
        }
    },
    methods: {
        //文件改变回调
        fileChanged() {
            //获取所有选中的文件
            var files = this.$refs.file.files;
            var _this = this;
            for(let i = 0; i < files.length; i++) {
                //获取到每一个file文件
                let file = files[i];
                //生成file 文件对象
                let fileItem = {
                    file,
                    fileName: file.name,
                    fileSize: file.size,
                    //存放文件信息
                    msg: "",
                    //存放上传百分比
                    percent: 0,
                    checked: false,
                    //目前文件的状态 "start|pause|finished"
                    status: "",
                    //存放文件的MD5
                    fileMd5: "",
                    //文件后缀名
                    suffix: file.name.substring(file.name.lastIndexOf(".") + 1),
                    uploadFile: new UploadFile({
                        //当前文件对象
                        file,
                        //开始上传回调
                        startCb() {
                            _this.files.map(el => el.file === file ? {...el,status: "start"} : el);
                        },
                        //信息更新回调
                        checkCb(msg) {
                            _this.files.map(el => el.file === file ? {...el, msg: msg} : el);
                        },
                        uploadCb(uploadMsg) {
                            _this.files.map(el => el.file === file ? {...el,msg:uploadMsg} : el);
                        },
                        //上传文件的百分比
                        percentCb(percent) {
                            _this.files.map(el => el.file === file ? {...el, percent:percent} : el )
                        },
                        //回调更新
                        finishedCb: function() {
                            _this.files = _this.files.map(el =>
                            el.file === file ? { ...el, status: "finished" } : el
                            );
                        }

                    })
                }
                this.files.push(fileItem);
            } 
            console.log(this.files);
        },
        //文件选择点击
        handleClick() {
            this.$refs.file.click();
        }
    }
});
var vm = new Vue({
    el: "#app",
    data: {
        message: "测试vue的cdn方式引入"
    },
    methods: {
        openUpload() {
            this.$refs.child.handleClick();
        }
    }
});