/*
 * @Author: icezeros
 * @Date: 2017-07-25 11:54:41
 * @Last Modified by: icezeros
 * @Last Modified time: 2017-12-06 11:58:56
 */

/*
 * @Author: hgs
 * @Date: 2017-06-12 16:00:22
 * @Last Modified by: hgs
 * @Last Modified time: 2017-06-13 14:51:24
 */
'use strict';
// const md5 = require('./app/extend/md5');
// const sha1 = require('./app/extend/sha1');
const gate = require('./app/extend/gateio');
module.exports = app => {
  app.beforeStart(async function() {
    app.logger.info(app.config.env);
    // const test = await app.redis.get('user').get('test1');
    // console.log(test);
    // const tt = await gate.orderBook('eos_btc');
    // console.log(tt);
    // const total = await gate.getBalances();
    app.cache = {
      global: {
        net: true,
      },
    };
  });
};
