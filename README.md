# vxe-pc-ui

[![github star](https://img.shields.io/github/stars/x-extends/vxe-pc-ui.svg)](https://github.com/x-extends/vxe-pc-ui/stargazers)
[![npm version](https://img.shields.io/npm/v/vxe-pc-ui.svg?style=flat-square)](https://www.npmjs.com/package/vxe-pc-ui)
[![NodeJS with Webpack](https://github.com/x-extends/vxe-pc-ui/actions/workflows/webpack.yml/badge.svg)](https://github.com/x-extends/vxe-pc-ui/actions/workflows/webpack.yml)
[![npm downloads](https://img.shields.io/npm/dt/vxe-pc-ui.svg?style=flat-square)](https://npm-stat.com/charts.html?package=vxe-pc-ui)
[![issues](https://img.shields.io/github/issues/x-extends/vxe-pc-ui.svg)](https://github.com/x-extends/vxe-pc-ui/issues)
[![issues closed](https://img.shields.io/github/issues-closed/x-extends/vxe-pc-ui.svg)](https://github.com/x-extends/vxe-pc-ui/issues?q=is%3Aissue+is%3Aclosed)
[![pull requests](https://img.shields.io/github/issues-pr/x-extends/vxe-pc-ui.svg)](https://github.com/x-extends/vxe-pc-ui/pulls)
[![pull requests closed](https://img.shields.io/github/issues-pr-closed/x-extends/vxe-pc-ui.svg)](https://github.com/x-extends/vxe-pc-ui/pulls?q=is%3Apr+is%3Aclosed)
[![npm license](https://img.shields.io/github/license/mashape/apistatus.svg)](LICENSE)

一个基于 [vue](https://www.npmjs.com/package/vue) 的 PC 端组件库  

## 浏览器支持

![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png)
--- | --- | --- | --- | --- |
80+ ✔ | 80+ ✔ | 90+ ✔ | 75+ ✔ | 10+ ✔ |

## 安装

```shell
npm install vxe-pc-ui@3
# npm install vxe-pc-ui@3 vxe-table@3 vxe-design@3
```

```javascript
import Vue from 'vue'
// ...
import VxeUIBase from 'vxe-pc-ui'
import 'vxe-pc-ui/lib/style.css'

// import VxeUITable from 'vxe-table'
// import 'vxe-table/lib/style.css'

// import VxeUIDesign from 'vxe-design'
// import 'vxe-design/lib/style.css'
// ...

Vue.use(VxeUIBase)
// Vue.use(VxeUITable)
// Vue.use(VxeUIDesign)
```

### CDN

使用第三方 CDN 方式记得锁定版本号，避免受到非兼容性更新的影响  
***不建议将第三方的 CDN 地址用于正式环境，因为该连接随时都可能会失效***  

```HTML
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <!-- style -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vxe-pc-ui@3/lib/style.css">
  <!-- <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vxe-table@3/lib/style.css"> -->
  <!-- <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vxe-design@3/lib/style.css"> -->
  <!-- vue -->
  <script src="https://cdn.jsdelivr.net/npm/vue@2.6.14"></script>
  <!-- vxe -->
  <script src="https://cdn.jsdelivr.net/npm/xe-utils"></script>
  <script src="https://cdn.jsdelivr.net/npm/vxe-pc-ui@3"></script>
  <!-- <script src="https://cdn.jsdelivr.net/npm/vxe-table@3"></script> -->
  <!-- <script src="https://cdn.jsdelivr.net/npm/vxe-design@3"></script> -->
</head>
<body>
  <div id="app">
    <div>
      <vxe-form
        :data="formData"
        @submit="submitEvent">
        <vxe-form-item title="名称" field="name" span="12" :item-render="{}">
          <template #default="params">
            <vxe-input v-model="formData.name"></vxe-input>
          </template>
        </vxe-form-item>
        <vxe-form-item title="角色" field="role" span="12" :item-render="{}">
          <template #default="params">
            <vxe-input v-model="formData.role"></vxe-input>
          </template>
        </vxe-form-item>
        <vxe-form-item title="年龄" field="age" span="12" :item-render="{}">
          <template #default="params">
            <vxe-input v-model="formData.age"></vxe-input>
          </template>
        </vxe-form-item>
        <vxe-form-item align="center" span="24" :item-render="{}">
          <template #default>
            <vxe-button type="submit" status="primary">提交</vxe-button>
            <vxe-button type="reset">重置</vxe-button>
          </template>
        </vxe-form-item>
      </vxe-form>
    </div>
  </div>
  <script>
    (function () {
      var App = {
        data() {
          return {
            formData: {
              name: '',
              nickname: '',
              sex: '',
              role: ''
            }
          }
        },
        methods: {
          submitEvent () {
            VxeUI.modal.message({ content: '保存成功', status: 'success' })
          }
        }
      }
      Vue.createApp(App).use(VxeUI).use(VXETable).mount('#app')
    })()
  </script>
</body>
</html>
```

## Contributors

Thank you to everyone who contributed to this project.

[![vxe-pc-ui](https://contrib.rocks/image?repo=x-extends/vxe-pc-ui)](https://github.com/x-extends/vxe-pc-ui/graphs/contributors)

## License

[MIT](LICENSE) © 2019-present, Xu Liangzhan
