import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Message from './utils/message'

const app = createApp(App)
app.use(router)

// 添加全局属性 $message
app.config.globalProperties.$message = Message

app.mount('#app') 