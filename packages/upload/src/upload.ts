import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { VxeUI, getConfig, getI18n, getIcon, globalMixins, createEvent, globalEvents, renderEmptyElement } from '../../ui'
import { getSlotVNs } from '../..//ui/src/vn'
import { errLog } from '../../ui/src/log'
import { getEventTargetNode, toCssUnit } from '../../ui/src/dom'
import { readLocalFile } from './util'
import VxeButtonComponent from '../../button/src/button'

import type { VxeUploadDefines, VxeUploadPropTypes, UploadReactData, UploadInternalData, VxeUploadEmits, VxeComponentSizeType, VxeFormDefines, VxeFormConstructor, VxeFormPrivateMethods, ValueOf } from '../../../types'

function getUniqueKey () {
  return XEUtils.uniqueId()
}

function handleTransferFiles (items: DataTransferItemList) {
  const files: File[] = []
  XEUtils.arrayEach(items, item => {
    const file = item.getAsFile()
    if (file) {
      files.push(file)
    }
  })
  return files
}

export default defineVxeComponent({
  name: 'VxeUpload',
  model: {
    prop: 'value',
    event: 'modelValue'
  },
  mixins: [
    globalMixins.sizeMixin
  ],
  props: {
    value: [Array, String, Object] as PropType<VxeUploadPropTypes.ModelValue>,
    showList: {
      type: Boolean as PropType<VxeUploadPropTypes.ShowList>,
      default: () => getConfig().upload.showList
    },
    moreConfig: Object as PropType<VxeUploadPropTypes.MoreConfig>,
    readonly: {
      type: Boolean as PropType<VxeUploadPropTypes.Readonly>,
      default: null
    },
    disabled: {
      type: Boolean as PropType<VxeUploadPropTypes.Disabled>,
      default: null
    },
    mode: {
      type: String as PropType<VxeUploadPropTypes.Mode>,
      default: () => getConfig().upload.mode
    },
    imageTypes: {
      type: Array as PropType<VxeUploadPropTypes.ImageTypes>,
      default: () => XEUtils.clone(getConfig().upload.imageTypes, true)
    },
    imageStyle: {
      type: Object as PropType<VxeUploadPropTypes.ImageStyle>,
      default: () => XEUtils.clone(getConfig().upload.imageStyle, true)
    },
    fileTypes: {
      type: Array as PropType<VxeUploadPropTypes.FileTypes>,
      default: () => XEUtils.clone(getConfig().upload.fileTypes, true)
    },
    dragToUpload: {
      type: Boolean as PropType<VxeUploadPropTypes.DragToUpload>,
      default: () => XEUtils.clone(getConfig().upload.dragToUpload, true)
    },
    pasteToUpload: {
      type: Boolean as PropType<VxeUploadPropTypes.PasteToUpload>,
      default: () => XEUtils.clone(getConfig().upload.pasteToUpload, true)
    },
    keyField: String as PropType<VxeUploadPropTypes.KeyField>,
    singleMode: Boolean as PropType<VxeUploadPropTypes.SingleMode>,
    urlMode: Boolean as PropType<VxeUploadPropTypes.UrlMode>,
    multiple: Boolean as PropType<VxeUploadPropTypes.Multiple>,
    limitSize: {
      type: [String, Number] as PropType<VxeUploadPropTypes.LimitSize>,
      default: () => getConfig().upload.limitSize
    },
    limitCount: {
      type: [String, Number] as PropType<VxeUploadPropTypes.LimitCount>,
      default: () => getConfig().upload.limitCount
    },
    nameField: {
      type: String as PropType<VxeUploadPropTypes.NameField>,
      default: () => getConfig().upload.nameField
    },
    typeField: {
      type: String as PropType<VxeUploadPropTypes.TypeField>,
      default: () => getConfig().upload.typeField
    },
    urlField: {
      type: String as PropType<VxeUploadPropTypes.UrlField>,
      default: () => getConfig().upload.urlField
    },
    sizeField: {
      type: String as PropType<VxeUploadPropTypes.SizeField>,
      default: () => getConfig().upload.sizeField
    },
    showErrorStatus: {
      type: Boolean as PropType<VxeUploadPropTypes.ShowErrorStatus>,
      default: () => getConfig().upload.showErrorStatus
    },
    showProgress: {
      type: Boolean as PropType<VxeUploadPropTypes.ShowProgress>,
      default: () => getConfig().upload.showProgress
    },
    progressText: {
      type: String as PropType<VxeUploadPropTypes.ProgressText>,
      default: () => getConfig().upload.progressText
    },
    autoHiddenButton: {
      type: Boolean as PropType<VxeUploadPropTypes.AutoHiddenButton>,
      default: () => getConfig().upload.autoHiddenButton
    },
    showUploadButton: {
      type: Boolean as PropType<VxeUploadPropTypes.ShowUploadButton>,
      default: () => getConfig().upload.showUploadButton
    },
    buttonText: {
      type: String as PropType<VxeUploadPropTypes.ButtonText>,
      default: () => getConfig().upload.buttonText
    },
    buttonIcon: {
      type: String as PropType<VxeUploadPropTypes.ButtonIcon>,
      default: () => getConfig().upload.buttonIcon
    },
    showButtonText: {
      type: Boolean as PropType<VxeUploadPropTypes.ShowButtonText>,
      default: () => getConfig().upload.showButtonText
    },
    showButtonIcon: {
      type: Boolean as PropType<VxeUploadPropTypes.ShowButtonIcon>,
      default: () => getConfig().upload.showButtonIcon
    },
    showRemoveButton: {
      type: Boolean as PropType<VxeUploadPropTypes.ShowRemoveButton>,
      default: () => getConfig().upload.showRemoveButton
    },
    showDownloadButton: {
      type: Boolean as PropType<VxeUploadPropTypes.ShowDownloadButton>,
      default: () => getConfig().upload.showDownloadButton
    },
    showPreview: {
      type: Boolean as PropType<VxeUploadPropTypes.ShowPreview>,
      default: () => getConfig().upload.showPreview
    },
    tipText: String as PropType<VxeUploadPropTypes.TipText>,
    hintText: String as PropType<VxeUploadPropTypes.HintText>,
    previewMethod: Function as PropType<VxeUploadPropTypes.PreviewMethod>,
    uploadMethod: Function as PropType<VxeUploadPropTypes.UploadMethod>,
    beforeRemoveMethod: Function as PropType<VxeUploadPropTypes.BeforeRemoveMethod>,
    removeMethod: Function as PropType<VxeUploadPropTypes.RemoveMethod>,
    beforeDownloadMethod: Function as PropType<VxeUploadPropTypes.BeforeDownloadMethod>,
    downloadMethod: Function as PropType<VxeUploadPropTypes.DownloadMethod>,
    getUrlMethod: Function as PropType<VxeUploadPropTypes.GetUrlMethod>,
    getThumbnailUrlMethod: Function as PropType<VxeUploadPropTypes.GetThumbnailUrlMethod>,
    size: {
      type: String as PropType<VxeUploadPropTypes.Size>,
      default: () => getConfig().upload.size || getConfig().size
    }
  },
  inject: {
    $xeForm: {
      default: null
    },
    formItemInfo: {
      from: 'xeFormItemInfo',
      default: null
    }
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData: UploadReactData = {
      isDrag: false,
      showMorePopup: false,
      isActivated: false,
      fileList: [],
      fileCacheMaps: {}
    }
    const internalData: UploadInternalData = {
      imagePreviewTypes: ['jpg', 'jpeg', 'png', 'gif']
    }
    return {
      xID,
      reactData,
      internalData
    }
  },
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
      $xeForm(): (VxeFormConstructor & VxeFormPrivateMethods) | null
      formItemInfo(): VxeFormDefines.ProvideItemInfo | null
    }),
    computeFormReadonly () {
      const $xeUpload = this
      const props = $xeUpload
      const $xeForm = $xeUpload.$xeForm

      const { readonly } = props
      if (readonly === null) {
        if ($xeForm) {
          return $xeForm.readonly
        }
        return false
      }
      return readonly
    },
    computeIsDisabled () {
      const $xeUpload = this
      const props = $xeUpload
      const $xeForm = $xeUpload.$xeForm

      const { disabled } = props
      if (disabled === null) {
        if ($xeForm) {
          return $xeForm.disabled
        }
        return false
      }
      return disabled
    },
    computeKeyField () {
      const $xeUpload = this
      const props = $xeUpload

      return props.keyField || '_X_KEY'
    },
    computeIsImage () {
      const $xeUpload = this
      const props = $xeUpload

      return props.mode === 'image'
    },
    computeNameProp () {
      const $xeUpload = this
      const props = $xeUpload

      return props.nameField || 'name'
    },
    computeTypeProp () {
      const $xeUpload = this
      const props = $xeUpload

      return props.typeField || 'type'
    },
    computeUrlProp () {
      const $xeUpload = this
      const props = $xeUpload

      return props.urlField || 'url'
    },
    computeSizeProp () {
      const $xeUpload = this
      const props = $xeUpload

      return props.sizeField || 'size'
    },
    computeLimitMaxSizeB () {
      const $xeUpload = this
      const props = $xeUpload

      return XEUtils.toNumber(props.limitSize) * 1024 * 1024
    },
    computeLimitMaxCount () {
      const $xeUpload = this
      const props = $xeUpload

      return props.multiple ? XEUtils.toNumber(props.limitCount) : 1
    },
    computeOverCount () {
      const $xeUpload = this
      const props = $xeUpload
      const reactData = $xeUpload.reactData as UploadReactData

      const { multiple } = props
      const { fileList } = reactData
      const limitMaxCount = $xeUpload.computeLimitMaxCount as number
      if (multiple) {
        if (limitMaxCount) {
          return fileList.length >= limitMaxCount
        }
        return true
      }
      return fileList.length >= 1
    },
    computeLimitSizeUnit () {
      const $xeUpload = this
      const props = $xeUpload

      const limitSize = XEUtils.toNumber(props.limitSize)
      if (limitSize) {
        if (limitSize > 1048576) {
          return `${limitSize / 1048576}T`
        }
        if (limitSize > 1024) {
          return `${limitSize / 1024}G`
        }
        return `${limitSize}M`
      }
      return ''
    },
    computedDefHintText () {
      const $xeUpload = this
      const props = $xeUpload

      const { limitSize, fileTypes, multiple, limitCount } = props
      const tipText = props.tipText || props.hintText
      const isImage = $xeUpload.computeIsImage
      const limitSizeUnit = $xeUpload.computeLimitSizeUnit
      if (XEUtils.isString(tipText)) {
        return tipText
      }
      const defHints: string[] = []
      if (isImage) {
        if (multiple && limitCount) {
          defHints.push(getI18n('vxe.upload.imgCountHint', [limitCount]))
        }
        if (limitSize && limitSizeUnit) {
          defHints.push(getI18n('vxe.upload.imgSizeHint', [limitSizeUnit]))
        }
      } else {
        if (fileTypes && fileTypes.length) {
          defHints.push(getI18n('vxe.upload.fileTypeHint', [fileTypes.join('/')]))
        }
        if (limitSize && limitSizeUnit) {
          defHints.push(getI18n('vxe.upload.fileSizeHint', [limitSizeUnit]))
        }
        if (multiple && limitCount) {
          defHints.push(getI18n('vxe.upload.fileCountHint', [limitCount]))
        }
      }
      return defHints.join(getI18n('vxe.base.comma'))
    },
    computeImageStyleOpts () {
      const $xeUpload = this
      const props = $xeUpload

      return Object.assign({}, props.imageStyle)
    },
    computeImgStyle () {
      const $xeUpload = this

      const { width, height } = $xeUpload.computeImageStyleOpts
      const stys: Record<string, string> = {}
      if (width) {
        stys.width = toCssUnit(width)
      }
      if (height) {
        stys.height = toCssUnit(height)
      }
      return stys
    },
    computeMoreOpts () {
      const $xeUpload = this
      const props = $xeUpload

      return Object.assign({ showMoreButton: true }, props.moreConfig)
    }
  },
  watch: {
    value () {
      const $xeUpload = this
      $xeUpload.updateFileList()
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeUploadEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeUpload = this
      $xeUpload.$emit(type, createEvent(evnt, { $upload: $xeUpload }, params))
    },
    emitModel  (value: any) {
      const $xeUpload = this

      $xeUpload.$emit('modelValue', value)
    },
    choose () {
      const $xeUpload = this
      return $xeUpload.handleChoose(null)
    },
    getFieldKey  (item: VxeUploadDefines.FileObjItem) {
      const $xeUpload = this

      const keyField = $xeUpload.computeKeyField
      return item[keyField]
    },
    updateFileList () {
      const $xeUpload = this
      const props = $xeUpload
      const reactData = $xeUpload.reactData

      const { value, multiple } = props
      const formReadonly = $xeUpload.computeFormReadonly
      const keyField = $xeUpload.computeKeyField
      const nameProp = $xeUpload.computeNameProp
      const typeProp = $xeUpload.computeTypeProp
      const urlProp = $xeUpload.computeUrlProp
      const sizeProp = $xeUpload.computeSizeProp
      const fileList = value
        ? (value ? (XEUtils.isArray(value) ? value : [value]) : []).map(item => {
            if (!item || XEUtils.isString(item)) {
              const url = `${item || ''}`
              const name = $xeUpload.parseFileName(url)
              return {
                [nameProp]: name,
                [typeProp]: $xeUpload.parseFileType(name),
                [urlProp]: url,
                [sizeProp]: 0,
                [keyField]: getUniqueKey()
              }
            }
            const name = item[nameProp] || ''
            item[nameProp] = name
            item[typeProp] = item[typeProp] || $xeUpload.parseFileType(name)
            item[urlProp] = item[urlProp] || ''
            item[sizeProp] = item[sizeProp] || 0
            item[keyField] = item[keyField] || getUniqueKey()
            return item
          })
        : []
      reactData.fileList = (formReadonly || multiple) ? fileList : (fileList.slice(0, 1))
    },
    parseFileName  (url: string) {
      return decodeURIComponent(`${url || ''}`).split('/').pop() || ''
    },
    parseFileType  (name: string) {
      const index = name ? name.indexOf('.') : -1
      if (index > -1) {
        return name.substring(index + 1, name.length).toLowerCase()
      }
      return ''
    },
    handleChange (value: VxeUploadDefines.FileObjItem[]) {
      const $xeUpload = this
      const props = $xeUpload

      const { singleMode, urlMode } = props
      const urlProp = $xeUpload.computeUrlProp
      let restList = value ? value.slice(0) : []
      if (urlMode) {
        restList = restList.map(item => item[urlProp])
      }
      $xeUpload.emitModel(singleMode ? (restList[0] || null) : restList)
    },
    getThumbnailFileUrl (item: VxeUploadDefines.FileObjItem) {
      const $xeUpload = this
      const props = $xeUpload

      const getThumbnailUrlFn = props.getThumbnailUrlMethod || getConfig().upload.getThumbnailUrlMethod
      if (getThumbnailUrlFn) {
        return getThumbnailUrlFn({
          $upload: $xeUpload,
          option: item
        })
      }
      return $xeUpload.getFileUrl(item)
    },
    getFileUrl  (item: VxeUploadDefines.FileObjItem) {
      const $xeUpload = this
      const props = $xeUpload

      const getUrlFn = props.getUrlMethod || getConfig().upload.getUrlMethod
      const urlProp = $xeUpload.computeUrlProp
      return getUrlFn
        ? getUrlFn({
          $upload: $xeUpload,
          option: item
        })
        : item[urlProp]
    },
    handleDefaultFilePreview (item: VxeUploadDefines.FileObjItem) {
      const $xeUpload = this
      const props = $xeUpload
      const internalData = $xeUpload.internalData

      const { imageTypes, showDownloadButton } = props
      const typeProp = $xeUpload.computeTypeProp
      const beforeDownloadFn = props.beforeDownloadMethod || getConfig().upload.beforeDownloadMethod
      const { imagePreviewTypes } = internalData
      // 如果是预览图片
      if (imagePreviewTypes.concat(imageTypes || []).some(type => `${type}`.toLowerCase() === `${item[typeProp]}`.toLowerCase())) {
        if (VxeUI.previewImage) {
          VxeUI.previewImage({
            urlList: [$xeUpload.getFileUrl(item)],
            showDownloadButton,
            beforeDownloadMethod: beforeDownloadFn
              ? () => {
                  return beforeDownloadFn({
                    $upload: $xeUpload,
                    option: item
                  })
                }
              : undefined
          })
        }
      }
    },
    handlePreviewFileEvent  (evnt: MouseEvent, item: VxeUploadDefines.FileObjItem) {
      const $xeUpload = this
      const props = $xeUpload

      const previewFn = props.previewMethod || getConfig().upload.previewMethod
      if (props.showPreview) {
        if (previewFn) {
          previewFn({
            $upload: $xeUpload,
            option: item
          })
        } else {
          $xeUpload.handleDefaultFilePreview(item)
        }
      }
    },
    handlePreviewImageEvent  (evnt: MouseEvent, item: VxeUploadDefines.FileObjItem, index: number) {
      const $xeUpload = this
      const props = $xeUpload
      const reactData = $xeUpload.reactData

      const { showDownloadButton } = props
      const { fileList } = reactData
      const beforeDownloadFn = props.beforeDownloadMethod || getConfig().upload.beforeDownloadMethod
      if (props.showPreview) {
        if (VxeUI.previewImage) {
          VxeUI.previewImage({
            urlList: fileList.map(item => $xeUpload.getFileUrl(item)),
            activeIndex: index,
            showDownloadButton,
            beforeDownloadMethod: beforeDownloadFn
              ? ({ index }) => {
                  return beforeDownloadFn({
                    $upload: $xeUpload,
                    option: fileList[index]
                  })
                }
              : undefined
          })
        }
      }
    },
    handleUploadResult  (item: VxeUploadDefines.FileObjItem, file: File) {
      const $xeUpload = this
      const props = $xeUpload
      const reactData = $xeUpload.reactData

      const { showErrorStatus } = props
      const fileKey = $xeUpload.getFieldKey(item)
      const uploadFn = props.uploadMethod || getConfig().upload.uploadMethod
      if (uploadFn) {
        return Promise.resolve(
          uploadFn({
            $upload: $xeUpload,
            file,
            option: item,
            updateProgress (percentNum) {
              const { fileCacheMaps } = reactData
              const cacheItem = fileCacheMaps[$xeUpload.getFieldKey(item)]
              if (cacheItem) {
                cacheItem.percent = Math.max(0, Math.min(99, XEUtils.toNumber(percentNum)))
              }
            }
          })
        ).then(res => {
          const { fileCacheMaps } = reactData
          const cacheItem = fileCacheMaps[fileKey]
          if (cacheItem) {
            cacheItem.percent = 100
          }
          Object.assign(item, res)
          $xeUpload.dispatchEvent('upload-success', { option: item, data: res }, null)
        }).catch((res) => {
          const { fileCacheMaps } = reactData
          const cacheItem = fileCacheMaps[fileKey]
          if (cacheItem) {
            cacheItem.status = 'error'
          }
          if (showErrorStatus) {
            Object.assign(item, res)
          } else {
            reactData.fileList = reactData.fileList.filter(obj => $xeUpload.getFieldKey(obj) !== fileKey)
          }
          $xeUpload.dispatchEvent('upload-error', { option: item, data: res }, null)
        }).finally(() => {
          const { fileCacheMaps } = reactData
          const cacheItem = fileCacheMaps[fileKey]
          if (cacheItem) {
            cacheItem.loading = false
          }
        })
      } else {
        const { fileCacheMaps } = reactData
        const cacheItem = fileCacheMaps[fileKey]
        if (cacheItem) {
          cacheItem.loading = false
        }
      }
      return Promise.resolve()
    },
    handleReUpload (item: VxeUploadDefines.FileObjItem) {
      const $xeUpload = this
      const props = $xeUpload
      const reactData = $xeUpload.reactData

      const { uploadMethod, urlMode } = props
      const { fileCacheMaps } = reactData
      const fileKey = $xeUpload.getFieldKey(item)
      const cacheItem = fileCacheMaps[fileKey]
      const uploadFn = uploadMethod || getConfig().upload.uploadMethod
      if (uploadFn && cacheItem) {
        const file = cacheItem.file
        cacheItem.loading = true
        cacheItem.status = ''
        cacheItem.percent = 0
        $xeUpload.handleUploadResult(item, file).then(() => {
          if (urlMode) {
            $xeUpload.handleChange(reactData.fileList)
          }
        })
      }
    },
    uploadFile  (files: File[], evnt: Event | null) {
      const $xeUpload = this
      const props = $xeUpload
      const reactData = $xeUpload.reactData
      const $xeForm = $xeUpload.$xeForm
      const formItemInfo = $xeUpload.formItemInfo

      const { multiple, urlMode } = props
      const { fileList } = reactData
      const uploadFn = props.uploadMethod || getConfig().upload.uploadMethod
      const keyField = $xeUpload.computeKeyField
      const nameProp = $xeUpload.computeNameProp
      const typeProp = $xeUpload.computeTypeProp
      const urlProp = $xeUpload.computeUrlProp
      const sizeProp = $xeUpload.computeSizeProp
      const limitMaxSizeB = $xeUpload.computeLimitMaxSizeB
      const limitMaxCount = $xeUpload.computeLimitMaxCount
      const limitSizeUnit = $xeUpload.computeLimitSizeUnit
      let selectFiles = files

      if (multiple && limitMaxCount) {
        // 校验文件数量
        if (fileList.length >= limitMaxCount) {
          if (VxeUI.modal) {
            VxeUI.modal.notification({
              title: getI18n('vxe.modal.errTitle'),
              status: 'error',
              content: getI18n('vxe.upload.overCountErr', [limitMaxCount])
            })
          }
          return
        }
        const overNum = selectFiles.length - (limitMaxCount - fileList.length)
        if (overNum > 0) {
          const overExtraList = selectFiles.slice(limitMaxCount - fileList.length)
          if (VxeUI.modal) {
            VxeUI.modal.notification({
              title: getI18n('vxe.modal.errTitle'),
              status: 'error',
              slots: {
                default (params, h) {
                  return h('div', {
                    class: 'vxe-upload--file-message-over-error'
                  }, [
                    h('div', {}, getI18n('vxe.upload.overCountExtraErr', [limitMaxCount, overNum])),
                    h('div', {
                      class: 'vxe-upload--file-message-over-extra'
                    }, overExtraList.map((file, index) => {
                      return h('div', {
                        key: index,
                        class: 'vxe-upload--file-message-over-extra-item'
                      }, file.name)
                    }))
                  ])
                }
              }
            })
          }
        }
        selectFiles = selectFiles.slice(0, limitMaxCount - fileList.length)
      }

      // 校验文件大小
      if (limitMaxSizeB) {
        for (let i = 0; i < files.length; i++) {
          const file = files[0]
          if (file.size > limitMaxSizeB) {
            if (VxeUI.modal) {
              VxeUI.modal.notification({
                title: getI18n('vxe.modal.errTitle'),
                status: 'error',
                content: getI18n('vxe.upload.overSizeErr', [limitSizeUnit])
              })
            }
            return
          }
        }
      }

      const cacheMaps = Object.assign({}, reactData.fileCacheMaps)
      const newFileList = multiple ? fileList : []
      const uploadPromiseRests: any[] = []
      selectFiles.forEach(file => {
        const { name } = file
        const fileKey = getUniqueKey()
        const fileObj: VxeUploadDefines.FileObjItem = {
          [nameProp]: name,
          [typeProp]: $xeUpload.parseFileType(name),
          [sizeProp]: file.size,
          [urlProp]: '',
          [keyField]: fileKey
        }
        if (uploadFn) {
          cacheMaps[fileKey] = {
            file: file,
            loading: true,
            status: '',
            percent: 0
          }
        }
        const item = fileObj
        if (uploadFn) {
          uploadPromiseRests.push(
            $xeUpload.handleUploadResult(item, file)
          )
        }
        newFileList.push(item)
        $xeUpload.dispatchEvent('add', { option: item }, evnt)
      })
      reactData.fileList = newFileList
      reactData.fileCacheMaps = cacheMaps
      Promise.all(urlMode ? uploadPromiseRests : []).then(() => {
        $xeUpload.handleChange(newFileList)
        // 自动更新校验状态
        if ($xeForm && formItemInfo) {
          $xeForm.triggerItemEvent(evnt as any, formItemInfo.itemConfig.field, newFileList)
        }
      })
    },
    handleChoose  (evnt: MouseEvent | null) {
      const $xeUpload = this
      const props = $xeUpload

      const { multiple, imageTypes, fileTypes } = props
      const isDisabled = $xeUpload.computeIsDisabled
      const isImage = $xeUpload.computeIsImage
      if (isDisabled) {
        return Promise.resolve({
          status: false,
          files: [],
          file: null
        })
      }
      return readLocalFile({
        multiple,
        types: isImage ? imageTypes : fileTypes
      }).then((params) => {
        $xeUpload.uploadFile(params.files, evnt)
        return params
      })
    },
    clickEvent (evnt: MouseEvent) {
      const $xeUpload = this

      $xeUpload.handleChoose(evnt).catch(() => {
        // 错误文件类型
      })
    },
    handleRemoveEvent  (evnt: MouseEvent, item: VxeUploadDefines.FileObjItem, index: number) {
      const $xeUpload = this
      const reactData = $xeUpload.reactData
      const $xeForm = $xeUpload.$xeForm
      const formItemInfo = $xeUpload.formItemInfo

      const { fileList } = reactData
      fileList.splice(index, 1)
      $xeUpload.handleChange(fileList)
      // 自动更新校验状态
      if ($xeForm && formItemInfo) {
        $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, fileList)
      }
      $xeUpload.dispatchEvent('remove', { option: item }, evnt)
    },
    removeFileEvent  (evnt: MouseEvent, item: VxeUploadDefines.FileObjItem, index: number) {
      const $xeUpload = this
      const props = $xeUpload

      const beforeRemoveFn = props.beforeRemoveMethod || getConfig().upload.beforeRemoveMethod
      const removeFn = props.removeMethod || getConfig().upload.removeMethod
      Promise.resolve(
        beforeRemoveFn
          ? beforeRemoveFn({
            $upload: $xeUpload,
            option: item
          })
          : true
      ).then(status => {
        if (status) {
          if (removeFn) {
            Promise.resolve(
              removeFn({
                $upload: $xeUpload,
                option: item
              })
            ).then(() => {
              $xeUpload.handleRemoveEvent(evnt, item, index)
            }).catch(e => e)
          } else {
            $xeUpload.handleRemoveEvent(evnt, item, index)
          }
        } else {
          $xeUpload.dispatchEvent('remove-fail', { option: item }, evnt)
        }
      })
    },
    handleDownloadEvent  (evnt: MouseEvent, item: VxeUploadDefines.FileObjItem) {
      const $xeUpload = this

      $xeUpload.dispatchEvent('download', { option: item }, evnt)
    },
    downloadFileEvent  (evnt: MouseEvent, item: VxeUploadDefines.FileObjItem) {
      const $xeUpload = this
      const props = $xeUpload

      const beforeDownloadFn = props.beforeDownloadMethod || getConfig().upload.beforeDownloadMethod
      const downloadFn = props.downloadMethod || getConfig().upload.downloadMethod
      Promise.resolve(
        beforeDownloadFn
          ? beforeDownloadFn({
            $upload: $xeUpload,
            option: item
          })
          : true
      ).then(status => {
        if (status) {
          if (downloadFn) {
            Promise.resolve(
              downloadFn({
                $upload: $xeUpload,
                option: item
              })
            ).then(() => {
              $xeUpload.handleDownloadEvent(evnt, item)
            }).catch(e => e)
          } else {
            $xeUpload.handleDownloadEvent(evnt, item)
          }
        } else {
          $xeUpload.dispatchEvent('download-fail', { option: item }, evnt)
        }
      })
    },
    handleDragleaveEvent  (evnt: DragEvent) {
      const $xeUpload = this
      const reactData = $xeUpload.reactData

      const targetElem = evnt.currentTarget as HTMLDivElement
      const { clientX, clientY } = evnt
      if (targetElem) {
        const { x: targetX, y: targetY, height: targetHeight, width: targetWidth } = targetElem.getBoundingClientRect()
        if (clientX < targetX || clientX > targetX + targetWidth || clientY < targetY || clientY > targetY + targetHeight) {
          reactData.isDrag = false
        }
      }
    },
    handleDragoverEvent  (evnt: DragEvent) {
      const $xeUpload = this
      const reactData = $xeUpload.reactData

      const dataTransfer = evnt.dataTransfer
      if (dataTransfer) {
        const { items } = dataTransfer
        if (items && items.length) {
          evnt.preventDefault()
          reactData.isDrag = true
        }
      }
    },
    uploadTransferFileEvent (evnt: Event, files: File[]) {
      const $xeUpload = this
      const props = $xeUpload
      const internalData = $xeUpload.internalData

      const { imageTypes } = props
      const { imagePreviewTypes } = internalData
      const isImage = $xeUpload.computeIsImage
      if (isImage) {
        const pasteImgTypes = imagePreviewTypes.concat(imageTypes && imageTypes.length ? imageTypes : [])
        files = files.filter(file => {
          const fileType = `${file.type.split('/')[1] || ''}`.toLowerCase()
          if (pasteImgTypes.some(type => `${type}`.toLowerCase() === fileType)) {
            return true
          }
          return false
        })
      }
      // 如果全部不满足条件
      if (!files.length) {
        if (VxeUI.modal) {
          VxeUI.modal.notification({
            title: getI18n('vxe.modal.errTitle'),
            status: 'error',
            content: getI18n('vxe.upload.uploadTypeErr')
          })
        }
        return
      }
      $xeUpload.uploadFile(files, evnt)
    },
    handleDropEvent  (evnt: DragEvent) {
      const $xeUpload = this
      const reactData = $xeUpload.reactData

      const dataTransfer = evnt.dataTransfer
      if (dataTransfer) {
        const { items } = dataTransfer
        if (items && items.length) {
          evnt.preventDefault()
          const files = handleTransferFiles(items)
          if (files.length) {
            $xeUpload.uploadTransferFileEvent(evnt, files)
          }
        }
      }
      reactData.isDrag = false
    },
    handleMoreEvent  () {
      const $xeUpload = this
      const props = $xeUpload
      const reactData = $xeUpload.reactData

      const formReadonly = $xeUpload.computeFormReadonly
      const isImage = $xeUpload.computeIsImage

      if (VxeUI.modal) {
        VxeUI.modal.open({
          title: formReadonly ? getI18n('vxe.upload.morePopup.readTitle') : getI18n(`vxe.upload.morePopup.${isImage ? 'imageTitle' : 'fileTitle'}`),
          width: 660,
          height: 500,
          escClosable: true,
          showMaximize: true,
          resize: true,
          maskClosable: true,
          slots: {
            default (params, h) {
              const { showErrorStatus, dragToUpload } = props
              const { isDrag } = reactData
              const isDisabled = $xeUpload.computeIsDisabled
              const { fileList } = reactData

              const ons: Record<string, any> = {}
              if (dragToUpload) {
                ons.dragover = $xeUpload.handleDragoverEvent
                ons.dragleave = $xeUpload.handleDragleaveEvent
                ons.drop = $xeUpload.handleDropEvent
              }

              return h('div', {
                class: ['vxe-upload--more-popup', {
                  'is--readonly': formReadonly,
                  'is--disabled': isDisabled,
                  'show--error': showErrorStatus,
                  'is--drag': isDrag
                }],
                on: ons
              }, [
                isImage
                  ? h('div', {
                    class: 'vxe-upload--image-more-list'
                  }, $xeUpload.renderImageItemList(h, fileList, true).concat($xeUpload.renderImageAction(h, true)))
                  : h('div', {
                    class: 'vxe-upload--file-more-list'
                  }, [
                    $xeUpload.renderFileAction(h, true),
                    h('div', {
                      class: 'vxe-upload--file-list'
                    }, $xeUpload.renderFileItemList(h, fileList, true))
                  ]),
                isDrag
                  ? h('div', {
                    class: 'vxe-upload--drag-placeholder'
                  }, getI18n('vxe.upload.dragPlaceholder'))
                  : renderEmptyElement($xeUpload)
              ])
            }
          },
          onShow () {
            reactData.showMorePopup = true
          },
          onHide () {
            reactData.showMorePopup = false
          }
        })
      }
    },
    handleGlobalPasteEvent (evnt: ClipboardEvent) {
      const $xeUpload = this
      const props = $xeUpload
      const reactData = $xeUpload.reactData

      const { pasteToUpload } = props
      const { isActivated } = reactData
      if (!isActivated || !pasteToUpload) {
        return
      }
      const clipboardData: DataTransfer = evnt.clipboardData || (evnt as any).originalEvent.clipboardData
      if (!clipboardData) {
        return
      }
      const { items } = clipboardData
      if (!items) {
        return
      }
      const files = handleTransferFiles(items)
      if (files.length) {
        evnt.preventDefault()
        $xeUpload.uploadTransferFileEvent(evnt, files)
      }
    },
    handleGlobalMousedownEvent (evnt: MouseEvent) {
      const $xeUpload = this
      const reactData = $xeUpload.reactData

      const el = $xeUpload.$refs.refElem
      const isActivated = getEventTargetNode(evnt, el).flag
      reactData.isActivated = isActivated
    },
    handleGlobalBlurEvent () {
      const $xeUpload = this
      const reactData = $xeUpload.reactData

      reactData.isActivated = false
    },

    //
    // Render
    //
    renderFileItemList  (h: CreateElement, currList: VxeUploadDefines.FileObjItem[], isMoreView: boolean) {
      const $xeUpload = this
      const props = $xeUpload
      const slots = $xeUpload.$scopedSlots
      const reactData = $xeUpload.reactData

      const { showRemoveButton, showDownloadButton, showProgress, progressText, showPreview, showErrorStatus } = props
      const { fileCacheMaps } = reactData
      const isDisabled = $xeUpload.computeIsDisabled
      const formReadonly = $xeUpload.computeFormReadonly
      const nameProp = $xeUpload.computeNameProp
      const typeProp = $xeUpload.computeTypeProp
      const cornerSlot = slots.corner

      return currList.map((item, index) => {
        const fileKey = $xeUpload.getFieldKey(item)
        const cacheItem = fileCacheMaps[fileKey]
        const isLoading = cacheItem && cacheItem.loading
        const isError = cacheItem && cacheItem.status === 'error'
        return h('div', {
          key: index,
          class: ['vxe-upload--file-item', {
            'is--preview': showPreview,
            'is--loading': isLoading,
            'is--error': isError
          }]
        }, [
          h('div', {
            class: 'vxe-upload--file-item-icon'
          }, [
            h('i', {
              class: getIcon()[`UPLOAD_FILE_TYPE_${`${item[typeProp]}`.toLocaleUpperCase() as 'DEFAULT'}`] || getIcon().UPLOAD_FILE_TYPE_DEFAULT
            })
          ]),
          h('div', {
            class: 'vxe-upload--file-item-name',
            on: {
              click (evnt: MouseEvent) {
                if (!isLoading && !isError) {
                  $xeUpload.handlePreviewFileEvent(evnt, item)
                }
              }
            }
          }, `${item[nameProp] || ''}`),
          isLoading
            ? h('div', {
              class: 'vxe-upload--file-item-loading-icon'
            }, [
              h('i', {
                class: getIcon().UPLOAD_LOADING
              })
            ])
            : renderEmptyElement($xeUpload),
          showProgress && isLoading && cacheItem
            ? h('div', {
              class: 'vxe-upload--file-item-loading-text'
            }, progressText ? XEUtils.toFormatString(progressText, { percent: cacheItem.percent }) : getI18n('vxe.upload.uploadProgress', [cacheItem.percent]))
            : renderEmptyElement($xeUpload),
          showErrorStatus && isError
            ? h('div', {
              class: 'vxe-upload--image-item-error'
            }, [
              h(VxeButtonComponent, {
                props: {
                  icon: getIcon().UPLOAD_IMAGE_RE_UPLOAD,
                  mode: 'text',
                  status: 'primary',
                  content: getI18n('vxe.upload.reUpload')
                },
                on: {
                  click () {
                    $xeUpload.handleReUpload(item)
                  }
                }
              })
            ])
            : renderEmptyElement($xeUpload),
          h('div', {
            class: 'vxe-upload--file-item-btn-wrapper'
          }, [
            cornerSlot
              ? h('div', {
                class: 'vxe-upload--file-item-corner'
              }, getSlotVNs(cornerSlot({ option: item, isMoreView, readonly: formReadonly })))
              : renderEmptyElement($xeUpload),
            showDownloadButton && !isLoading
              ? h('div', {
                class: 'vxe-upload--file-item-download-btn',
                on: {
                  click (evnt: MouseEvent) {
                    $xeUpload.downloadFileEvent(evnt, item)
                  }
                }
              }, [
                h('i', {
                  class: getIcon().UPLOAD_FILE_DOWNLOAD
                })
              ])
              : renderEmptyElement($xeUpload),
            showRemoveButton && !formReadonly && !isDisabled && !isLoading
              ? h('div', {
                class: 'vxe-upload--file-item-remove-btn',
                on: {
                  click (evnt: MouseEvent) {
                    $xeUpload.removeFileEvent(evnt, item, index)
                  }
                }
              }, [
                h('i', {
                  class: getIcon().UPLOAD_FILE_REMOVE
                })
              ])
              : renderEmptyElement($xeUpload)
          ])
        ])
      })
    },
    renderFileAction (h: CreateElement, isMoreView: boolean) {
      const $xeUpload = this
      const props = $xeUpload
      const slots = $xeUpload.$scopedSlots

      const { showUploadButton, buttonText, buttonIcon, showButtonText, showButtonIcon, autoHiddenButton } = props
      const isDisabled = $xeUpload.computeIsDisabled
      const formReadonly = $xeUpload.computeFormReadonly
      const defHintText = $xeUpload.computedDefHintText
      const overCount = $xeUpload.computeOverCount
      const defaultSlot = slots.default
      const tipSlot = slots.tip || slots.hint

      if (formReadonly || !showUploadButton) {
        return renderEmptyElement($xeUpload)
      }
      return h('div', {
        class: 'vxe-upload--file-action'
      }, [
        autoHiddenButton && overCount
          ? renderEmptyElement($xeUpload)
          : h('div', {
            class: 'vxe-upload--file-action-btn',
            on: {
              click: $xeUpload.clickEvent
            }
          }, defaultSlot
            ? getSlotVNs(defaultSlot({ $upload: $xeUpload }))
            : [
                h(VxeButtonComponent, {
                  class: 'vxe-upload--file-action-button',
                  props: {
                    content: (isMoreView || showButtonText) ? (buttonText ? `${buttonText}` : getI18n('vxe.upload.fileBtnText')) : '',
                    icon: showButtonIcon ? (buttonIcon || getIcon().UPLOAD_FILE_ADD) : '',
                    disabled: isDisabled
                  }
                })
              ]),
        isMoreView && (defHintText || tipSlot)
          ? h('div', {
            class: 'vxe-upload--file-action-tip'
          }, tipSlot ? getSlotVNs(tipSlot({ $upload: $xeUpload })) : defHintText)
          : renderEmptyElement($xeUpload)
      ])
    },
    renderAllMode  (h: CreateElement) {
      const $xeUpload = this
      const props = $xeUpload
      const reactData = $xeUpload.reactData

      const { moreConfig } = props
      const { fileList } = reactData
      const moreOpts = $xeUpload.computeMoreOpts

      const { maxCount, showMoreButton, layout } = moreOpts
      const isHorizontal = layout === 'horizontal'

      let currList = fileList
      let overMaxNum = 0
      if (maxCount && fileList.length > maxCount) {
        overMaxNum = fileList.length - maxCount
        currList = fileList.slice(0, maxCount)
      }

      return h('div', {
        key: 'all',
        class: 'vxe-upload--file-wrapper'
      }, [
        showMoreButton && moreConfig && isHorizontal
          ? renderEmptyElement($xeUpload)
          : $xeUpload.renderFileAction(h, true),
        currList.length || (showMoreButton && isHorizontal)
          ? h('div', {
            class: ['vxe-upload--file-list-wrapper', {
              'is--horizontal': isHorizontal
            }]
          }, [
            currList.length
              ? h('div', {
                class: 'vxe-upload--file-list'
              }, $xeUpload.renderFileItemList(h, currList, false))
              : renderEmptyElement($xeUpload),
            showMoreButton && overMaxNum
              ? h('div', {
                class: 'vxe-upload--file-over-more'
              }, [
                h(VxeButtonComponent, {
                  props: {
                    mode: 'text',
                    content: getI18n('vxe.upload.moreBtnText', [fileList.length]),
                    status: 'primary'
                  },
                  on: {
                    click: $xeUpload.handleMoreEvent
                  }
                })
              ])
              : renderEmptyElement($xeUpload),
            showMoreButton && moreConfig && isHorizontal
              ? $xeUpload.renderFileAction(h, false)
              : renderEmptyElement($xeUpload)
          ])
          : renderEmptyElement($xeUpload)
      ])
    },
    renderImageItemList (h: CreateElement, currList: VxeUploadDefines.FileObjItem[], isMoreView: boolean) {
      const $xeUpload = this
      const props = $xeUpload
      const slots = $xeUpload.$scopedSlots
      const reactData = $xeUpload.reactData

      const { showRemoveButton, showProgress, progressText, showPreview, showErrorStatus } = props
      const { fileCacheMaps } = reactData
      const isDisabled = $xeUpload.computeIsDisabled
      const formReadonly = $xeUpload.computeFormReadonly
      const imgStyle = $xeUpload.computeImgStyle
      const cornerSlot = slots.corner

      return currList.map((item, index) => {
        const fileKey = $xeUpload.getFieldKey(item)
        const cacheItem = fileCacheMaps[fileKey]
        const isLoading = cacheItem && cacheItem.loading
        const isError = cacheItem && cacheItem.status === 'error'
        return h('div', {
          key: index,
          class: ['vxe-upload--image-item', {
            'is--preview': showPreview,
            'is--loading': isLoading,
            'is--error': isError
          }]
        }, [
          h('div', {
            class: 'vxe-upload--image-item-box',
            style: isMoreView ? {} : imgStyle,
            attrs: {
              title: getI18n('vxe.upload.viewItemTitle')
            },
            on: {
              click (evnt: MouseEvent) {
                if (!isLoading && !isError) {
                  $xeUpload.handlePreviewImageEvent(evnt, item, index)
                }
              }
            }
          }, [
            isLoading && cacheItem
              ? h('div', {
                class: 'vxe-upload--image-item-loading'
              }, [
                h('div', {
                  class: 'vxe-upload--image-item-loading-icon'
                }, [
                  h('i', {
                    class: getIcon().UPLOAD_LOADING
                  })
                ]),
                showProgress
                  ? h('div', {
                    class: 'vxe-upload--image-item-loading-text'
                  }, progressText ? XEUtils.toFormatString(progressText, { percent: cacheItem.percent }) : getI18n('vxe.upload.uploadProgress', [cacheItem.percent]))
                  : renderEmptyElement($xeUpload)
              ])
              : renderEmptyElement($xeUpload),
            !isLoading
              ? (
                  isError && showErrorStatus
                    ? h('div', {
                      class: 'vxe-upload--image-item-error'
                    }, [
                      h(VxeButtonComponent, {
                        props: {
                          icon: getIcon().UPLOAD_IMAGE_RE_UPLOAD,
                          mode: 'text',
                          status: 'primary',
                          content: getI18n('vxe.upload.reUpload')
                        },
                        on: {
                          click () {
                            $xeUpload.handleReUpload(item)
                          }
                        }
                      })
                    ])
                    : h('img', {
                      class: 'vxe-upload--image-item-img',
                      attrs: {
                        src: $xeUpload.getThumbnailFileUrl(item)
                      }
                    })
                )
              : renderEmptyElement($xeUpload),
            h('div', {
              class: 'vxe-upload--image-item-btn-wrapper',
              on: {
                click (evnt: MouseEvent) {
                  evnt.stopPropagation()
                }
              }
            }, [
              cornerSlot
                ? h('div', {
                  class: 'vxe-upload--file-item-corner'
                }, getSlotVNs(cornerSlot({ option: item, isMoreView, readonly: formReadonly })))
                : renderEmptyElement($xeUpload),
              showRemoveButton && !formReadonly && !isDisabled && !isLoading
                ? h('div', {
                  class: 'vxe-upload--image-item-remove-btn',
                  on: {
                    click (evnt: MouseEvent) {
                      evnt.stopPropagation()
                      $xeUpload.removeFileEvent(evnt, item, index)
                    }
                  }
                }, [
                  h('i', {
                    class: getIcon().UPLOAD_IMAGE_REMOVE
                  })
                ])
                : renderEmptyElement($xeUpload)
            ])
          ])
        ])
      })
    },
    renderImageAction  (h: CreateElement, isMoreView: boolean) {
      const $xeUpload = this
      const props = $xeUpload
      const slots = $xeUpload.$scopedSlots

      const { showUploadButton, buttonText, buttonIcon, showButtonText, showButtonIcon, autoHiddenButton } = props
      const formReadonly = $xeUpload.computeFormReadonly
      const defHintText = $xeUpload.computedDefHintText
      const overCount = $xeUpload.computeOverCount
      const imgStyle = $xeUpload.computeImgStyle
      const defaultSlot = slots.default
      const hintSlot = slots.hint

      if (formReadonly || !showUploadButton || (autoHiddenButton && overCount)) {
        return renderEmptyElement($xeUpload)
      }
      return h('div', {
        key: 'action',
        class: 'vxe-upload--image-action'
      }, [
        h('div', {
          class: 'vxe-upload--image-action-btn',
          on: {
            click: $xeUpload.clickEvent
          }
        }, defaultSlot
          ? defaultSlot({ $upload: $xeUpload })
          : [
              h('div', {
                class: 'vxe-upload--image-action-box',
                style: isMoreView ? {} : imgStyle
              }, [
                showButtonIcon
                  ? h('div', {
                    class: 'vxe-upload--image-action-icon'
                  }, [
                    h('i', {
                      class: buttonIcon || getIcon().UPLOAD_IMAGE_ADD
                    })
                  ])
                  : renderEmptyElement($xeUpload),
                isMoreView || showButtonText
                  ? h('div', {
                    class: 'vxe-upload--image-action-content'
                  }, buttonText ? `${buttonText}` : getI18n('vxe.upload.imgBtnText'))
                  : renderEmptyElement($xeUpload),
                isMoreView && (defHintText || hintSlot)
                  ? h('div', {
                    class: 'vxe-upload--image-action-hint'
                  }, hintSlot ? getSlotVNs(hintSlot({ $upload: $xeUpload })) : defHintText)
                  : renderEmptyElement($xeUpload)
              ])
            ])
      ])
    },
    renderImageMode  (h: CreateElement) {
      const $xeUpload = this
      const reactData = $xeUpload.reactData

      const { fileList } = reactData
      const moreOpts = $xeUpload.computeMoreOpts

      const { maxCount, showMoreButton } = moreOpts
      let currList = fileList
      let overMaxNum = 0
      if (maxCount && fileList.length > maxCount) {
        overMaxNum = fileList.length - maxCount
        currList = fileList.slice(0, maxCount)
      }

      return h('div', {
        key: 'image',
        class: 'vxe-upload--image-wrapper'
      }, [
        h('div', {
          class: 'vxe-upload--image-list'
        }, $xeUpload.renderImageItemList(h, currList, false).concat([
          showMoreButton && overMaxNum
            ? h('div', {
              class: 'vxe-upload--image-over-more'
            }, [
              h(VxeButtonComponent, {
                props: {
                  mode: 'text',
                  content: getI18n('vxe.upload.moreBtnText', [fileList.length]),
                  status: 'primary'
                },
                on: {
                  click: $xeUpload.handleMoreEvent
                }
              })
            ])
            : renderEmptyElement($xeUpload),
          $xeUpload.renderImageAction(h, false)
        ]))
      ])
    },
    renderVN (h: CreateElement): VNode {
      const $xeUpload = this
      const props = $xeUpload
      const reactData = $xeUpload.reactData

      const { showErrorStatus, dragToUpload, pasteToUpload } = props
      const { isDrag, showMorePopup, isActivated } = reactData
      const vSize = $xeUpload.computeSize
      const isDisabled = $xeUpload.computeIsDisabled
      const formReadonly = $xeUpload.computeFormReadonly
      const isImage = $xeUpload.computeIsImage

      const ons: Record<string, any> = {}
      if (dragToUpload) {
        ons.dragover = $xeUpload.handleDragoverEvent
        ons.dragleave = $xeUpload.handleDragleaveEvent
        ons.drop = $xeUpload.handleDropEvent
      }

      return h('div', {
        ref: 'refElem',
        class: ['vxe-upload', {
          [`size--${vSize}`]: vSize,
          'is--active': isActivated,
          'is--readonly': formReadonly,
          'is--disabled': isDisabled,
          'is--paste': pasteToUpload,
          'show--error': showErrorStatus,
          'is--drag': isDrag
        }],
        on: ons
      }, [
        isImage ? $xeUpload.renderImageMode(h) : $xeUpload.renderAllMode(h),
        isDrag && !showMorePopup
          ? h('div', {
            class: 'vxe-upload--drag-placeholder'
          }, getI18n('vxe.upload.dragPlaceholder'))
          : renderEmptyElement($xeUpload)
      ])
    }
  },
  created () {
    const $xeUpload = this

    $xeUpload.updateFileList()
  },
  mounted () {
    const $xeUpload = this
    const props = $xeUpload

    if (process.env.VUE_APP_VXE_ENV === 'development') {
      if (props.multiple && props.singleMode) {
        errLog('vxe.error.errConflicts', ['multiple', 'single-mode'])
      }
    }
    globalEvents.on($xeUpload, 'paste', $xeUpload.handleGlobalPasteEvent)
    globalEvents.on($xeUpload, 'mousedown', $xeUpload.handleGlobalMousedownEvent)
    globalEvents.on($xeUpload, 'blur', $xeUpload.handleGlobalBlurEvent)
  },
  beforeDestroy () {
    const $xeUpload = this
    const reactData = $xeUpload.reactData

    reactData.isDrag = false
    globalEvents.off($xeUpload, 'paste')
    globalEvents.off($xeUpload, 'mousedown')
    globalEvents.off($xeUpload, 'blur')
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
})
