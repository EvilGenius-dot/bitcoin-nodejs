import CryptoJS from 'crypto-js'

// 工作量证明
export default class ProofofWork {
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
        return new Promise(resolve => {
            const maxNonce = BigInt("0x7FFFFFFFFFFFFFFF");
            let nonce = 0;
            let hash;

            const doWorkSlice = () => {
                let startTime = performance.now();

                // 运行一个小的工作片段
                while (nonce < maxNonce) {
                    let data = this.prepareData(nonce);
                    hash = CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);

                    this.block.Hash = hash;
                    this.block.Nonce = nonce;

                    let hashInt = BigInt(`0x${hash}`);

                    if (hashInt < this.target) {
                        resolve({ nonce, hash }); // 找到了合适的nonce
                        return;
                    } else {
                        nonce++;

                        // 检查是否超过了单个帧的预算时间（约16.7毫秒为60FPS）
                        if (performance.now() - startTime > 16.7) {
                            requestAnimationFrame(doWorkSlice); // 让出控制权给浏览器，继续下一个工作片段
                            return;
                        }
                    }
                }

                // 完成所有工作后，如果没有找到合适的nonce
                resolve({ nonce: -1, hash: null });
            };

            requestAnimationFrame(doWorkSlice); // 开始执行工作
        })
    }

    // 验证某个区块
    validate() {
        let hash;
        let hashInt;
        let data = this.prepareData(this.block.Nonce);
        let res = false;

        hash = CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
        hashInt = BigInt(`0x${hash}`)

        if (hashInt < this.target) {
            res = true
        }

        return res
    }
}