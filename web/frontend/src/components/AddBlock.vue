<template>
    <el-dialog v-model="addBlockDialog" :title="`添加高度为${blockIndex}的区块`" width="500"
        :before-close="addBlockDialogClose">
        <el-form label-width="auto" style="max-width: 600px">
            <el-form-item label="区块信息">
                <el-input v-model="block.Data" type="textarea" :disabled="buildLoading" placeholder="请填写要打包到区块内的信息。" />
            </el-form-item>
            <el-form-item label="时间戳">
                <el-input v-model="block.Timestamp" :disabled="true" />
            </el-form-item>
            <el-form-item label="前一个区块Hash">
                <el-input v-model="block.PrevBlockHash" :disabled="true" />
            </el-form-item>
            <el-form-item label="区块Hash">
                <el-input v-model="block.Hash" :disabled="true" />
            </el-form-item>
            <el-form-item label="Nonce（随机数）">
                <el-input v-model="block.Nonce" :disabled="true" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="buildBlock" :loading="buildLoading">
                    <span v-if="!buildLoading">打包区块至链上</span>
                    <span v-if="buildLoading">正在通过工作量证明机制进行验证...</span>
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';

import ProofofWork from '@/assets/proofofwork.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios';

const props = defineProps({
    getBlockEvent: Function
});

const addBlockDialog = ref(false);
const buildLoading = ref(false)

const block = reactive({
    Hash: '',
    Timestamp: 0,
    PrevBlockHash: '',
    Nonce: '',
    Data: ''
})
const blockIndex = ref(0)

const addBlockDialogClose = () => {
    addBlockDialog.value = false;
}

const show = (blocks) => {
    blockIndex.value = blocks.length;

    block.PrevBlockHash = blocks[blocks.length - 1].Hash
    block.Hash = ''
    block.Timestamp = ''
    block.Nonce = ''
    block.Timestamp = 0

    addBlockDialog.value = true
}

const hide = () => {
    buildLoading.value = false
    addBlockDialog.value = false
}

const appendBlock = async () => {
    return new Promise(resolve => {
        axios.post('/api/appendblock', block)
        .then(response => {
            resolve(response)
        })
        .catch(error => {
            console.error('发生错误:', error);
        });
    })
}

const buildBlock = async () => {
    buildLoading.value = true
    block.Timestamp = Date.now();

    let proof = new ProofofWork(block)
    let build = await proof.run();
    
    block.Hash = build.hash
    block.Nonce = build.nonce

    let postBlock = await appendBlock()

    if (postBlock.data.Hash) {
        props.getBlockEvent()

        ElMessageBox.alert(
            `数据已打包至区块高度为${blockIndex.value}的区块, 区块Hash：${postBlock.data.Hash}`, 
            '区块打包完毕!', 
            {
                confirmButtonText: 'OK',
                callback: (action) => {
                    hide()
                }
            }
        )
    }
}

defineExpose({ show })
</script>

<style lang="scss" scoped></style>
