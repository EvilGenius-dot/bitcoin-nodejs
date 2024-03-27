<template>
    <el-dialog v-model="blockInfoModel" :title="`高度${blockIndex}的区块`" width="500" :before-close="blockInfoModelClose">
        <el-form label-width="auto" style="max-width: 600px">
            <el-form-item label="区块Hash">
                <el-input v-model="block.Hash" :disabled="true"/>
            </el-form-item>
            <el-form-item label="前一个区块Hash">
                <el-input v-model="block.PrevBlockHash" placeholder="此区块为创世区块,无前一个区块Hash。" :disabled="true"/>
            </el-form-item>
            <el-form-item label="时间戳（日期）">
                <el-input v-model="block.Timestamp" :disabled="true"/>
            </el-form-item>
            <el-form-item label="Nonce（随机数）">
                <el-input v-model="block.Timestamp" :disabled="true"/>
            </el-form-item>
            <el-form-item label="区块信息">
                <el-input v-model="block.Data" type="textarea" :disabled="true"/>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="verifyBlock">
                    验证区块是否合法
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import ProofofWork from '@/assets/proofofwork.js';
import { ElMessage, ElMessageBox } from 'element-plus'

const blockInfoModel = ref(false)
const block = reactive({
    Hash: '',
    Timestamp: 0,
    PrevBlockHash: '',
    Nonce: '',
    Data: ''
})
const blockIndex = ref(null)

const blockInfoModelClose = () => {
    blockInfoModel.value = false
}

const show = (b, i) => {
    blockInfoModel.value = true

    block.Hash = b.Hash
    block.Timestamp = b.Timestamp
    block.PrevBlockHash = b.PrevBlockHash;
    block.Nonce = b.Nonce
    block.Data = b.Data

    blockIndex.value = i
}

const verifyBlock = () => {
    let proofofwork = new ProofofWork(block);
    console.log(block)

    let res = proofofwork.validate();
    
    if (res) {
        ElMessageBox.alert(
            `数据一致, 未被篡改, 验证通过。`, 
            {
                confirmButtonText: 'OK',
                callback: (action) => {}
            }
        )
    } else {
        ElMessageBox.alert(
            `数据被篡改, 无法验证通过。`, 
            {
                confirmButtonText: 'OK',
                callback: (action) => {}
            }
        )
    }
}

defineExpose({ show })
</script>

<style lang="scss" scoped></style>
