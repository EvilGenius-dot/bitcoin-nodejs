// 用fs来简单实现一个数据存储和查询的地方
const fs = require('fs');
const BLOCKS_FIL_PATH = `${__dirname}/blocks.json`

class DB {
    constructor() {
        try {
            const blocks = fs.readFileSync(BLOCKS_FIL_PATH, { encoding: 'utf8' });

            this.blocks = JSON.parse(blocks);
        } catch (error) {
            if (error.code === 'ENOENT') {
                const defaultData = '[]';

                console.log('首次使用, 初始化...');

                fs.writeFileSync(BLOCKS_FIL_PATH, defaultData, { encoding: 'utf8' });

                this.blocks = JSON.parse(defaultData)
            } else {
                throw error;
            }
        }
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

    delete(key) {

    }
}

module.exports = DB


