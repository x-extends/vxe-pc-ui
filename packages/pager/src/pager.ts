import { CreateElement, PropType, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getIcon, getConfig, getI18n, globalEvents, GLOBAL_EVENT_KEYS, createEvent, globalMixins } from '../../ui'
import { errLog } from '../../ui/src/log'
import VxeSelectComponent from '../../select/src/select'
import VxeInputComponent from '../../input/src/input'

import type { VxePagerPropTypes, VxePagerEmits, VxeInputDefines, VxeSelectDefines, ValueOf, VxeComponentSizeType, PagerReactData } from '../../../types'
import type { VxeGridConstructor, VxeGridPrivateMethods } from '../../../types/components/grid'

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxePager',
  mixins: [
    globalMixins.sizeMixin
  ],
  props: {
    size: {
      type: String as PropType<VxePagerPropTypes.Size>,
      default: () => getConfig().pager.size || getConfig().size
    },
    // 自定义布局
    layouts: {
      type: Array as PropType<VxePagerPropTypes.Layouts>,
      default: () => getConfig().pager.layouts || ['PrevJump', 'PrevPage', 'Jump', 'PageCount', 'NextPage', 'NextJump', 'Sizes', 'Total']
    },
    // 当前页
    currentPage: {
      type: Number as PropType<VxePagerPropTypes.CurrentPage>,
      default: 1
    },
    // 加载中
    loading: Boolean as PropType<VxePagerPropTypes.Loading>,
    // 每页大小
    pageSize: {
      type: Number as PropType<VxePagerPropTypes.PageSize>,
      default: () => getConfig().pager.pageSize || 10
    },
    // 总条数
    total: { type: Number as PropType<VxePagerPropTypes.Total>, default: 0 },
    // 显示页码按钮的数量
    pagerCount: {
      type: Number as PropType<VxePagerPropTypes.PagerCount>,
      default: () => getConfig().pager.pagerCount || 7
    },
    // 每页大小选项列表
    pageSizes: {
      type: Array as PropType<VxePagerPropTypes.PageSizes>,
      default: () => getConfig().pager.pageSizes || [10, 15, 20, 50, 100]
    },
    // 列对其方式
    align: {
      type: String as PropType<VxePagerPropTypes.Align>,
      default: () => getConfig().pager.align
    },
    // 带边框
    border: {
      type: Boolean as PropType<VxePagerPropTypes.Border>,
      default: () => getConfig().pager.border
    },
    // 带背景颜色
    background: {
      type: Boolean as PropType<VxePagerPropTypes.Background>,
      default: () => getConfig().pager.background
    },
    // 配套的样式
    perfect: {
      type: Boolean as PropType<VxePagerPropTypes.Perfect>,
      default: () => getConfig().pager.perfect
    },
    // 当只有一页时隐藏
    autoHidden: {
      type: Boolean as PropType<VxePagerPropTypes.AutoHidden>,
      default: () => getConfig().pager.autoHidden
    },
    transfer: {
      type: Boolean as PropType<VxePagerPropTypes.Transfer>,
      default: () => getConfig().pager.transfer
    },
    className: [String, Function] as PropType<VxePagerPropTypes.ClassName>,
    pageSizePlacement: {
      type: String as PropType<VxePagerPropTypes.PageSizePlacement>,
      default: () => getConfig().pager.pageSizePlacement
    },
    // 自定义图标
    iconPrevPage: String as PropType<VxePagerPropTypes.IconPrevPage>,
    iconJumpPrev: String as PropType<VxePagerPropTypes.IconJumpPrev>,
    iconJumpNext: String as PropType<VxePagerPropTypes.IconJumpNext>,
    iconNextPage: String as PropType<VxePagerPropTypes.IconNextPage>,
    iconJumpMore: String as PropType<VxePagerPropTypes.IconJumpMore>,
    iconHomePage: String as PropType<VxePagerPropTypes.IconHomePage>,
    iconEndPage: String as PropType<VxePagerPropTypes.IconEndPage>
  },
  inject: {
    $xeGrid: {
      default: null
    }
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData: PagerReactData = {
      inpCurrPage: 1
    }
    return {
      xID,
      reactData
    }
  },
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
      $xeGrid(): (VxeGridConstructor & VxeGridPrivateMethods) | null
    }),
    computePageCount (this: any) {
      const $xePager = this
      const props = $xePager

      return $xePager.getPageCount(props.total, props.pageSize)
    },
    computeNumList () {
      const $xePager = this
      const props = $xePager

      const { pagerCount } = props
      const pageCount = $xePager.computePageCount
      const len = pageCount > pagerCount ? pagerCount - 2 : pagerCount
      const rest = []
      for (let index = 0; index < len; index++) {
        rest.push(index)
      }
      return rest
    },
    computeOffsetNumber () {
      const $xePager = this
      const props = $xePager

      return Math.floor((props.pagerCount - 2) / 2)
    },
    computeSizeList () {
      const $xePager = this
      const props = $xePager

      return props.pageSizes.map((item) => {
        if (XEUtils.isNumber(item)) {
          return {
            value: item,
            label: `${getI18n('vxe.pager.pagesize', [item])}`
          }
        }
        return { value: '', label: '', ...item }
      })
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxePagerEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xePager = this
      $xePager.$emit(type, createEvent(evnt, { $pager: $xePager }, params))
    },
    homePage () {
      const $xePager = this

      $xePager.handleHomePage()
      return $xePager.$nextTick()
    },
    endPage () {
      const $xePager = this

      $xePager.handleEndPage()
      return $xePager.$nextTick()
    },
    prevPage () {
      const $xePager = this

      $xePager.handlePrevPage()
      return $xePager.$nextTick()
    },
    nextPage () {
      const $xePager = this

      $xePager.handleNextPage()
      return $xePager.$nextTick()
    },
    prevJump () {
      const $xePager = this

      $xePager.handlePrevJump()
      return $xePager.$nextTick()
    },
    nextJump () {
      const $xePager = this

      $xePager.handleNextJump()
      return $xePager.$nextTick()
    },
    jumpPage (currentPage: number) {
      const $xePager = this
      const reactData = $xePager.reactData

      const current = XEUtils.toNumber(currentPage) || 1
      reactData.inpCurrPage = current
      $xePager.changeCurrentPage(current)
      return $xePager.$nextTick()
    },
    getPageCount  (total: number, size: number) {
      return Math.max(Math.ceil(total / size), 1)
    },
    jumpPageEvent  (evnt: Event, currentPage: number) {
      const $xePager = this
      const props = $xePager

      $xePager.$emit('update:currentPage', currentPage)
      if (evnt && currentPage !== props.currentPage) {
        $xePager.dispatchEvent('page-change', { type: 'current', pageSize: props.pageSize, currentPage }, evnt)
      }
    },
    changeCurrentPage  (currentPage: number, evnt?: Event) {
      const $xePager = this
      const props = $xePager

      $xePager.$emit('update:currentPage', currentPage)
      if (evnt && currentPage !== props.currentPage) {
        $xePager.dispatchEvent('page-change', { type: 'current', pageSize: props.pageSize, currentPage }, evnt)
      }
    },
    triggerJumpEvent (params: VxeInputDefines.BlurEventParams) {
      const $xePager = this
      const reactData = $xePager.reactData

      const { $event } = params
      const inputElem: HTMLInputElement = $event.target as HTMLInputElement
      const inpValue = XEUtils.toInteger(inputElem.value)
      const pageCount = $xePager.computePageCount.value
      const current = inpValue <= 0 ? 1 : inpValue >= pageCount ? pageCount : inpValue
      const currPage = XEUtils.toValueString(current)
      inputElem.value = currPage
      reactData.inpCurrPage = currPage
      $xePager.changeCurrentPage(current, $event)
    },
    handleHomePage  (evnt?: Event) {
      const $xePager = this
      const props = $xePager

      const { currentPage } = props
      if (currentPage > 1) {
        $xePager.changeCurrentPage(1, evnt)
      }
    },
    handleEndPage  (evnt?: Event) {
      const $xePager = this
      const props = $xePager

      const { currentPage } = props
      const pageCount = $xePager.computePageCount
      if (currentPage < pageCount) {
        $xePager.changeCurrentPage(pageCount, evnt)
      }
    },
    handlePrevPage  (evnt?: Event) {
      const $xePager = this
      const props = $xePager

      const { currentPage } = props
      const pageCount = $xePager.computePageCount
      if (currentPage > 1) {
        $xePager.changeCurrentPage(Math.min(pageCount, Math.max(currentPage - 1, 1)), evnt)
      }
    },
    handleNextPage  (evnt?: Event) {
      const $xePager = this
      const props = $xePager

      const { currentPage } = props
      const pageCount = $xePager.computePageCount
      if (currentPage < pageCount) {
        $xePager.changeCurrentPage(Math.min(pageCount, currentPage + 1), evnt)
      }
    },
    handlePrevJump  (evnt?: Event) {
      const $xePager = this
      const props = $xePager

      const numList = $xePager.computeNumList
      $xePager.changeCurrentPage(Math.max(props.currentPage - numList.length, 1), evnt)
    },
    handleNextJump  (evnt?: Event) {
      const $xePager = this
      const props = $xePager

      const pageCount = $xePager.computePageCount
      const numList = $xePager.computeNumList
      $xePager.changeCurrentPage(Math.min(props.currentPage + numList.length, pageCount), evnt)
    },
    pageSizeEvent (params: VxeSelectDefines.ChangeEventParams) {
      const $xePager = this
      const props = $xePager

      const { value } = params
      const pageSize = XEUtils.toNumber(value)
      const pageCount = $xePager.getPageCount(props.total, pageSize)
      let currentPage = props.currentPage
      if (currentPage > pageCount) {
        currentPage = pageCount
        $xePager.$emit('update:currentPage', pageCount)
      }
      $xePager.$emit('update:pageSize', pageSize)
      $xePager.dispatchEvent('page-change', { type: 'size', pageSize, currentPage }, params.$event)
    },
    jumpKeydownEvent (params: VxeInputDefines.KeydownEventParams) {
      const $xePager = this

      const { $event } = params
      if (globalEvents.hasKey($event, GLOBAL_EVENT_KEYS.ENTER)) {
        $xePager.triggerJumpEvent(params)
      } else if (globalEvents.hasKey($event, GLOBAL_EVENT_KEYS.ARROW_UP)) {
        $event.preventDefault()
        $xePager.handleNextPage($event)
      } else if (globalEvents.hasKey($event, GLOBAL_EVENT_KEYS.ARROW_DOWN)) {
        $event.preventDefault()
        $xePager.handlePrevPage($event)
      }
    },

    //
    // Render
    //
    // 第一页
    renderHomePage  (h: CreateElement) {
      const $xePager = this
      const props = $xePager
      const slots = $xePager.$scopedSlots

      const { currentPage, total } = props
      const homeSlot = slots.home
      const pageCount = $xePager.computePageCount
      if (homeSlot) {
        return h('span', {
          class: 'vxe-pager--custom-home-btn'
        }, homeSlot({ $pager: $xePager, total, currentPage, pageCount }))
      }
      return h('button', {
        class: ['vxe-pager--home-btn', {
          'is--disabled': currentPage <= 1
        }],
        attrs: {
          type: 'button',
          title: getI18n('vxe.pager.homePageTitle')
        },
        on: {
          click: $xePager.handleHomePage
        }
      }, [
        h('i', {
          class: ['vxe-pager--btn-icon', props.iconHomePage || getIcon().PAGER_HOME]
        })
      ])
    },
    // 上一页
    renderPrevPage  (h: CreateElement) {
      const $xePager = this
      const props = $xePager
      const slots = $xePager.$scopedSlots

      const { currentPage, total } = props
      const prevPageSlot = slots.prevPage || slots['prev-page']
      const pageCount = $xePager.computePageCount
      if (prevPageSlot) {
        return h('span', {
          class: 'vxe-pager--custom-prev-btn'
        }, prevPageSlot({ $pager: $xePager, total, currentPage, pageCount }))
      }
      return h('button', {
        class: ['vxe-pager--prev-btn', {
          'is--disabled': currentPage <= 1
        }],
        attrs: {
          type: 'button',
          title: getI18n('vxe.pager.prevPageTitle')
        },
        on: {
          click: $xePager.handlePrevPage
        }
      }, [
        h('i', {
          class: ['vxe-pager--btn-icon', props.iconPrevPage || getIcon().PAGER_PREV_PAGE]
        })
      ])
    },
    // 向上翻页
    renderPrevJump (h: CreateElement, tagName?: string) {
      const $xePager = this
      const props = $xePager
      const slots = $xePager.$scopedSlots

      const { currentPage, total } = props
      const prevJumpSlot = slots.prevJump || slots['prev-jump']
      const pageCount = $xePager.computePageCount
      if (prevJumpSlot) {
        return h('span', {
          class: 'vxe-pager--custom-jump-prev'
        }, prevJumpSlot({ $pager: $xePager, total, currentPage, pageCount }))
      }
      return h(tagName || 'button', {
        class: ['vxe-pager--jump-prev', {
          'is--fixed': !tagName,
          'is--disabled': currentPage <= 1
        }],
        attrs: {
          type: 'button',
          title: getI18n('vxe.pager.prevJumpTitle')
        },
        on: {
          click: $xePager.handlePrevJump
        }
      }, [
        tagName
          ? h('i', {
            class: ['vxe-pager--jump-more-icon', props.iconJumpMore || getIcon().PAGER_JUMP_MORE]
          })
          : null,
        h('i', {
          class: ['vxe-pager--jump-icon', props.iconJumpPrev || getIcon().PAGER_JUMP_PREV]
        })
      ])
    },
    // 向下翻页
    renderNextJump  (h: CreateElement, tagName?: string) {
      const $xePager = this
      const props = $xePager
      const slots = $xePager.$scopedSlots

      const { currentPage, total } = props
      const nextJumpSlot = slots.nextJump || slots['next-jump']
      const pageCount = $xePager.computePageCount
      if (nextJumpSlot) {
        return h('span', {
          class: 'vxe-pager--custom-jump-next'
        }, nextJumpSlot({ $pager: $xePager, total, currentPage, pageCount }))
      }
      return h(tagName || 'button', {
        class: ['vxe-pager--jump-next', {
          'is--fixed': !tagName,
          'is--disabled': currentPage >= pageCount
        }],
        attrs: {
          type: 'button',
          title: getI18n('vxe.pager.nextJumpTitle')
        },
        on: {
          click: $xePager.handleNextJump
        }
      }, [
        tagName
          ? h('i', {
            class: ['vxe-pager--jump-more-icon', props.iconJumpMore || getIcon().PAGER_JUMP_MORE]
          })
          : null,
        h('i', {
          class: ['vxe-pager--jump-icon', props.iconJumpNext || getIcon().PAGER_JUMP_NEXT]
        })
      ])
    },
    // 下一页
    renderNextPage  (h: CreateElement) {
      const $xePager = this
      const props = $xePager
      const slots = $xePager.$scopedSlots

      const { currentPage, total } = props
      const nextPageSlot = slots.nextPage || slots['next-page']
      const pageCount = $xePager.computePageCount
      if (nextPageSlot) {
        return h('span', {
          class: 'vxe-pager--custom-next-btn'
        }, nextPageSlot({ $pager: $xePager, total, currentPage, pageCount }))
      }
      return h('button', {
        class: ['vxe-pager--next-btn', {
          'is--disabled': currentPage >= pageCount
        }],
        attrs: {
          type: 'button',
          title: getI18n('vxe.pager.nextPageTitle')
        },
        on: {
          click: $xePager.handleNextPage
        }
      }, [
        h('i', {
          class: ['vxe-pager--btn-icon', props.iconNextPage || getIcon().PAGER_NEXT_PAGE]
        })
      ])
    },
    // 最后一页
    renderEndPage  (h: CreateElement) {
      const $xePager = this
      const props = $xePager
      const slots = $xePager.$scopedSlots

      const { currentPage, total } = props
      const endSlot = slots.end
      const pageCount = $xePager.computePageCount
      if (endSlot) {
        return h('span', {
          class: 'vxe-pager--custom-end-btn'
        }, endSlot({ $pager: $xePager, total, currentPage, pageCount }))
      }
      return h('button', {
        class: ['vxe-pager--end-btn', {
          'is--disabled': currentPage >= pageCount
        }],
        attrs: {
          type: 'button',
          title: getI18n('vxe.pager.endPageTitle')
        },
        on: {
          click: $xePager.handleEndPage
        }
      }, [
        h('i', {
          class: ['vxe-pager--btn-icon', props.iconEndPage || getIcon().PAGER_END]
        })
      ])
    },
    // 页数
    renderNumber  (h: CreateElement, showJump?: boolean) {
      const $xePager = this
      const props = $xePager
      const slots = $xePager.$scopedSlots

      const { currentPage, total, pagerCount } = props
      const numberSlot = showJump ? (slots.numberJump || slots['number-jump']) : slots.number
      const nums = []
      const pageCount = $xePager.computePageCount
      const numList = $xePager.computeNumList
      const offsetNumber = $xePager.computeOffsetNumber
      const isOv = pageCount > pagerCount
      const isLt = isOv && currentPage > offsetNumber + 1
      const isGt = isOv && currentPage < pageCount - offsetNumber
      const restList: number[] = []
      let startNumber = 1

      if (isOv) {
        if (currentPage >= pageCount - offsetNumber) {
          startNumber = Math.max(pageCount - numList.length + 1, 1)
        } else {
          startNumber = Math.max(currentPage - offsetNumber, 1)
        }
      }

      if (showJump && isLt) {
        restList.push(1)
        nums.push(
          h('button', {
            class: 'vxe-pager--num-btn',
            attrs: {
              type: 'button'
            },
            on: {
              click: (evnt: Event) => $xePager.jumpPageEvent(evnt, 1)
            }
          }, '1'),
          $xePager.renderPrevJump(h, 'span')
        )
      }
      numList.forEach((item, index) => {
        const number = startNumber + index
        if (number <= pageCount) {
          restList.push(number)
          nums.push(
            h('button', {
              key: number,
              class: ['vxe-pager--num-btn', {
                'is--active': currentPage === number
              }],
              attrs: {
                type: 'button'
              },
              on: {
                click: (evnt: Event) => $xePager.jumpPageEvent(evnt, number)
              }
            }, `${number}`)
          )
        }
      })
      if (showJump && isGt) {
        restList.push(pageCount)
        nums.push(
          $xePager.renderNextJump(h, 'button'),
          h('button', {
            class: 'vxe-pager--num-btn',
            attrs: {
              type: 'button'
            },
            on: {
              click: (evnt: Event) => $xePager.jumpPageEvent(evnt, pageCount)
            }
          }, pageCount)
        )
      }
      if (numberSlot) {
        return h('span', {
          class: 'vxe-pager--custom-btn-wrapper'
        }, numberSlot({ $pager: $xePager, total, numList: restList, currentPage, pageCount }))
      }
      return h('span', {
        class: 'vxe-pager--btn-wrapper'
      }, nums)
    },
    // jumpNumber
    renderJumpNumber  (h: CreateElement) {
      const $xePager = this

      return $xePager.renderNumber(h, true)
    },
    // sizes
    renderSizes (h: CreateElement) {
      const $xePager = this
      const props = $xePager
      const slots = $xePager.$scopedSlots

      const { currentPage, total, pageSize, pageSizePlacement, transfer } = props
      const sizesSlot = slots.sizes
      const sizeList = $xePager.computeSizeList
      const pageCount = $xePager.computePageCount
      if (sizesSlot) {
        return h('span', {
          class: 'vxe-pager--custom-sizes'
        }, sizesSlot({ $pager: $xePager, total, currentPage, pageCount, pageSize, options: sizeList }))
      }
      return h(VxeSelectComponent, {
        class: 'vxe-pager--sizes',
        props: {
          value: pageSize,
          placement: pageSizePlacement,
          transfer: transfer,
          options: sizeList
        },
        on: {
          change: $xePager.pageSizeEvent
        }
      })
    },
    // Jump
    renderJump (h: CreateElement, isFull?: boolean) {
      const $xePager = this
      const props = $xePager
      const reactData = $xePager.reactData
      const slots = $xePager.$scopedSlots

      const { total } = props
      const { inpCurrPage } = reactData
      const jumpSlot = isFull ? (slots.fullJump || slots['full-jump']) : slots.jump
      const pageCount = $xePager.computePageCount
      if (jumpSlot) {
        return h('span', {
          class: 'vxe-pager--custom-jump'
        }, jumpSlot({ $pager: $xePager, total, currentPage: inpCurrPage, pageCount }))
      }
      return h('span', {
        class: 'vxe-pager--jump'
      }, [
        isFull
          ? h('span', {
            class: 'vxe-pager--goto-text'
          }, getI18n('vxe.pager.goto'))
          : null,
        h(VxeInputComponent, {
          class: 'vxe-pager--goto',
          props: {
            value: inpCurrPage,
            placeholder: getI18n('vxe.pager.gotoTitle'),
            align: 'center',
            type: 'integer',
            max: pageCount,
            min: 1,
            controls: false
          },
          on: {
            keydown: $xePager.jumpKeydownEvent,
            blur: $xePager.triggerJumpEvent,
            'modelValue' (val: string) {
              reactData.inpCurrPage = val
            }
          }
        }),
        isFull
          ? h('span', {
            class: 'vxe-pager--classifier-text'
          }, getI18n('vxe.pager.pageClassifier'))
          : null
      ])
    },
    // FullJump
    renderFullJump  (h: CreateElement) {
      const $xePager = this

      return $xePager.renderJump(h, true)
    },
    // PageCount
    renderPageCount  (h: CreateElement) {
      const $xePager = this
      const props = $xePager
      const slots = $xePager.$scopedSlots

      const { currentPage, total } = props
      const pageCountSlot = slots.pageCount || slots['page-count']
      const pageCount = $xePager.computePageCount
      if (pageCountSlot) {
        return h('span', {
          class: 'vxe-pager--custom-count'
        }, pageCountSlot({ $pager: $xePager, total, currentPage, pageCount }))
      }
      return h('span', {
        class: 'vxe-pager--count'
      }, [
        h('span', {
          class: 'vxe-pager--separator'
        }),
        h('span', pageCount)
      ])
    },
    // total
    renderTotal  (h: CreateElement) {
      const $xePager = this
      const props = $xePager
      const slots = $xePager.$scopedSlots

      const { total, currentPage } = props
      const totalSlot = slots.total
      const pageCount = $xePager.computePageCount
      if (totalSlot) {
        return h('span', {
          class: 'vxe-pager--custom-total'
        }, totalSlot({ $pager: $xePager, total, currentPage, pageCount }))
      }
      return h('span', {
        class: 'vxe-pager--total'
      }, getI18n('vxe.pager.total', [total]))
    },
    renderVN (h: CreateElement): VNode {
      const $xePager = this
      const props = $xePager
      const slots = $xePager.$scopedSlots
      const $xeGrid = $xePager.$xeGrid

      const { align, layouts, className } = props
      const childNodes = []
      const vSize = $xePager.computeSize
      const pageCount = $xePager.computePageCount
      if (slots.left) {
        childNodes.push(
          h('span', {
            class: 'vxe-pager--left-wrapper'
          }, slots.left({ $grid: $xeGrid }))
        )
      }
      layouts.forEach((name) => {
        let renderFn: (h: CreateElement) => VNode
        switch (name) {
          case 'Home':
            renderFn = $xePager.renderHomePage
            break
          case 'PrevJump':
            renderFn = $xePager.renderPrevJump
            break
          case 'PrevPage':
            renderFn = $xePager.renderPrevPage
            break
          case 'Number':
            renderFn = $xePager.renderNumber
            break
          case 'JumpNumber':
            renderFn = $xePager.renderJumpNumber
            break
          case 'NextPage':
            renderFn = $xePager.renderNextPage
            break
          case 'NextJump':
            renderFn = $xePager.renderNextJump
            break
          case 'End':
            renderFn = $xePager.renderEndPage
            break
          case 'Sizes':
            renderFn = $xePager.renderSizes
            break
          case 'FullJump':
            renderFn = $xePager.renderFullJump
            break
          case 'Jump':
            renderFn = $xePager.renderJump
            break
          case 'PageCount':
            renderFn = $xePager.renderPageCount
            break
          case 'Total':
            renderFn = $xePager.renderTotal
            break
        }
        if (renderFn) {
          childNodes.push(renderFn(h))
        } else {
          if (process.env.VUE_APP_VXE_ENV === 'development') {
            errLog('vxe.error.notProp', [`layouts -> ${name}`])
          }
        }
      })
      if (slots.right) {
        childNodes.push(
          h('span', {
            class: 'vxe-pager--right-wrapper'
          }, slots.right({ $grid: $xeGrid }))
        )
      }
      return h('div', {
        ref: 'refElem',
        class: ['vxe-pager', className ? (XEUtils.isFunction(className) ? className({ $pager: $xePager }) : className) : '', {
          [`size--${vSize}`]: vSize,
          [`align--${align}`]: align,
          'is--border': props.border,
          'is--background': props.background,
          'is--perfect': props.perfect,
          'is--hidden': props.autoHidden && pageCount === 1,
          'is--loading': props.loading
        }]
      }, [
        h('div', {
          class: 'vxe-pager--wrapper'
        }, childNodes)
      ])
    }
  },
  watch: {
    currentPage (val) {
      const $xePager = this
      const reactData = $xePager.reactData

      reactData.inpCurrPage = val
    }
  },
  created () {
    const $xePager = this
    const props = $xePager
    const reactData = $xePager.reactData

    reactData.inpCurrPage = props.currentPage
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
