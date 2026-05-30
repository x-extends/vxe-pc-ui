# vxe-pc-ui

简体中文 | [繁體中文](README.zh-TW.md) | [English](README.en.md) | [日本語](README.ja-JP.md)  

[![github star](https://img.shields.io/github/stars/x-extends/vxe-pc-ui.svg)](https://github.com/x-extends/vxe-pc-ui/stargazers)
[![gitee star](https://gitee.com/x-extends/vxe-pc-ui/badge/star.svg)](https://gitee.com/x-extends/vxe-pc-ui/stargazers)
[![gitcode star](https://gitcode.com/x-extends/vxe-pc-ui/star/badge.svg)](https://gitcode.com/x-extends/vxe-pc-ui/stargazers)
[![npm version](https://img.shields.io/npm/v/vxe-pc-ui.svg?style=flat-square)](https://www.npmjs.com/package/vxe-pc-ui)
[![NodeJS with Webpack](https://github.com/x-extends/vxe-pc-ui/actions/workflows/webpack.yml/badge.svg)](https://github.com/x-extends/vxe-pc-ui/actions/workflows/webpack.yml)
[![gzip size: JS](http://img.badgesize.io/https://unpkg.com/vxe-pc-ui/lib/index.umd.min.js?compression=gzip&label=gzip%20size:%20JS)](https://unpkg.com/vxe-pc-ui/lib/index.umd.min.js)
[![npm downloads](https://img.shields.io/npm/dt/vxe-pc-ui.svg?style=flat-square)](https://npm-stat.com/charts.html?package=vxe-pc-ui)
[![issues](https://img.shields.io/github/issues/x-extends/vxe-pc-ui.svg)](https://github.com/x-extends/vxe-pc-ui/issues)
[![issues closed](https://img.shields.io/github/issues-closed/x-extends/vxe-pc-ui.svg)](https://github.com/x-extends/vxe-pc-ui/issues?q=is%3Aissue+is%3Aclosed)
[![pull requests](https://img.shields.io/github/issues-pr/x-extends/vxe-pc-ui.svg)](https://github.com/x-extends/vxe-pc-ui/pulls)
[![pull requests closed](https://img.shields.io/github/issues-pr-closed/x-extends/vxe-pc-ui.svg)](https://github.com/x-extends/vxe-pc-ui/pulls?q=is%3Apr+is%3Aclosed)
[![npm license](https://img.shields.io/github/license/mashape/apistatus.svg)](LICENSE)

一个基于 [vue](https://www.npmjs.com/package/vue) 的 PC 端组件库  

* 设计理念
  * 面向现代浏览器，高效的简洁 API 设计
  * 按需加载

* 版本说明
  * **V4**
    * [x] v4.7 基于 xe-utils@4.0+，拆分 [vxe-design](https://github.com/x-extends/vxe-design) 可视化组件和基础组件库
    * [x] v4.0 基于 vue3.2~2.7，只支持现代浏览器，不支持 IE
  * **V3**
    * [x] v3.7 基于 xe-utils@4.0+，拆分 [vxe-design](https://github.com/x-extends/vxe-design) 可视化组件和基础组件库
    * [x] v3.0 基于 vue2.6~2.7，只支持现代浏览器，不支持 IE
  * **V2**
    * [x] ~~v2.0 基于 vue2.6~2.7，停止维护~~
  * **V1**
    * [x] ~~v1.0 基于 vue2.6~2.7，停止维护~~
* 版本计划
  * [ ] 计划功能：虚拟列表，支持百万级数据渲染
  * [ ] 计划功能：虚拟表单，支持万级表单项渲染
  * [ ] 计划功能：全功能表单可视化设计器
  * [ ] 计划功能：全功能列表可视化设计器
  * [ ] 计划功能：全功能流程图可视化设计器
  * [ ] 计划功能：虚拟列表，支持千万级数据渲染
  * [ ] 计划功能：虚拟表单，支持百万级表单项渲染

## 浏览器支持

![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png)
--- | --- | --- | --- | --- |
80+ ✔ | 80+ ✔ | 90+ ✔ | 75+ ✔ | 10+ ✔ |

## 在线文档

👉 [基础库](https://vxeui.com)  
👉 [表格库](https://vxetable.cn)  
👉 [甘特图](https://gantt.vxeui.com)  
👉 [可视化](https://design.vxeui.com)  

## QQ 交流群

该群供大家交流問題，如果群人数已满，将会不定期剔除不活跃的。  

![qq](https://vxeui.com/resource/donation/qq1.png)
![qq](https://vxeui.com/resource/donation/qq2.png)

## 功能点

[👀 Vxe UI](https://vxeui.com)  

* [x] alert 警告提示
* [x] anchor 锚点
  * [x] anchor-link 锚点-链接
* [x] avatar 头像
* [ ] backtop 回到顶部
* [x] badge 徽标
* [x] breadcrumb 面包屑
  * [x] breadcrumb-item 面包屑-项
* [x] button 按钮
* [x] button-group 按钮组
* [x] calendar 日历
* [x] card 卡片
* [x] carousel 走马灯
  * [x] carousel-item 走马灯 - 项
* [ ] cascader 级联选择器
* [x] checkbox 复选框
  * [x] checkbox-button 复选框-按钮
  * [x] checkbox-group 复选框-组
* [x] col 列
* [x] collapse 展开面板
  * [x] collapse-pane 展开面板-容器
* [x] color-picker 颜色选择器
* [x] countdown 倒计时
* [x] date-picker 日期选择器
* [x] date-range-picker 日期范围选择器
* [x] drawer 抽屉
* [x] empty 空数据
* [x] form 表单
  * [x] form-group 表单-分组
  * [x] form-item 表单-项
* [x] icon 图标
* [x] icon-picker 图标选择
* [x] image 图片
  * [x] image-group 图片组
  * [x] image-preview 图片预览
* [x] input 输入框
* [x] layout-container 页面布局-容器
  * [x] layout-aside 页面布局-左侧
  * [x] layout-body 页面布局-内容
  * [x] layout-footer 页面布局-页尾
  * [x] layout-header 页面布局-页头
* [x] link 链接
* [x] list 虚拟列表
* [x] loading 加载中
* [ ] mention 提及
* [x] menu 菜单
* [x] modal 模态窗口
* [x] number-input 数值输入框
* [x] pager 分页
* [x] password-input 密码输入框
* [x] print 打印
* [x] print-page-break 分页打印
* [x] pulldown 下拉容器
* [x] radio 单选框
  * [x] radio-button 单选框-按钮
  * [x] radio-group 单选框-组
* [x] rate 评分
* [x] result 结果
* [x] row 行
* [ ] segmented 分段控制器
* [x] select 下拉框
  * [x] optgroup 下拉框-分组项
  * [x] option 下拉框-项
* [x] spilt 分割面板
  * [x] spilt-pane 分割面板-面板
* [x] slider 滑块
* [ ] steps 步骤条
* [x] switch 开关
  * [x] tab-pane 页签-容器
* [x] tabs 页签
* [x] text-ellipsis 多行文本溢出
* [x] table-select 表格下拉框
* [x] textarea 文本域
* [ ] timeline 时间线
  * [ ] timeline-item 时间线-项
* [x] tip 提示
* [x] tooltip 文字提示
* [x] tree 树形组件
* [x] tree-select 树形下拉框
* [x] upload 附件上传
* [x] watermark 水印

[👀 Vxe Table](https://vxetable.cn)  

* [x] grid 全功能表格-配置式
* [x] table 基础表格-标签式
  * [x] column 基础表格-标签式-常规列
  * [x] colgroup 基础表格-标签式-分组列
  * [x] toolbar 基础表格-标签式-工具栏

[👀 Vxe Gantt](https://gantt.vxeui.com/)  

* [x] gantt 甘特图

[👀 Vxe Design](https://design.vxeui.com)  

* [ ] flow-design 工作流设计器
  * [ ] flow-view 工作流设计器-视图渲染
* [x] form-design 表单设计器
  * [x] form-view 表单设计器-视图渲染
* [x] list-design 列表设计器
  * [x] list-view 列表设计器-视图渲染

## 安装

```shell
npm install vxe-pc-ui
# npm install vxe-pc-ui vxe-table vxe-design
```

```javascript
// ...
import VxeUIBase from 'vxe-pc-ui'
import 'vxe-pc-ui/lib/style.css'

// import VxeUITable from 'vxe-table'
// import 'vxe-table/lib/style.css'

// import VxeUIDesign from 'vxe-design'
// import 'vxe-design/lib/style.css'
// ...

createApp(App)
  .use(VxeUIBase)
  // .use(VxeUITable)
  // .use(VxeUIDesign)
  .mount('#app')
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
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vxe-pc-ui@4/lib/style.css">
  <!-- <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vxe-table@4/lib/style.css"> -->
  <!-- <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vxe-design@4/lib/style.css"> -->
  <!-- vue -->
  <script src="https://cdn.jsdelivr.net/npm/vue@3"></script>
  <!-- vxe -->
  <script src="https://cdn.jsdelivr.net/npm/xe-utils"></script>
  <script src="https://cdn.jsdelivr.net/npm/vxe-pc-ui@4"></script>
  <!-- <script src="https://cdn.jsdelivr.net/npm/vxe-table@4"></script> -->
  <!-- <script src="https://cdn.jsdelivr.net/npm/vxe-design@4"></script> -->
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
      Vue.createApp(App).use(VxeUIBase).use(VxeUITable).mount('#app')
    })()
  </script>
</body>
</html>
```

## 示例

```html
<template>
  <div>
    <vxe-form :data="formData" @submit="submitEvent">
      <vxe-form-item title="名称" field="name" span="12" :item-render="{}">
        <template #default>
          <vxe-input v-model="formData.name"></vxe-input>
        </template>
      </vxe-form-item>
      <vxe-form-item title="角色" field="role" span="12" :item-render="{}">
        <template #default>
          <vxe-input v-model="formData.role"></vxe-input>
        </template>
      </vxe-form-item>
      <vxe-form-item title="年龄" field="age" span="12" :item-render="{}">
        <template #default>
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
</template>

<script>
export default {
  data() {
    const formData: {
      name: '',
      nickname: '',
      sex: '',
      role: '',
      age: ''
    }
    return {
      formData
    }
  },
  methods: {
    submitEvent () {
      console.log('保存成功')
    }
  }
}
</script>
```

## 运行项目

安装依赖

```shell
npm run update
```

启动本地调试

```shell
npm run serve
```

将 zh-CN 语言的改动点同步到其他语言文件中

```shell
npm run sync:i18n
```

编译打包，生成编译后的目录：es,lib

```shell
npm run lib
```

## 贡献源码步骤

1. 如果是修复 bug，必须有示例的复现链接
2. 如果新功能，涉及代码风格、质量、还需有对应的示例页面

## 贡献者

Thank you to everyone who contributed to this project.

[![vxe-pc-ui](https://contrib.rocks/image?repo=x-extends/vxe-pc-ui)](https://github.com/x-extends/vxe-pc-ui/graphs/contributors)

## 许可证

[MIT](LICENSE) © 2019-present, Xu Liangzhan
