import fs from 'fs'
import path from 'path'

import esbuild from 'esbuild'
import terser from 'terser'

import remapping from '../src'
;(async () => {
  const code = fs.readFileSync(
    path.resolve(__dirname, '../benchmark/fixtures/antd/antd.js'),
    'utf8'
  )
  const transformedMap = fs.readFileSync(
    path.resolve(__dirname, '../benchmark/fixtures/antd/antd.js.map'),
    'utf8'
  )

  const minifyResult = await terser.minify(code, {
    sourceMap: {
      includeSources: false,
    },
  })

  for (let i = 0; i < 100; i++) {
    await remapping([minifyResult.map, transformedMap])
  }

  console.info('antd profiled')
})()
;(async () => {
  const code = fs.readFileSync(
    path.resolve(__dirname, '../benchmark/fixtures/threejs/three.module.js'),
    'utf8'
  )

  const { map: transformedMap, code: transformedCode } = esbuild.transformSync(
    code,
    {
      sourcefile: path.resolve(
        __dirname,
        '../benchmark/fixtures/threejs/three.module.js'
      ),
      sourcemap: true,
      loader: 'ts',
      format: 'cjs',
    }
  )

  const minifyResult = await terser.minify(transformedCode, {
    sourceMap: {
      includeSources: false,
    },
  })

  for (let i = 0; i < 100; i++) {
    await remapping([minifyResult.map, transformedMap])
  }

  console.info('threejs profiled')
})()
