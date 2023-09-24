import { ref } from 'vue'
// 获取当前时间 (消息提示框)
export const getTime = () => {
    const message = ref('')
    const hours = new Date().getHours()
    if( hours<=10 ) {
        message.value = '早上好'
    } else if (hours>10 && hours<=13) {
        message.value = '中午好'
    }else if (hours>13 && hours<=18) {
        message.value = '下午好'
    }else if (hours>18 && hours<=23) {
        message.value = '晚上好'
    }
    return message.value
}
