const Blockchain = require('./core/blockchain.js')
const ProofofWork = require('./core/proofofwork.js')

const blockchain = new Blockchain()

// 添加一个区块
blockchain.addBlock('send 1btc to hyx')

// console.log(blockchain)
// 验证一个区块
const pow = new ProofofWork(blockchain.Blocks[1]).validate();
console.log(pow)