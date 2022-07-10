import SparkMD5 from "spark-md5";
//import http from "./http";
import api from "../api/api"

function Uploadfile(config) {
  let {
    file,
    startCb,
    checkCb,
    uploadCb,
    finishedCb,
    percentCb,
    md5Cb,
    suffixCb,
    filePathCb,
    fileIdCb,
    source
  } = config;
  this.start = 0;
  this.end = 0;
  this.file = file;
  this.currentChunk = 0;
  this.chunkSize = 1024000;
  this.chunks = 0;
  this.percent = 0;
  this.pauseStatus = true;
  this.blobSlice =
    window.File.prototype.slice ||
    window.File.prototype.mozSlice ||
    window.File.prototype.webkitSlice;
  this.fileReader = new FileReader();
  this.sparkArrayBuffer = new SparkMD5.ArrayBuffer();
  this.tmpDataList = [];
  this.formDataList = [];
  this.cancel = false;
  this.uploadedNumber = 0;

  this.reset = function() {
    this.start = 0;
    this.end = 0;
    this.file = file;
    this.currentChunk = 0;
    this.chunkSize = 1024000;
    this.chunks = 0;
    this.percent = 0;
    this.pauseStatus = true;
    this.blobSlice =
      window.File.prototype.slice ||
      window.File.prototype.mozSlice ||
      window.File.prototype.webkitSlice;
    this.fileReader = new FileReader();
    this.sparkArrayBuffer = new SparkMD5.ArrayBuffer();
    this.tmpDataList = [];
    this.formDataList = [];
    this.cancel = false;
    this.uploadedNumber = 0;
  };
  this.startUpload = function() {
    this.computedSliceMd5();
    startCb(this);
    return this;
  };
  this.pauseUpload = function() {
    this.cancel = true;
    this.reset();
    return this;
  };
  this.cancelUpload = function() {
    this.cancel = true;
    source.cancel("用户取消了上传!");
    this.reset();
    return this;
  };

  this.finishedUpload = function() {
    finishedCb(this);
    return this;
  };
  this.computedSliceMd5 = function() {
    // this.msg = "正在校验文件....";
    checkCb("正在校验文件....");
    this.chunks = Math.ceil(this.file.size / this.chunkSize);
    this.fileReader.onload = e => {
      if (this.cancel) return;
      this.sparkArrayBuffer.append(e.target.result);
      this.currentChunk++;
      if (this.currentChunk < this.chunks) {
        // this.msg = "正在校验文件:" + this.currentChunk + "/" + this.chunks;
        checkCb("正在校验文件:" + this.currentChunk + "/" + this.chunks);
        this.loadNext();
      } else {
        this.md5 = this.sparkArrayBuffer.end();
        this.tmpDataList.forEach(el => {
          let formData = new FormData();
          formData.append("filename", this.file.name);
          formData.append("relativePath", this.file.name);
          formData.append("totalSize", this.file.size);
          formData.append("chunkSize", this.chunkSize);
          formData.append("md5", this.md5);
          formData.append("totalChunks", this.chunks);
          formData.append("file", el.file);
          formData.append("currentChunkSize", el.currentSize);
          formData.append("chunkNumber", el.currentNum + 1);
          formData.append("elementId",sessionStorage.getItem("elementId") ? sessionStorage.getItem("elementId") >> 0 : 0);
          this.formDataList.push(formData);
        });
        checkCb("文件校验完毕");
        this.checkMd5();
      }
    };
    this.fileReader.onerror = function() {
      checkCb("读取文件出错,清重试!");
    };
    //注意这是同步代码会线程会先走这个进行分取第一片
    this.loadNext();
  };
  //校验文件md5
  this.checkMd5 = function() {
    //开始校验MD5值,向服务器发送请求，服务器返回已上传文件列表
    let formData = new FormData();
    formData.append("md5", this.md5);
    formData.append("filename", this.file.name);
    formData.append("totalSize", this.file.size);
    formData.append("totalChunks", this.chunks);
    formData.append("chunkSize", this.chunkSize);
    formData.append("totalChunks", this.chunks);
    formData.append("elementId",sessionStorage.getItem("elementId") ? sessionStorage.getItem("elementId") >> 0 : 0);
    //判断文件是否之前传过
    api.checkUploadFile(formData)
      .then(data => {
        uploadCb(data.msg);
        if (data.finished) {
          this.uploadedNumber = this.chunks;
          checkCb("文件已经上传完毕");
          this.finishedUpload();
          percentCb(this.percent);
        } else {
          let needUploadList = this.formDataList.filter(
            el => data.chunks.indexOf(parseInt(el.get("chunkNumber"))) === -1
          );
          this.uploadedNumber =
            this.uploadedNumber + (this.chunks - needUploadList.length);
          needUploadList.forEach(formData => this.uploadFile(formData));
        }
        this.percent = Math.ceil((this.uploadedNumber / this.chunks) * 100);
        percentCb(this.percent);
      });
  };
  //上传文件
  this.uploadFile = function(formData) {
    api.uploadFileChunk(formData)
      .then(data => {
        uploadCb(data.msg);
        if (data.md5) {
          this.finishedUpload();
          md5Cb(data.md5);
          fileIdCb(data.fileId);
          suffixCb(data.suffix);
          filePathCb(data.filePath);
          this.uploadedNumber = this.chunks;
        } else {
          this.uploadedNumber = this.uploadedNumber + 1;
        }
        this.percent = Math.ceil((this.uploadedNumber / this.chunks) * 100);
        percentCb(this.percent);
      });
  };
  this.loadNext = function() {
    if (this.cancel) return;
    //文件切片
    this.start = this.currentChunk * this.chunkSize;
    this.end =
      this.start + this.chunkSize >= this.file.size
        ? this.file.size
        : this.start + this.chunkSize;
    let pieceFile = this.blobSlice.call(this.file, this.start, this.end);
    // pieceFile.name = this.file.name;
    let tmpObj = {
      file: pieceFile,
      currentSize: this.end - this.start,
      currentNum: this.currentChunk
    };
    this.tmpDataList.push(tmpObj);
    this.fileReader.readAsArrayBuffer(pieceFile);
  };
  return this;
}

export default Uploadfile;
