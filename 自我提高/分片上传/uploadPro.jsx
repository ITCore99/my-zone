import Uploadfile from "../api/upload";
import { CancelToken } from "../api/request";
export default {
  data() {
    return {
      files: []
    };
  },
  methods: {
    //文件选择
    fileChanged() {
      if(this.$refs.file.files.length > 10) {
        return  this.$message.warning("上传文件不能超过十个");
      }
      let fileSize = 0;
      [].forEach.call(this.$refs.file.files,(item => {
        fileSize += item.size
      }));
      if(fileSize > (1024*1024*1024)) {
          return this,$message.warning("上传文件大小总和不能超过1G");
      }
      let _this = this;
      for (let i = 0; i < this.$refs.file.files.length; i++) {
        let file = this.$refs.file.files[i];
        if (this.files.some(el => el.fileName === file.name)) continue;   //此文件之已前上传跳过
        //生成文件对象
        let fileItem = {
          file: file,
          fileName: file.name,
          fileSize: file.size,
          msg: "",
          percent: 0,
          checked: false,
          status: "", //start | pause | finished,
          fileMd5: "",
          suffix: file.name.substring(file.name.lastIndexOf(".") + 1),
          uploadfile: new Uploadfile({
          // source: CancelToken.source(),
            file: file,
            //回调更新
            checkCb: function(msg) {
              _this.files = _this.files.map(el =>
                el.file === file ? { ...el, msg: msg } : el
              );
            },
            //回调更新
            uploadCb: function(transMsg) {
              _this.files = _this.files.map(el =>
              el.file === file ? { ...el, msg: transMsg } : el
              );
            },
            //回调更新
            percentCb: function(percent) {
              _this.files = _this.files.map(el =>
                el.file === file ? { ...el, percent: percent } : el
              );
            },
            //回调更新
            startCb: function() {
              _this.files = _this.files.map(el =>
                el.file === file ? { ...el, status: "start" } : el
              );
            },
            //回调更新
            finishedCb: function() {
              _this.files = _this.files.map(el =>
                el.file === file ? { ...el, status: "finished" } : el
              );
            },
            //回调
            md5Cb: function(md5) {
              _this.files = _this.files.map(el =>
                el.file === file ? { ...el, fileMd5: md5 } : el
              );
            },
            suffixCb: function(suffix) {
              _this.files = _this.files.map(el =>
                el.file === file ? { ...el, suffix: suffix } : el
              );
            },
            filePathCb: function(filePath) {
              _this.files = _this.files.map(el =>
                el.file === file ? { ...el, filePath: filePath } : el
              );
            },
            fileIdCb: function(fileId) {
              _this.files = _this.files.map(el =>
                el.file === file ? { ...el, fileId: fileId } : el
              );
            }
          })
        };
        this.files.push(fileItem);
      }
      this.$refs.file.value = "";
      this.files.forEach(item => {
        this.startUpload(item);
      })
    },
    //开始上传   
    startUpload(el) {
      console.log("startUpload!", el);
      el.uploadfile.reset();
      el.uploadfile.startUpload();
    },
    //暂停上传
    pauseUpload(el) {
      this.files = this.files.map(_el =>
        _el.file === el.file ? { ..._el, status: "finished" } : _el
      );
      console.log("pauseUpload!");
      el.uploadfile.pauseUpload();
    },
    //取消上传
    cancelUpload(el) {
      el.uploadfile.cancelUpload();
      this.files = this.files.filter(_el => _el.file !== el.file);
      console.log("cancelUpload", el);
    },
    //开始选择文件
    handlerClick() {
      this.$refs.file.click();
    }
  },
  created() {},
  watch: {
    files:{
      handler(newValue) {
        this.$emit("updateFile",newValue);
      },
      deep: true
    }
  },
  render() {
    return (
      <div>
        <input
          type="file"
          class="bigfile"
          onchange={this.fileChanged}
          style="display:none"
          ref="file"
          name="file"
          accept="image/*,.ofd,.xls,.doc,.docx,.pdf,.zip,.txt"
          multiple
        />
      </div>
    );
  }
};
