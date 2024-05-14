import globalConfigStore from './globalStore'

export function getI18n (key: string, args?: any) {
  if (globalConfigStore.i18n) {
    return globalConfigStore.i18n(key, args)
  }
  return key
}
