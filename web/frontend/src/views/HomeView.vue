<template>
    <div class="border border-slate-300 rounded-lg divide-y divide-slate-300">
        <div class="p-3 bg-slate-100 text-base flex justify-between">
            <div class="flex items-center">
                <div class="mr-3">
                    区块链技术底层模拟
                </div>
                <div class="text-xs text-slate-600 mr-3">
                    当前区块高度: 0
                </div>
                <div class="text-xs text-slate-600">
                    当前工作量证明机制难度: 0
                </div>
            </div>
            <div>
                <el-button-group>
                    <el-button type="primary" @click="addBlock">添加新区块</el-button>
                </el-button-group>
            </div>
        </div>
        <div class="flex flex-wrap justify-start content-start min-h-96" v-loading="getListLoading">
            <div @click="showBlockDialog(item, index)" v-for="(item, index) in blocks" :key="index" class="block w-[180px] h-[100px] outline outline-offset-0 outline-1 outline-lime-400 px-3 py-2 flex flex-col justify-between cursor-pointer hover:bg-lime-200">
                <div class="text-sm text-slate-600">
                    区块高度: {{ index }}
                </div>
                <div class="text-sm text-slate-600 overflow-hidden text-ellipsis">
                    区块Hash:<span class="text-blue-400">{{item.Hash}}</span>
                </div>
            </div>
        </div>
    </div>
    <BlockDialog ref="blockDialog"/>
    <AddBlockDialog :getBlockEvent="getBlockList" ref="addBlockDialog"/>
</template>

<script setup>
    import BlockDialog from '@/components/BlockDialog.vue'
    import AddBlockDialog from '@/components/AddBlock.vue'
    import { ref, computed, reactive, onMounted } from 'vue';
    import axios from 'axios';

    let blocks = reactive([
        {
            Timestamp: '123',
            Data: 'aaaa',
            PrevBlockHash: '',
            Hash: 'abcdabcdabcdabcdabcdabcdabcdabcdabcd',
            Nonce: 'ssssss'
        }
    ])

    const blockDialog = ref(null)
    const addBlockDialog = ref(null)
    const getListLoading = ref(false)

    const showBlockDialog = (item, index) => {
        blockDialog.value.show(item, index)
    }

    const addBlock = () => {
        addBlockDialog.value.show(blocks)
    }

    const getBlockList = () => {
        return new Promise(resolve => {
            getListLoading.value = true

            axios({
                url: '/api/getblocks',
                method: 'get',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                getListLoading.value = false;

                blocks.splice(0, blocks.length, ...res.data);
            })
        })
    }

    onMounted(async () => {
        let request = await getBlockList()

        if (request.status == '200') {
            blocks = request.data
            console.log(request.data)
        } else {
            alert('获取数据失败。')
        }
    })

</script>

<style scoped>
.block{
    transition: all .3s;
    position: relative;
}

.block:first-of-type::after {
    display: none;
}

.block::before {
    content: " ";
    display: block;
    position: absolute;
    width: 15px;
    height: 2px;
    right: -1px;
    top: calc(50% - 1px);
    @apply bg-lime-400
}

.block::after {
    content: " ";
    display: block;
    position: absolute;
    width: 15px;
    height: 2px;
    left: -1px;
    top: calc(50% - 1px);
    @apply bg-lime-400
}
</style>