const express = require('express');
const app = express();
const DB = require('./db/db.js')

const db = new DB();

app.use(express.json());

// 获取区块信息接口
app.get('/api/getblocks', (req, res) => {
    res.json(db.get());
});

// 添加新的区块到db中
app.post('/api/appendblock', (req, res) => {
    db.push(req.body)

    res.json(req.body); // 将接收到的请求体数据返回给客户端
});

app.use(express.static('public'));


const port = 916;
app.listen(port, () => {
    console.log(`访问地址：http://127.0.0.1:${port}`);
});