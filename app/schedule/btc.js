'use strict';
const Subscription = require('egg').Subscription;
const gate = require('../extend/gateio');
const _ = require('lodash');
const moment = require('moment');
moment().locale('cn');
class BTC extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: '15s', // 1 分钟间隔
      type: 'worker', // 指定所有的 worker 都需要执行
      immediate: true, // 启动时是否立即执行
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    const ctx = this.ctx;
    const BB = 'eos_usdt';

    const cache = this.ctx.app.cache;
    // const res = await this.ctx.curl('http://www.api.com/cache', {
    //   dataType: 'json',
    // });

    const tasks = [];
    tasks.push(gate.getBalances());
    tasks.push(gate.getTicker(BB));
    tasks.push(gate.openOrders());
    // tasks.push(gate.orderBook(BB));

    const [balance, ticker, orders] = await Promise.all(tasks);
    const array = [balance, ticker];
    const validate = _.find(array, { result: 'false' });
    if (validate) {
      cache.global.net = false;
      console.log('==============================');
      console.log('***********ERR****************');
      console.log('==============================');

      return;
    }
    const filterOrders = _.filter(orders.orders, order => {
      return order.currencyPair === BB;
    });
    cache.balance = balance;
    cache.ticker = ticker;
    cache.orders = filterOrders;
    // const
    const usdt =
      parseFloat(cache.balance.available.USDT) + !cache.balance.locked || !cache.balance.locked.USDT || parseFloat(cache.balance.locked.USDT);
    const bb = parseFloat(cache.balance.available.EOS) * parseFloat(this.app.cache.ticker.last) || 0;
    // const decision =
    const decision = this.decision(usdt, bb);
    const amount = this.getAmount(usdt, bb);
    const price = this.getPrice();
    console.log(moment().format('LLLL'));
    console.log('usdt, bb', usdt, bb);

    // console.log('decision', decision);
    // console.log('amount', amount);
    // console.log('price', price);

    if (decision === 'buy') {
      const cancResult = await this.cancelAllOrders(BB);
      console.log('==========cancResult============', cancResult);
      const buyResult = await gate.buy(BB, price, (amount - 0.1) / parseFloat(this.app.cache.ticker.last));
      console.log(
        '(BB, price, (amount - 0.1)/parseFloat(this.app.cache.ticker.last)',
        BB,
        price,
        (amount - 0.1) / parseFloat(this.app.cache.ticker.last),
        buyResult
      );
    }

    if (decision === 'sell') {
      const cancResult = await this.cancelAllOrders(BB);
      console.log('==========cancResult============', cancResult);

      const sellResult = await gate.sell(BB, price, (amount - 0.1) / parseFloat(this.app.cache.ticker.last));
      console.log(
        '(BB, price, (amount - 0.1)/parseFloat(this.app.cache.ticker.last)',
        BB,
        price,
        (amount - 0.1) / parseFloat(this.app.cache.ticker.last),
        sellResult
      );
      // console.log(sellResult, '');
    }

    // cache.tt = tt;
    this.ctx.logger.info('***********************');
    // this.ctx.logger.info(cache);

    console.log(decision);
  }
  decision(usdt, bb) {
    console.log('usdt, bb', usdt, bb);

    if (bb > usdt * 1.05) {
      return 'sell';
    }

    if (bb < usdt * 0.95) {
      return 'buy';
    }

    return 'normal';
  }

  getAmount(usdt, bb) {
    return Math.abs(usdt - bb) / 2;
  }
  getPrice() {
    return parseFloat(this.app.cache.ticker.last);
  }

  async cancelAllOrders(BB) {
    return gate.cancelAllOrders(-1, BB);
  }
}

module.exports = BTC;
