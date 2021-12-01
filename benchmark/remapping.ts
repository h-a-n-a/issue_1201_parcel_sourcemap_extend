import fs from 'fs'
import path from 'path'

import { Suite, Deferred } from 'benchmark'
import esbuild from 'esbuild'
import chalk from 'chalk'
import terser from 'terser'

import ampRemapping from '@ampproject/remapping'
import mergeSourceMap from 'merge-source-map'

import remapping from '../src'

const asyncTest = (fn) => ({
  defer: true,
  fn: async (defer: Deferred) => {
    await fn()
    defer.resolve()
  },
})

;(async () => {
  const suite = new Suite('`antd(5.9MB)` with terser includeSources `false`')
  const code = fs.readFileSync(
    path.resolve(__dirname, './fixtures/antd/antd.js'),
    'utf8'
  )
  const transformedMap = fs.readFileSync(
    path.resolve(__dirname, './fixtures/antd/antd.js.map'),
    'utf8'
  )

  const minifyResult = await terser.minify(code, {
    sourceMap: {
      includeSources: false,
    },
  })

  suite
    .add(
      'antd#remapping',
      asyncTest(async () => {
        await remapping([minifyResult.map, transformedMap])
      })
    )
    .add('antd#@ampproject/remapping', () => {
      ampRemapping([minifyResult.map, transformedMap] as any[], () => null)
    })
    .add('antd#merge-source-map', () => {
      mergeSourceMap(transformedMap, minifyResult.map)
    })
    .on('cycle', function (event: Event) {
      console.info(String(event.target))
    })
    .on('complete', function (this: any) {
      console.info(
        `${this.name} bench suite: Fastest is ${chalk.green(
          this.filter('fastest').map('name')
        )}\n\n`
      )
    })
    .run()
})()
;(async () => {
  const suite = new Suite(
    '`three.js module(1.2MB)` with terser includeSources `false`'
  )

  const code = fs.readFileSync(
    path.resolve(__dirname, './fixtures/threejs/three.module.js'),
    'utf8'
  )

  const { map: transformedMap, code: transformedCode } = esbuild.transformSync(
    code,
    {
      sourcefile: path.resolve(__dirname, './fixtures/threejs/three.module.js'),
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

  suite
    .add(
      'three#remapping',
      asyncTest(async () => {
        await remapping([minifyResult.map, transformedMap])
      })
    )
    .add('three#@ampproject/remapping', () => {
      ampRemapping([minifyResult.map, transformedMap] as any[], () => null)
    })
    .add('three#merge-source-map', () => {
      mergeSourceMap(transformedMap, minifyResult.map)
    })
    .on('cycle', function (event: Event) {
      console.info(String(event.target))
    })
    .on('complete', function (this: any) {
      console.info(
        `${this.name} bench suite: Fastest is ${chalk.green(
          this.filter('fastest').map('name')
        )}\n\n`
      )
    })
    .run()
})()
;(async () => {
  const suite = new Suite('`remapping` with terser includeSources `false`')
  const code = fs.readFileSync(
    path.resolve(__dirname, '../src/index.ts'),
    'utf8'
  )

  const { map: transformedMap, code: transformedCode } = esbuild.transformSync(
    code,
    {
      sourcefile: 'src/index.ts',
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

  suite
    .add(
      'remapping#remapping',
      asyncTest(async () => {
        await remapping([minifyResult.map, transformedMap])
      })
    )
    .add('remapping#@ampproject/remapping', () => {
      ampRemapping([minifyResult.map, transformedMap] as any[], () => null)
    })
    .add('remapping#merge-source-map', () => {
      mergeSourceMap(transformedMap, minifyResult.map)
    })
    .on('cycle', function (event: Event) {
      console.info(String(event.target))
    })
    .on('complete', function (this: any) {
      console.info(
        `${this.name} bench suite: Fastest is ${chalk.green(
          this.filter('fastest').map('name')
        )}\n\n`
      )
    })
    .run()
})()
