import SourceMap, { VLQMap } from '@parcel/source-map'

function ensureSourceMap(map: string | VLQMap): VLQMap {
  return typeof map === 'string' ? JSON.parse(map) : map
}

export default async function remapping(sourceMapList: string[] | any[]) {
  if (sourceMapList.length === 0) {
    throw new Error('No source map found')
  } else if (sourceMapList.length === 1) {
    return ensureSourceMap(sourceMapList[0])
  }

  const last = sourceMapList[sourceMapList.length - 1]
  let mergedMap = new SourceMap()
  mergedMap.addVLQMap(ensureSourceMap(last))

  mergedMap = sourceMapList
    .slice(0, -1)
    .reduceRight((originalSourceMap: SourceMap, curr: string | VLQMap) => {
      const map = new SourceMap()
      map.addVLQMap(ensureSourceMap(curr))

      if (originalSourceMap) {
        const buf = originalSourceMap.toBuffer()
        map.extends(buf)
      }

      return map
    }, mergedMap)

  return JSON.parse((await mergedMap.stringify({})) as string)
}
