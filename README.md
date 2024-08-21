# vxe-pc-ui

简体中文 | [繁體中文](README.zh-TW.md) | [English](README.en.md)  

[![star](https://gitee.com/xuliangzhan_admin/vxe-pc-ui/badge/star.svg?theme=gvp)](https://gitee.com/xuliangzhan_admin/vxe-pc-ui/stargazers)
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

## 功能点

[👀 Vxe UI](https://vxeui.com)  

* [x] alert 警告提示
* [x] anchor 锚点
* [x] anchor-link 锚点-链接
* [x] breadcrumb 面包屑
* [x] breadcrumb-item 面包屑-项
* [x] button 按钮
* [x] button-group 按钮组
* [ ] calendar 日历
* [x] card 卡片
* [ ] carousel 走马灯
* [x] checkbox 复选框
* [x] checkbox-group 复选框-组
* [x] col 列
* [ ] collapse 展开面板
* [ ] collapse-pane 展开面板-容器
* [x] date-picker 日期选择器
* [x] drawer 抽屉
* [ ] flow-design 流程设计器
* [ ] flow-view 流程设计器-视图渲染
* [x] form 表单
* [x] form-design 表单设计器
* [x] form-gather 表单-容器
* [x] form-item 表单-项
* [x] form-view 表单设计器-视图渲染
* [x] icon 图标
* [x] icon-picker 图标选择
* [x] image 图片
* [x] image-preview 图片预览
* [x] input 输入框
* [x] layout-aside 页面布局-左侧
* [x] layout-body 页面布局-内容
* [x] layout-container 页面布局-容器
* [x] layout-footer 页面布局-页尾
* [x] layout-header 页面布局-页头
* [x] link 链接
* [x] list-design 列表设计器
* [x] list-view 列表设计器-视图渲染
* [x] list 虚拟列表
* [x] loading 加载中
* [x] menu 菜单
* [x] modal 模态窗口
* [x] number-input 数值输入框
* [x] optgroup 下拉框-分组项
* [x] option 下拉框-项
* [x] pager 分页
* [x] password-input 密码输入框
* [x] print 打印
* [x] print-page-break 分页打印
* [x] pulldown 下拉容器
* [x] radio 单选框
* [x] radio-button 单选框-按钮
* [x] radio-group 单选框-组
* [x] row 行
* [x] select 下拉框
* [x] switch 开关
* [x] tab-pane 页签-容器
* [x] tabs 页签
* [x] textarea 文本域
* [x] tip 提示
* [x] tooltip 文字提示
* [x] tree 树形组件
* [x] tree-select 树形下拉框
* [x] upload 附件上传

[👀 Vxe Table](https://vxetable.cn)  

* [x] table 表格
* [x] column 表格-列
* [x] colgroup 表格-分组列
* [x] toolbar 表格-工具栏
* [x] grid 表格-配置式

## 安装

```shell
npm install vxe-pc-ui
```

```javascript
// ...
import VxeUI from 'vxe-pc-ui'
import 'vxe-pc-ui/lib/style.css'
// ...

createApp(App).use(VxeUI).mount('#app')
```

## QQ 交流群

该群供大家交流問題，如果群人数已满，将会不定期剔除不活跃的。  

![qq](https://vxeui.com/static/donation/qq1.png)
![qq](https://vxeui.com/static/donation/qq2.png)

## 运行项目

安装依赖

```shell
npm run update
```

启动本地调试

```shell
npm run serve
```

编译打包，生成编译后的目录：es,lib

```shell
npm run lib
```

## PR

1. 如果是修复 bug，必须有示例的复现链接
2. 如果新功能，涉及代码风格、质量、还需有对应的示例页面

## Contributors

Thank you to everyone who contributed to this project.

[![vxe-pc-ui](https://contrib.rocks/image?repo=x-extends/vxe-pc-ui)](https://github.com/x-extends/vxe-pc-ui/graphs/contributors)

## License

[MIT](LICENSE) © 2019-present, Xu Liangzhan
