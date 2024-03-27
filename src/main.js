const Blockchain = require('./core/blockchain.js')
const ProofofWork = require('./core/proofofwork.js')
const inquirer = require('inquirer');


const blockchain = new Blockchain()

inquirer.prompt([
    {
        type: 'list',
        name: 'choice',
        message: '选择要进行的操作:',
        choices: [
            // {
            //     name: '指定钱包挖矿',
            //     value: 'target-mining'
            // },
            // {
            //     name: '查询钱包余额',
            //     value: 'target-balance'
            // },
            {
                name: '查看所有区块信息',
                value: 'preview-blocks'
            },
            {
                name: '查询指定区块信息',
                value: 'preview-target'
            },
            {
                name: '添加一个新的区块',
                value: 'add-block'
            },
            {
                name: '验证指定哈希区块',
                value: 'check-block'
            }
        ],
    },
]).then(answers => {
    switch (answers.choice) {
        case 'preview-blocks':
            
            console.log(blockchain.getBlocks())

            break;
        case 'preview-target':
            
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'data',
                    message: '请输入指定的区块哈希：',
                },
            ]).then(answers => {
                let findBlock = blockchain.findBlock(answers.data);

                if (findBlock) {
                    console.log(findBlock)
                } else {
                    console.log('未找到指定Hash区块')
                }
            });

            break;
        case 'add-block':
            
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'data',
                    message: '请输入要包含至区块内的信息：',
                },
            ]).then(answers => {
                blockchain.addBlock(answers.data)
            });

            break;
        case 'check-block':
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'data',
                    message: '请输入指定的区块哈希：',
                },
            ]).then(answers => {
                let findBlock = blockchain.findBlock(answers.data);

                if (findBlock) {
                    let validate = new ProofofWork(findBlock).validate();

                    if (validate) {
                        console.log('数据一致, 验证通过!')
                    } else {
                        console.log('数据被篡改, 无法验证通过!')
                    }
                } else {
                    console.log('未查询到指定区块, 无法验证!')
                }
            });

            break;
    }
});