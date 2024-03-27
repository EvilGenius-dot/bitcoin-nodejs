// 用fs来简单实现一个数据存储和查询的地方
const fs = require('fs');
const BLOCKS_FIL_PATH = `${__dirname}/blocks.json`

class DB {
    constructor() {
        try {
            const blocks = fs.readFileSync(BLOCKS_FIL_PATH, { encoding: 'utf8' });

            if (blocks) {
                this.blocks = JSON.parse(blocks);
            } else {
                this.createRoot()
            }
        } catch (error) {
            if (error.code === 'ENOENT') {
                this.createRoot()
            } else {
                throw error;
            }
        }
    }

    createRoot() {
        const defaultData = [{
            "Timestamp": 1711570156539,
            "Data": "创世区块",
            "PrevBlockHash": "",
            "Hash": "00000acd48a86f7639b2d725e3a9caea33e1624e30b80df4119957ba87495ca9",
            "Nonce": 39808
        }];

        console.log('首次使用, 自动创建一个创世区块。');

        fs.writeFileSync(BLOCKS_FIL_PATH, JSON.stringify(defaultData), { encoding: 'utf8' });

        console.log('添加完毕。');

        this.blocks = defaultData
    }

    push(block) {
        this.blocks.push(block)

        fs.writeFileSync(BLOCKS_FIL_PATH, JSON.stringify(this.blocks), { encoding: 'utf8' });
    }

    get(hash) {
        let blocks = this.blocks;
        let res;

        if (!hash) {
            res = blocks
        } else {
            for (let i = 0; i < blocks.length; i++) {
                let block = blocks[i];
                if (block.Hash == hash) {
                    res = block
                    break
                }
            }
        }

        return res
    }
}

module.exports = DB


