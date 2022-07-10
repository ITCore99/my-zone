const express = require('express');
const server = express();
server.use(express.static('build', {maxAge: 3600*1000}));
server.listen(3000, function () {
  console.log('服务器启动了');
});
