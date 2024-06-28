import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'

import './styles/index.scss'

// 引入组件库
import VxeUI from '../packages'
import enUS from '../packages/language/en-US'
import '../styles/all.scss'

// import VxeUITable from 'vxe-table'
// import 'vxe-table/lib/style.css'

declare global {
  interface Window {
    axios: any;
  }
}

VxeUI.setConfig({
  permissionMethod ({ code }) {
    if (code === 'xx') {
      return {
        visible: true,
        disabled: true
      }
    }
    return {
      visible: false,
      disabled: true
    }
  }
})

VxeUI.setI18n('en-US', enUS)
VxeUI.setLanguage((localStorage.getItem('VXE_LANGUAGE') as 'zh-CN' | 'en-US') || 'zh-CN')

window.axios.defaults.baseURL = 'https://api.vxetable.cn/demo'

const app = createApp(App)

app.use(router)
app.use(i18n)
app.use(VxeUI)
// app.use(VxeUITable)

app.mount('#app')
