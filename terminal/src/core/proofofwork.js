const crypto = require('crypto');

// 工作量证明
class ProofofWork {
    constructor(block) {
        const target = 1n
        const targetBits = 20

        this.targetBits = targetBits
        this.block = block
        this.target = target << BigInt(256 - targetBits)
    }

    prepareData(nonce) {
        let res = `
            ${this.block.PrevBlockHash},
            ${this.block.Data},
            ${this.block.Timestamp.toString(16)},
            ${this.targetBits.toString(16)},
            ${nonce.toString(16)}
        `

        return res
    }

    run() {
        const maxNonce = BigInt("0x7FFFFFFFFFFFFFFF");
        let nonce = 0;
        let hash;

        console.log(`\n通过挖矿添加一个新的区块 [${this.block.Data}]`)

        for (let i = 0; i < maxNonce; i++) {
            let data = this.prepareData(nonce);

            hash = crypto.createHash('sha256').update(data).digest('hex')

            let hashInt = BigInt(`0x${hash}`)

            if (hashInt < this.target) {
                process.stdout.write('\rHash: ' + hash + '\n');
                break
            } else {
                process.stdout.write('\rHash: ' + hash);
                nonce++
            }
        }

        return {
            nonce,
            hash
        }
    }

    // 验证某个区块
    validate() {
        let hash;
        let hashInt;
        let data = this.prepareData(this.block.Nonce);
        let res = false;
        
        hash = crypto.createHash('sha256').update(data).digest('hex');
        hashInt = BigInt(`0x${hash}`)

        if (hashInt < this.target) {
            res = true
        }

        return res
    }
}

module.exports = ProofofWork