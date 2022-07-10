function UploadFile(config) {
    let  {
        //文件对象
        file,
        //开始回调
        startCb,
        //选中回调
        checkCb,
        //上传回调
        uploadCb,
        //上传完成回调
        finishedCb,
        //上传百分比回调
        percentCb,
        //用来终止请求回调
        source
    } = config;
    //开始分片 用于断点续传
    this.start = 0;
    //结束上传分片
    this.end = 0;
    //文件对象
    this.file = file;
    //当前分片
    this.currentChunk = 0;
    //分片大小
    this.chunkSize = 1024000;
    //总的片数
    this.chunks = 0;
    //成功上传片数
    this.percent = 0;
    //是否暂停
    this.pauseStatus = true;
    //分片api
    this.blobSlice = window.File.prototype.slice ||
    window.File.prototype.webkitSlice || window.File.prototype.mozSlice;
    //fileReader对象
    this.fileReader = new FileReader();
    //保存所有分片md5
    this.sparkArrayBuffer = new SparkMD5.ArrayBuffer();
    //保存所有分片
    this.tmpDataList = [];
    //保存所有分片生成的formData对象
    this.formDataList = [];
    //是否取消
    this.cancel = false;
    //已上传的数量
    this.uploadedNumber = 0;

    //文件开始上传
    this.startUpload= function() {
        this.computedSliceMd5();
        startCb(this);
    };
    //暂停上传 待研究
    this.pauseUpload = function() {
        this.cancel = true;
        return this;
    };
    //取消上传待研究而
    this.cancelUpload = function() {
        this.cancel = true;
        source.cancel("用户取消了上传!");
        this.reset();
        return this;
    };
    //文件上传完毕
    this.finishedUpload = function() {
        finishedCb(this);
    };
    //计算分片md5
    this.computedSliceMd5 = function() {
        checkCb("正在校验文件...");
        //分片总数
        this.chunks = Math.ceil(this.file.size / this.chunkSize);
        //这是第一片文件加载完毕执行
        this.fileReader.onload = e => {
                //生成每一篇文件的md5
                this.sparkArrayBuffer.append(e.target.result);
                //当前文件片数
                this.currentChunk ++;
                if(this.currentChunk < this.chunks) {   //文件为分完片
                    checkCb("正在校验文件:" + this.currentChunk + "/" + this.chunks);  
                //开始分取下一片文件
                this.loadNext(); 
            }else { //文件已经全部的分片完成
                //保存整体文件的md5
                this.md5 = this.sparkArrayBuffer.end();
                //遍历所有分片生成formData
                this.tmpDataList.forEach(item => {
                    let formData = new FormData();
                    formData.append("fileName",this.file.name);
                    formData.append("totalSize",this.file.size);
                    formData.append("chunkSize",this.chunkSize);
                    formData.append("wholeFileMd5",this.md5);
                    formData.append("totalChunks", this.chunks);
                    formData.append("file",item.file);
                    formData.append("currentChunkSize",item.currentSize);
                    //文件数量从1开始
                    formData.append("chunkNumber",item.currentNum + 1);
                    this.formDataList.push(formData);
                });
                checkCb("文件校验完毕");
                //开始文件的MD5校验
                this.checkMd5();
            };
        };
        this.fileReader.onerror = function() {
            checkCb("读取文件出错,请重试！")
        };
        //特别需要注意这里 这里虽然写在后面 但是它是同步代码会优先执行分取第一片文件 一定注意同步和异步问题
        this.loadNext()
    }
    //获取文件的分片
    this.loadNext = function() {
        //获取分片开始下标
        this.start = this.currentChunk * this.chunkSize;
        //获取分片结束下标
        this.end = this.start + this.chunkSize > this.file.size  ?
        this.file.size : this.start + this.chunkSize;
        //进行文件分片
        var pieceFile = this.blobSlice.call(this.file,this.start,this.end);
        //生成临时文件对象
        let tmpPieceFile = {
            file: pieceFile,
            currentSize: this.end - this.start,
            currentNum: this.currentChunk
        }
        //保存所有分片数组
        this.tmpDataList.push(tmpPieceFile);
        //设置文件的读取类型
        this.fileReader.readAsArrayBuffer(pieceFile);

    }
    //文件校验
    this.checkMd5 = function() {
        //开始创建一个完整文件的FormData进行文件的校验
        let formData = new FormData();
        formData.append("md5",this.md5);
        formData.append("fileName",this.file.name);
        formData.append("totalSize",this.file.size);
        formData.append("totalChunk",this.chunks);
        formData.append("chunkSize",this.chunks);
        //发送网络请求
        api.checkUploadFile(formData).then(res => {
            if(res.data.finished) { //表示文件之前上传过进行秒传
                this.uploadedNumber = this.chunks;
                checkCb("文件已经上传完毕");
                this.finishedUpload();
                this.percent = 100;
                percentCb(this.percent);
            }else { //文件未上传
                //进行断点续传 过滤出那些未传分片
                let needUploadList = this.formDataList.filter(el => res.data.chunks.indexOf(parseInt(el.chunkNumber))=== -1);
                //获取已经上传的分片数量
                this.uploadedNumber =  this.uploadedNumber+ (this.chunks -(needUploadList.length));
                //遍历需要上传的文件进行上传
                needUploadList.forEach(formData => {
                    this.uploadFile(formData);
                });
                //计算上传的百分比
                this.percent = Math.ceil((this.uploadedNumber /this.chunks)* 100);
                percentCb(this.percent);
            }
        })
        
    },
    //上传文件
    this.uploadFile = function(formData) {
        //进行上传
        api.uploadChunk(formData).then(res => {
            //更新上传信息
            uploadCb(res.msg);
            this.uploadedNumber = this.uploadedNumber + 1;
            this.percent = Math.ceil((this.uploadedNumber / this.chunks)*100);
            //更新百分比
            percentCb(this.percent);
        })

    }
    return this;
}