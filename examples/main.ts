import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'

import './styles/index.scss'

// 引入组件库
import VxeUI from '../packages'
import '../styles/all.scss'

const app = createApp(App)

app.use(router)
app.use(i18n)
app.use(VxeUI)

app.mount('#app')
