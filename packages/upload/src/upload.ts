import { defineComponent, ref, h, reactive, watch, computed, PropType, createCommentVNode, onUnmounted } from 'vue'
import XEUtils from 'xe-utils'
import { VxeUI, getConfig, getI18n, getIcon, createEvent } from '@vxe-ui/core'
import VxeButtonComponent from '../../button/src/button'
import { getSlotVNs } from '../..//ui/src/vn'
import { readLocalFile } from './util'

import type { VxeUploadDefines, VxeUploadPropTypes, UploadReactData, UploadPrivateMethods, UploadMethods, VxeUploadEmits, UploadPrivateRef, VxeUploadPrivateComputed, VxeUploadConstructor, VxeUploadPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeUpload',
  props: {
    modelValue: Array as PropType<VxeUploadPropTypes.ModelValue>,
    mode: {
      type: String as PropType<VxeUploadPropTypes.Mode>,
      default: () => getConfig().upload.mode
    },
    imageTypes: {
      type: Array as PropType<VxeUploadPropTypes.ImageTypes>,
      default: () => XEUtils.clone(getConfig().upload.imageTypes, true)
    },
    fileTypes: {
      type: Array as PropType<VxeUploadPropTypes.FileTypes>,
      default: () => XEUtils.clone(getConfig().upload.fileTypes, true)
    },
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
    autoHiddenButton: {
      type: Boolean as PropType<VxeUploadPropTypes.AutoHiddenButton>,
      default: () => getConfig().upload.autoHiddenButton
    },
    buttonText: {
      type: String as PropType<VxeUploadPropTypes.ButtonText>,
      default: () => getConfig().upload.buttonText
    },
    hintText: String as PropType<VxeUploadPropTypes.HintText>,
    uploadMethod: Function as PropType<VxeUploadPropTypes.UploadMethod>,
    getUrlMethod: Function as PropType<VxeUploadPropTypes.GetUrlMethod>
  },
  emits: [
    'update:modelValue',
    'add',
    'remove',
    'upload-success',
    'upload-error'
  ] as VxeUploadEmits,
  setup (props, context) {
    const { emit, slots } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<UploadReactData>({
      isDrag: false,
      fileList: []
    })

    const refMaps: UploadPrivateRef = {
      refElem
    }

    const computeIsImage = computed(() => {
      return props.mode === 'image'
    })

    const computeNameProp = computed(() => {
      return props.nameField || 'name'
    })

    const computeTypeProp = computed(() => {
      return props.typeField || 'type'
    })

    const computeUrlProp = computed(() => {
      return props.urlField || 'url'
    })

    const computeSizeProp = computed(() => {
      return props.sizeField || 'size'
    })

    const computeLimitMaxSizeB = computed(() => {
      return XEUtils.toNumber(props.limitSize) * 1024 * 1024
    })

    const computeLimitMaxCount = computed(() => {
      return props.multiple ? XEUtils.toNumber(props.limitCount) : 1
    })

    const computeOverCount = computed(() => {
      const { multiple } = props
      const { fileList } = reactData
      const limitMaxCount = computeLimitMaxCount.value
      if (multiple) {
        if (limitMaxCount) {
          return fileList.length >= limitMaxCount
        }
        return true
      }
      return fileList.length >= 1
    })

    const computeLimitSizeUnit = computed(() => {
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
    })

    const computedDefHintText = computed(() => {
      const { hintText, limitSize, fileTypes, multiple, limitCount } = props
      const isImage = computeIsImage.value
      const limitSizeUnit = computeLimitSizeUnit.value
      if (XEUtils.isString(hintText)) {
        return hintText
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
    })

    const computeMaps: VxeUploadPrivateComputed = {
    }

    const $xeUpload = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeUploadConstructor & VxeUploadPrivateMethods

    const updateFileList = () => {
      const { modelValue, multiple } = props
      const nameProp = computeNameProp.value
      const typeProp = computeTypeProp.value
      const urlProp = computeUrlProp.value
      const sizeProp = computeSizeProp.value
      const fileList = modelValue
        ? modelValue.map(item => {
          const name = item[nameProp] || ''
          item[nameProp] = name
          item[typeProp] = item[typeProp] || getFileType(name)
          item[urlProp] = item[urlProp] || ''
          item[sizeProp] = item[sizeProp] || 0
          return item
        })
        : []
      reactData.fileList = multiple ? fileList : (fileList.slice(0, 1))
    }

    const getFileType = (name: string) => {
      const index = name ? name.indexOf('.') : -1
      if (index > -1) {
        return name.substring(index + 1, name.length).toLowerCase()
      }
      return ''
    }

    const uploadMethods: UploadMethods = {
      dispatchEvent (type, params, evnt) {
        emit(type, createEvent(evnt, { $upload: $xeUpload }, params))
      }
    }

    const emitModel = (value: VxeUploadDefines.FileObjItem[]) => {
      emit('update:modelValue', value ? value.slice(0) : [])
    }

    const getFileUrl = (item: VxeUploadDefines.FileObjItem) => {
      const getUrlFn = props.getUrlMethod || getConfig().upload.getUrlMethod
      const urlProp = computeUrlProp.value
      return getUrlFn ? getUrlFn({ option: item }) : item[urlProp]
    }

    const handlePreviewImageEvent = (evnt: MouseEvent, item: VxeUploadDefines.FileObjItem, index: number) => {
      const { fileList } = reactData
      if (VxeUI.previewImage) {
        VxeUI.previewImage({
          urlList: fileList.map(item => getFileUrl(item)),
          activeIndex: index
        })
      }
    }

    const handleUploadResult = (item: VxeUploadDefines.FileObjItem, file: File) => {
      const { showErrorStatus } = props
      const uploadFn = props.uploadMethod || getConfig().upload.uploadMethod
      if (uploadFn && item._X_DATA) {
        Promise.resolve(uploadFn({
          file,
          option: item,
          updateProgress (percentNum) {
            Object.assign(item._X_DATA || {}, { p: Math.max(0, Math.min(99, XEUtils.toNumber(percentNum))) })
          }
        })).then(res => {
          Object.assign(item._X_DATA || {}, { l: false, p: 100 })
          Object.assign(item, res)
          uploadMethods.dispatchEvent('upload-success', { option: item, data: res }, null)
        }).catch((res) => {
          Object.assign(item._X_DATA || {}, { l: false, s: 'error' })
          if (showErrorStatus) {
            Object.assign(item, res)
          } else {
            reactData.fileList = reactData.fileList.filter(obj => obj._X_DATA !== item._X_DATA)
          }
          uploadMethods.dispatchEvent('upload-error', { option: item, data: res }, null)
        })
      }
    }

    const handleReUpload = (item: VxeUploadDefines.FileObjItem) => {
      const uploadFn = props.uploadMethod || getConfig().upload.uploadMethod
      if (uploadFn && item._X_DATA) {
        const file = item._X_DATA.f
        Object.assign(item._X_DATA, {
          l: true,
          s: '',
          p: 0
        })
        handleUploadResult(item, file)
      }
    }
    const uploadFile = (files: File[], evnt: Event) => {
      const { multiple } = props
      const { fileList } = reactData
      const uploadFn = props.uploadMethod || getConfig().upload.uploadMethod
      const nameProp = computeNameProp.value
      const typeProp = computeTypeProp.value
      const urlProp = computeUrlProp.value
      const sizeProp = computeSizeProp.value
      const limitMaxSizeB = computeLimitMaxSizeB.value
      const limitMaxCount = computeLimitMaxCount.value
      const limitSizeUnit = computeLimitSizeUnit.value
      let selectFiles = files

      if (limitMaxCount) {
        // 校验文件数量
        if (fileList.length >= limitMaxCount) {
          VxeUI.modal.message({
            title: getI18n('vxe.modal.errTitle'),
            status: 'error',
            content: getI18n('vxe.upload.overCountErr', [limitMaxCount])
          })
          return
        }
        const overNum = selectFiles.length - (limitMaxCount - fileList.length)
        if (overNum > 0) {
          const overExtraList = selectFiles.slice(limitMaxCount - fileList.length)
          VxeUI.modal.message({
            title: getI18n('vxe.modal.errTitle'),
            status: 'error',
            slots: {
              default () {
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
        selectFiles = selectFiles.slice(0, limitMaxCount - fileList.length)
      }

      // 校验文件大小
      if (limitMaxSizeB) {
        for (let i = 0; i < files.length; i++) {
          const file = files[0]
          if (file.size > limitMaxSizeB) {
            if (VxeUI.modal) {
              VxeUI.modal.message({
                title: getI18n('vxe.modal.errTitle'),
                status: 'error',
                content: getI18n('vxe.upload.overSizeErr', [limitSizeUnit])
              })
            }
            return
          }
        }
      }

      const newFileList = multiple ? fileList : []
      selectFiles.forEach(file => {
        const { name } = file
        const fileObj: VxeUploadDefines.FileObjItem = {
          [nameProp]: name,
          [typeProp]: getFileType(name),
          [sizeProp]: file.size,
          [urlProp]: ''
        }
        if (uploadFn) {
          fileObj._X_DATA = {
            k: XEUtils.uniqueId(),
            f: file,
            l: true,
            s: '',
            p: 0
          }
        }
        const item = reactive(fileObj)
        if (uploadFn) {
          handleUploadResult(item, file)
        }
        newFileList.push(item)
        uploadMethods.dispatchEvent('add', { option: item }, evnt)
      })
      reactData.fileList = newFileList
      emitModel(newFileList)
    }

    const clickEvent = (evnt: MouseEvent) => {
      const { multiple, imageTypes, fileTypes } = props
      const isImage = computeIsImage.value
      readLocalFile({
        multiple,
        types: isImage ? imageTypes : fileTypes
      }).then(({ files }) => {
        uploadFile(files, evnt)
      }).catch(() => {
        // 错误文件类型
      })
    }

    const handleRemoveEvent = (evnt: MouseEvent, item: VxeUploadDefines.FileObjItem, index: number) => {
      const { fileList } = reactData
      fileList.splice(index, 1)
      emitModel(fileList)
      uploadMethods.dispatchEvent('remove', { option: item }, evnt)
    }

    const handleDragleaveEvent = (evnt: DragEvent) => {
      const elem = refElem.value
      const { clientX, clientY } = evnt
      if (elem) {
        const { x: targetX, y: targetY, height: targetHeight, width: targetWidth } = elem.getBoundingClientRect()
        if (clientX < targetX || clientX > targetX + targetWidth || clientY < targetY || clientY > targetY + targetHeight) {
          reactData.isDrag = false
        }
      }
    }

    const handleDragoverEvent = (evnt: DragEvent) => {
      const dataTransfer = evnt.dataTransfer
      if (dataTransfer) {
        const { items } = dataTransfer
        if (items && items.length) {
          evnt.preventDefault()
          reactData.isDrag = true
        }
      }
    }

    const handleDropEvent = (evnt: DragEvent) => {
      const dataTransfer = evnt.dataTransfer
      if (dataTransfer) {
        const { items } = dataTransfer
        if (items && items.length) {
          const files: File[] = []
          Array.from(items).forEach(item => {
            const file = item.getAsFile()
            if (file) {
              files.push(file)
            }
          })
          uploadFile(files, evnt)
          evnt.preventDefault()
        }
      }
      reactData.isDrag = false
    }

    const uploadPrivateMethods: UploadPrivateMethods = {
    }

    Object.assign($xeUpload, uploadMethods, uploadPrivateMethods)

    const renderAllMode = () => {
      const { buttonText, showProgress, showErrorStatus, autoHiddenButton } = props
      const { fileList } = reactData
      const defaultSlot = slots.default
      const hintSlot = slots.hint
      const nameProp = computeNameProp.value
      const typeProp = computeTypeProp.value
      const defHintText = computedDefHintText.value
      const overCount = computeOverCount.value

      return h('div', {
        key: 'all',
        class: 'vxe-upload--file-wrapper'
      }, [
        h('div', {
          class: 'vxe-upload--file-action'
        }, [
          autoHiddenButton && overCount
            ? createCommentVNode()
            : h('div', {
              class: 'vxe-upload--file-action-btn',
              onClick: clickEvent
            }, defaultSlot
              ? getSlotVNs(defaultSlot({ $upload: $xeUpload }))
              : [
                  h(VxeButtonComponent, {
                    content: buttonText ? `${buttonText}` : getI18n('vxe.upload.fileBtnText'),
                    icon: getIcon().UPLOAD_FILE_ADD
                  })
                ]),
          defHintText || hintSlot
            ? h('div', {
              class: 'vxe-upload--file-action-hint'
            }, hintSlot ? getSlotVNs(hintSlot({ $upload: $xeUpload })) : defHintText)
            : createCommentVNode()
        ]),
        h('div', {
          class: 'vxe-upload--file-list'
        }, fileList.map((item, index) => {
          const isLoading = item._X_DATA && item._X_DATA.l
          const isError = item._X_DATA && item._X_DATA.s === 'error'
          return h('div', {
            key: index,
            class: ['vxe-upload--file-item', {
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
              class: 'vxe-upload--file-item-name'
            }, `${item[nameProp] || ''}`),
            isLoading
              ? h('div', {
                class: 'vxe-upload--file-item-loading-icon'
              }, [
                h('i', {
                  class: getIcon().UPLOAD_LOADING
                })
              ])
              : createCommentVNode(),
            showProgress && isLoading && item._X_DATA
              ? h('div', {
                class: 'vxe-upload--file-item-loading-text'
              }, getI18n('vxe.upload.uploadProgress', [item._X_DATA.p]))
              : createCommentVNode(),
            showErrorStatus && isError
              ? h('div', {
                class: 'vxe-upload--image-item-error'
              }, [
                h(VxeButtonComponent, {
                  icon: getIcon().UPLOAD_IMAGE_RE_UPLOAD,
                  mode: 'text',
                  status: 'primary',
                  content: getI18n('vxe.upload.reUpload'),
                  onClick () {
                    handleReUpload(item)
                  }
                })
              ])
              : createCommentVNode(),
            !isLoading
              ? h('div', {
                class: 'vxe-upload--file-item-remove-icon',
                onClick (evnt: MouseEvent) {
                  handleRemoveEvent(evnt, item, index)
                }
              }, [
                h('i', {
                  class: getIcon().UPLOAD_FILE_DELETE
                })
              ])
              : createCommentVNode()
          ])
        }))
      ])
    }

    const renderImageMode = () => {
      const { buttonText, showProgress, showErrorStatus, autoHiddenButton } = props
      const { fileList } = reactData
      const defHintText = computedDefHintText.value
      const overCount = computeOverCount.value
      const defaultSlot = slots.default
      const hintSlot = slots.hint

      return h('div', {
        key: 'image',
        class: 'vxe-upload--image-wrapper'
      }, [
        h('div', {
          class: 'vxe-upload--image-list'
        }, fileList.map((item, index) => {
          const isLoading = item._X_DATA && item._X_DATA.l
          const isError = item._X_DATA && item._X_DATA.s === 'error'
          return h('div', {
            key: index,
            class: ['vxe-upload--image-item', {
              'is--loading': isLoading,
              'is--error': isError
            }]
          }, [
            h('div', {
              class: 'vxe-upload--image-item-box',
              onClick (evnt) {
                if (!isLoading && !isError) {
                  handlePreviewImageEvent(evnt, item, index)
                }
              }
            }, [
              isLoading && item._X_DATA
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
                    }, getI18n('vxe.upload.uploadProgress', [item._X_DATA.p]))
                    : createCommentVNode()
                ])
                : createCommentVNode(),
              !isLoading
                ? (
                    isError && showErrorStatus
                      ? h('div', {
                        class: 'vxe-upload--image-item-error'
                      }, [
                        h(VxeButtonComponent, {
                          icon: getIcon().UPLOAD_IMAGE_RE_UPLOAD,
                          mode: 'text',
                          status: 'primary',
                          content: getI18n('vxe.upload.reUpload'),
                          onClick () {
                            handleReUpload(item)
                          }
                        })
                      ])
                      : h('img', {
                        class: 'vxe-upload--image-item-img',
                        src: getFileUrl(item)
                      })
                  )
                : createCommentVNode(),
              !isLoading
                ? h('div', {
                  class: 'vxe-upload--image-item-remove-icon',
                  onClick (evnt: MouseEvent) {
                    evnt.stopPropagation()
                    handleRemoveEvent(evnt, item, index)
                  }
                }, [
                  h('i', {
                    class: getIcon().UPLOAD_IMAGE_DELETE
                  })
                ])
                : createCommentVNode()
            ])
          ])
        }).concat(autoHiddenButton && overCount
          ? []
          : [
              h('div', {
                class: 'vxe-upload--image-action'
              }, [
                h('div', {
                  class: 'vxe-upload--image-action-btn',
                  onClick: clickEvent
                }, defaultSlot
                  ? defaultSlot({ $upload: $xeUpload })
                  : [
                      h('div', {
                        class: 'vxe-upload--image-action-box'
                      }, [
                        h('div', {
                          class: 'vxe-upload--image-action-icon'
                        }, [
                          h('i', {
                            class: getIcon().UPLOAD_IMAGE_ADD
                          })
                        ]),
                        h('div', {
                          class: 'vxe-upload--image-action-content'
                        }, buttonText ? `${buttonText}` : getI18n('vxe.upload.imgBtnText')),
                        defHintText || hintSlot
                          ? h('div', {
                            class: 'vxe-upload--image-action-hint'
                          }, hintSlot ? getSlotVNs(hintSlot({ $upload: $xeUpload })) : defHintText)
                          : createCommentVNode()
                      ])
                    ])
              ])
            ]))
      ])
    }

    const renderVN = () => {
      const { showErrorStatus } = props
      const { isDrag } = reactData
      const isImage = computeIsImage.value
      return h('div', {
        ref: refElem,
        class: ['vxe-upload', {
          'show--error': showErrorStatus,
          'is--drag': isDrag
        }],
        onDragover: handleDragoverEvent,
        onDragleave: handleDragleaveEvent,
        onDrop: handleDropEvent
      }, [
        isImage ? renderImageMode() : renderAllMode(),
        isDrag
          ? h('div', {
            class: 'vxe-upload--drag-placeholder'
          }, getI18n('vxe.upload.dragPlaceholder'))
          : createCommentVNode()
      ])
    }

    $xeUpload.renderVN = renderVN

    const listFlag = ref(0)
    watch(() => props.modelValue ? props.modelValue.length : 0, () => {
      listFlag.value++
    })
    watch(() => props.modelValue, () => {
      listFlag.value++
    })
    watch(listFlag, () => {
      updateFileList()
    })

    onUnmounted(() => {
      reactData.isDrag = false
    })

    updateFileList()

    return $xeUpload
  },
  render () {
    return this.renderVN()
  }
})
