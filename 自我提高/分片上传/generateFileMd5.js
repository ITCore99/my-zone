import SparkMD5 from "spark-md5";

function generateFileMd5(file, config = {}) {
  let {
    chunkSize = 102400,
    currentChunk = 0,
    start = 0,
    end = 0,
    checkCb = () => null
  } = config;

  let md5 = null,
    blobSlice =
      window.File.prototype.slice ||
      window.File.prototype.mozSlice ||
      window.File.prototype.webkitSlice,
    fileReader = new FileReader(),
    sparkArrayBuffer = new SparkMD5.ArrayBuffer(),
    chunks = Math.ceil(file.size / chunkSize);

  return new Promise(function(resolve, reject) {
    fileReader.onload = e => {
      sparkArrayBuffer.append(e.target.result);
      currentChunk++;
      if (currentChunk < chunks) {
        checkCb("正在校验文件:" + currentChunk + "/" + chunks);
        loadNext();
      } else {
        md5 = sparkArrayBuffer.end();
        console.log("计算文件MD5值结束,MD5:" + md5);
        checkCb("文件校验完毕,md5：" + md5);
        resolve(md5);
      }
    };
    fileReader.onerror = function() {
      checkCb("读取文件出错,清重试!");
      console.log("读取文件出错,清重试!");
      reject("读取文件出错");
    };
    function loadNext() {
      //文件切片
      start = currentChunk * chunkSize;
      end = start + chunkSize >= file.size ? file.size : start + chunkSize;
      let pieceFile = blobSlice.call(file, start, end);
      fileReader.readAsArrayBuffer(pieceFile);
    }
    loadNext();
  });
}
export default generateFileMd5;
