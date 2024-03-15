const crypto = require('crypto');
const ProofofWork = require('./proofofwork')

class Block {
    constructor(data, prevBlockHash) {
        this.Timestamp = Date.now()
        this.Data = data
        this.PrevBlockHash = prevBlockHash

        const pow = new ProofofWork(this).run()

        this.Hash = pow.hash;
        this.Nonce = pow.nonce;
    }

    // 创建自身的哈希, 暂时用不到
    setHash() {
        const timestamp = this.Timestamp.toString(10)
        const headers = `${this.PrevBlockHash}, ${this.Data}, ${timestamp}`
        const hash = crypto.createHash('sha256').update(headers).digest('hex');

        return hash
    }
}


module.exports = Block