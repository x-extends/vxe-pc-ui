const fs = require('fs').promises
const path = require('path')

/**
 * 将 source 对象的属性覆盖到 target，但只覆盖 target 中已存在的属性（不添加新属性）
 */
function deepAssignIfExists (target, source) {
  if (!target || typeof target !== 'object') return target
  if (!source || typeof source !== 'object') return target

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key) && Object.prototype.hasOwnProperty.call(target, key)) {
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
  return target
}

// 解析 TS 文件中 export default 的内容
function parseTS (code) {
  // eslint-disable-next-line no-new-func
  return new Function('return ' + code.replace('export default ', ''))()
}

async function main () {
  const langDir = 'packages/language'

  // 自动遍历目录，提取文件名（不含后缀）作为语言标识
  const files = await fs.readdir(langDir)
  const languages = files.map(file => file.replace(/\.ts$/, ''))
  const otherLanguages = languages.filter(key => key !== 'zh-CN')

  // 读取中文基准文件（只需读取一次）
  const zhCnStr = await fs.readFile(path.join(langDir, 'zh-CN.ts'), 'utf-8')

  // 异步并发同步所有其他语言
  await Promise.all(otherLanguages.map(async (key) => {
    const langJson = parseTS(await fs.readFile(path.join(langDir, `${key}.ts`), 'utf-8'))
    const currJson = parseTS(zhCnStr)

    deepAssignIfExists(currJson, langJson)

    await fs.writeFile(
      path.join(langDir, `${key}.ts`),
      'export default ' + JSON.stringify(currJson, null, 2) + '\n'
    )
  }))

  console.log(`成功同步 ${otherLanguages.length} 个文件`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
