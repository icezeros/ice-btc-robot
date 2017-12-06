'use strict';

// npm run dev DO NOT read this file

require('egg').startCluster({
  baseDir: __dirname,
  port: process.env.PORT || 6000, // default to 7001
});
