<template>
    <el-card style="margin:20px;"  >
        <div class="box">
            <img :src="userStore.userAvatar" class="avatar">
            <div class="text">
                <h4>{{time}}{{userStore.userName}}</h4>
                <span>某商甄选运用平台</span>
            </div>
        </div>
    </el-card>
    <div class="bot">
        <svg-icon name='welcome' width='450px' height='450px'></svg-icon>
    </div>
</template>

<script lang="ts" setup>
import {getTime} from '@/utils/time'
import {useUserStore} from '@/store/modules/user' // 仓库中存储的用户信息
const userStore = useUserStore()
const time = getTime()

</script>

<style lang="scss" scoped>
.box{
    display:flex;
    align-items: center;
    .avatar{
        height:80px;
        width:80px;
        border-radius:40px;
        margin-right: 20px;
    }
    .text{
        h4{
            margin: 0 0 8px 0;
            font-size: 20px;
        }
        span{
        color: rgb(151, 152, 152);
        }
    }
}
.bot{
    text-align: center;
}
</style>