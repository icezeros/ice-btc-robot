'use strict';
const Service = require('egg').Service;
const gate = require('../extend/gateio');
const _ = require('lodash');

class SyncService extends Service {
  async ayncData() {
    const ctx = this.ctx;
    const BB = 'eos_usdt';
    const cache = ctx.app.cache;
    const tasks = [];
    tasks.push(gate.getBalances());
    tasks.push(gate.getTicker(BB));
    tasks.push(gate.openOrders());

    const [balance, ticker, orders] = await Promise.all(tasks);
    const array = [balance, ticker];
    const validate = _.find(array, { result: 'false' });
    if (validate) {
      cache.global.net = false;
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
    }
  }
}

module.exports = SyncService;
