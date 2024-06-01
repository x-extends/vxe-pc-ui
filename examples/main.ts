import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'

import './styles/index.scss'

// 引入组件库
import VxeUI from '../packages'
import enUS from '../packages/language/en-US'
import '../styles/all.scss'

declare global {
  interface Window {
    axios: any;
  }
}

VxeUI.setI18n('en-US', enUS)
VxeUI.setLanguage((localStorage.getItem('VXE_LANGUAGE') as 'zh-CN' | 'en-US') || 'zh-CN')

window.axios.defaults.baseURL = 'https://api.vxetable.cn/demo'

const app = createApp(App)

app.use(router)
app.use(i18n)
app.use(VxeUI)

app.mount('#app')
