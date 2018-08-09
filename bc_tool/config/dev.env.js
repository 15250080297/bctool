'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  //BASE_API: '"http://localhost:8008/sc-api"',
  //BASE_API: '"http://182.92.3.98:6969/bc_mvc/api/mvc/post"',
  BASE_API: '"http://127.0.0.1:6969/bc_mvc/api/mvc/post"',

})
