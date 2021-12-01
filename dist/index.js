var __create = Object.create
var __defProp = Object.defineProperty
var __defProps = Object.defineProperties
var __getOwnPropDesc = Object.getOwnPropertyDescriptor
var __getOwnPropDescs = Object.getOwnPropertyDescriptors
var __getOwnPropNames = Object.getOwnPropertyNames
var __getOwnPropSymbols = Object.getOwnPropertySymbols
var __getProtoOf = Object.getPrototypeOf
var __hasOwnProp = Object.prototype.hasOwnProperty
var __propIsEnum = Object.prototype.propertyIsEnumerable
var __defNormalProp = (obj, key, value) =>
  key in obj
    ? __defProp(obj, key, {
        enumerable: true,
        configurable: true,
        writable: true,
        value,
      })
    : (obj[key] = value)
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop)) __defNormalProp(a, prop, b[prop])
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop)) __defNormalProp(a, prop, b[prop])
    }
  return a
}
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b))
var __markAsModule = (target) =>
  __defProp(target, '__esModule', { value: true })
var __export = (target, all) => {
  __markAsModule(target)
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true })
}
var __reExport = (target, module2, desc) => {
  if (
    (module2 && typeof module2 === 'object') ||
    typeof module2 === 'function'
  ) {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== 'default')
        __defProp(target, key, {
          get: () => module2[key],
          enumerable:
            !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable,
        })
  }
  return target
}
var __toModule = (module2) => {
  return __reExport(
    __markAsModule(
      __defProp(
        module2 != null ? __create(__getProtoOf(module2)) : {},
        'default',
        module2 && module2.__esModule && 'default' in module2
          ? { get: () => module2.default, enumerable: true }
          : { value: module2, enumerable: true }
      )
    ),
    module2
  )
}
__export(exports, {
  default: () => remapping,
})
var import_source_map = __toModule(require('@parcel/source-map'))
function ensureSourceMap(map) {
  return typeof map === 'string' ? JSON.parse(map) : map
}
function remapping(sourceMapList, options = {}) {
  if (sourceMapList.length === 0) throw new Error('No source map found')
  let mergedMap
  if (sourceMapList.length === 1) {
    mergedMap = new import_source_map.default()
    mergedMap.addVLQMap(ensureSourceMap(sourceMapList[0]))
  } else {
    const last = sourceMapList[sourceMapList.length - 1]
    mergedMap = new import_source_map.default()
    mergedMap.addVLQMap(ensureSourceMap(last))
    mergedMap = sourceMapList
      .slice(0, -1)
      .reduceRight((originalSourceMap, curr) => {
        const map = new import_source_map.default()
        map.addVLQMap(ensureSourceMap(curr))
        if (originalSourceMap) {
          map.extends(originalSourceMap.toBuffer())
        }
        return map
      }, mergedMap)
  }
  return {
    toBuffer: () => mergedMap.toBuffer(),
    toMap: (options2 = {}) =>
      mergedMap.stringify(
        __spreadProps(
          __spreadValues(
            {
              inlineSources: true,
            },
            options2
          ),
          {
            format: 'object',
          }
        )
      ),
    toString: (options2 = {}) =>
      mergedMap.stringify(
        __spreadProps(
          __spreadValues(
            {
              inlineSources: true,
            },
            options2
          ),
          {
            format: 'string',
          }
        )
      ),
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {})
