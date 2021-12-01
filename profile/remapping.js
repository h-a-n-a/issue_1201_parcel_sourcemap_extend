const fs = require('fs')
const path = require('path')

const remapping = require('../dist').default

;(async () => {
  const transformedMap = fs.readFileSync(
    path.resolve(__dirname, '../benchmark/fixtures/antd/antd.js.map'),
    'utf8'
  )
  const minifiedMap = fs.readFileSync(
    path.resolve(__dirname, '../benchmark/fixtures/antd/antd.min.js.map'),
    'utf8'
  )

  for (let i = 0; i < 200; i++) {
    await remapping([minifiedMap, transformedMap]).toMap()
  }

  console.info('antd profiled')
})()
