const Block = require('./block.js')

class Blockchain {
    constructor() {
        // 创世区块
        const rootBlock = new Block('RustMinerSystem', '');
        this.Blocks = []

        // 添加创世区块
        this.Blocks.push(rootBlock)
    }

    addBlock(data) {
        const prevBlock = this.Blocks[this.Blocks.length - 1]
        const newBlock = new Block(data, prevBlock.Hash)

        this.Blocks.push(newBlock)
    }
}

module.exports = Blockchain