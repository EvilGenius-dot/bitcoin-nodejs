const Block = require('./block.js')
const DB = require('./../db/db.js')

class Blockchain {
    constructor() {
        const db = new DB();
        this.db = db

        this.Blocks = db.get()
        this.checkRoot()
    }

    // 检查创世区块是否存在, 不存在则创建
    checkRoot() {
        if (Object.keys(this.Blocks).length === 0) {
            console.log('创世区块不存在, 请等待创世区块创建完毕继续操作。')
            console.log('开始创建创世区块...')
            // 创世区块
            const rootBlock = new Block('创世区块', '');
            
            // 添加创世区块
            this.db.push(rootBlock)

            console.log('创世区块添加完毕, 请继续操作。')
        }
    }

    getBlocks() {
        return this.Blocks
    }

    findBlock(hash) {
        return this.db.get(hash)
    }

    addBlock(data) {
        const prevBlock = this.Blocks[this.Blocks.length - 1]
        const newBlock = new Block(data, prevBlock.Hash)

        this.db.push(newBlock)
    }
}

module.exports = Blockchain