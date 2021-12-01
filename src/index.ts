import SourceMap, {
  VLQMap,
  SourceMapStringifyOptions,
} from '@parcel/source-map'

export interface RemappingOptions {}

export interface RemappingResult {
  toBuffer: () => Buffer
  toMap: (options?: ToMapOptions) => Promise<VLQMap>
  toString: (options?: ToStringOptions) => Promise<string>
}

export interface ToStringOptions
  extends Omit<SourceMapStringifyOptions, 'format'> {}
export interface ToMapOptions
  extends Omit<SourceMapStringifyOptions, 'format'> {}

function ensureSourceMap(map: string | VLQMap): VLQMap {
  return typeof map === 'string' ? JSON.parse(map) : map
}

export default function remapping(
  sourceMapList: string[] | any[],
  options: RemappingOptions = {}
): RemappingResult {
  if (sourceMapList.length === 0) throw new Error('No source map found')

  let mergedMap: SourceMap

  if (sourceMapList.length === 1) {
    mergedMap = new SourceMap()
    mergedMap.addVLQMap(ensureSourceMap(sourceMapList[0]))
  } else {
    const last = sourceMapList[sourceMapList.length - 1]
    mergedMap = new SourceMap()
    mergedMap.addVLQMap(ensureSourceMap(last))

    mergedMap = sourceMapList
      .slice(0, -1)
      .reduceRight((originalSourceMap: SourceMap, curr: string | VLQMap) => {
        const map = new SourceMap()
        map.addVLQMap(ensureSourceMap(curr))

        if (originalSourceMap) {
          map.extends(originalSourceMap.toBuffer())
        }

        return map
      }, mergedMap)
  }

  return {
    toBuffer: () => mergedMap.toBuffer(),
    toMap: (options = {}) =>
      mergedMap.stringify({
        inlineSources: true,
        ...options,
        format: 'object',
      }) as Promise<VLQMap>,
    toString: (options = {}) =>
      mergedMap.stringify({
        inlineSources: true,
        ...options,
        format: 'string',
      }) as Promise<string>,
  }
}
