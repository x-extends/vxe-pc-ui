const fs = require('fs')

const languages = [
  'zh-CN',
  'zh-CHT',
  // 'zh-HK',
  // 'zh-MO',
  // 'zh-TW',
  'en-US',
  'ja-JP',
  'es-ES',
  'pt-BR',
  'vi-VN',
  'ru-RU',
  'ko-KR',
  'hu-HU',
  'ug-CN',
  'uz-UZ',
  'nb-NO',
  'hy-AM',
  'fr-FR',
  'de-DE',
  'ar-EG',
  'uk-UA',
  'th-TH',
  'it-IT',
  'id-ID',
  'ms-MY'
]

/**
 * 将 source 对象的属性覆盖到 target，但只覆盖 target 中已存在的属性（不添加新属性）
 * @param {Object} target - 目标对象（会被修改）
 * @param {Object} source - 源对象
 * @returns {Object} 修改后的 target 对象
 */
function deepAssignIfExists (target, source) {
  // 边界处理：非对象或 null 直接返回（不操作）
  if (!target || typeof target !== 'object') {
    return target
  }
  if (!source || typeof source !== 'object') {
    return target
  }

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        const sourceVal = source[key]
        const targetVal = target[key]

        if (sourceVal && typeof sourceVal === 'object' && !Array.isArray(sourceVal) &&
          targetVal && typeof targetVal === 'object' && !Array.isArray(targetVal)) {
          deepAssignIfExists(targetVal, sourceVal)
        } else {
          target[key] = sourceVal
        }
      }
    }
  }

  return target
}

function parseJSon (code) {
  // eslint-disable-next-line no-new-func
  const parseFn = new Function('return ' + code.replace('export default ', ''))
  return parseFn()
}

const langDir = 'packages/language'
const otherLanguages = languages.filter(key => key !== 'zh-CN')

const zhCnStr = fs.readFileSync(`${langDir}/zh-CN.ts`, 'utf-8')

otherLanguages.forEach(key => {
  const langJson = parseJSon(fs.readFileSync(`${langDir}/${key}.ts`, 'utf-8'))
  const currJson = parseJSon(zhCnStr)
  deepAssignIfExists(currJson, langJson)
  fs.writeFileSync(`${langDir}/${key}.ts`, 'export default ' + JSON.stringify(currJson, null, 2) + '\n')
})
