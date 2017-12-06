'use strict';

const request = require('request');
const crypto = require('crypto');
const querystring = require('querystring');

// add your key and secret
const KEY = process.env.KEY;
const SECRET = process.env.SECRET;

const API_URL = 'https://data.gate.io/';
const PAIRS_URL = 'api2/1/pairs';
const MARKETINFO_URL = 'api2/1/marketinfo';
const MARKETLIST_URL = 'api2/1/marketlist';
const TICKERS_URL = 'api2/1/tickers';
const TICKER_URL = 'api2/1/ticker';
const ORDERBOOKS_URL = 'api2/1/orderBooks';
const ORDERBOOK_URL = 'api2/1/orderBook';
const TRADEHISTORY_URL = 'api2/1/tradeHistory';

const BALANCE_URL = 'api2/1/private/balances';
const DEPOSITADDRESS_URL = 'api2/1/private/depositAddress';
const DEPOSITSWITHDRAWALS_URL = 'api2/1/private/depositsWithdrawals';
const BUY_URL = 'api2/1/private/buy';
const SELL_URL = 'api2/1/private/sell';
const CANCELORDER_URL = 'api2/1/private/cancelOrder';
const CANCELALLORDERS_URL = 'api2/1/private/cancelAllOrders';
const GETORDER_URL = 'api2/1/private/getOrder';
const OPENORDERS_URL = 'api2/1/private/openOrders';
const MYTRADEHISTORY_URL = 'api2/1/private/tradeHistory';
const WITHDRAW_URL = 'api2/1/private/withdraw';

const USER_AGENT = '';

function Request(params) {
  return new Promise((resolve, reject) => {
    request(params, function(error, response, body) {
      if (error) {
        reject(error);
      } else {
        // console.log(body);
        resolve(JSON.parse(body));
      }
    });
  });
}
function getSign(form) {
  return crypto
    .createHmac('sha512', SECRET)
    .update(form)
    .digest('hex')
    .toString();
}

const gate = {
  getPairs() {
    return Request({ method: 'GET', url: API_URL + PAIRS_URL, headers: { 'User-Agent': USER_AGENT } });
  },

  getMarketinfo() {
    return Request({ method: 'GET', url: API_URL + MARKETINFO_URL, headers: { 'User-Agent': USER_AGENT } });
  },

  getMarketlist() {
    return Request({ method: 'GET', url: API_URL + MARKETLIST_URL, headers: { 'User-Agent': USER_AGENT } });
  },

  getTickers() {
    return Request({ method: 'GET', url: API_URL + TICKERS_URL, headers: { 'User-Agent': USER_AGENT } });
  },

  getTicker(param) {
    return Request({ method: 'GET', url: API_URL + TICKER_URL + '/' + param, headers: { 'User-Agent': USER_AGENT } });
  },

  orderBooks() {
    return Request({ method: 'GET', url: API_URL + ORDERBOOKS_URL, headers: { 'User-Agent': USER_AGENT } });
  },

  orderBook(param) {
    return Request({ method: 'GET', url: API_URL + ORDERBOOK_URL + '/' + param, headers: { 'User-Agent': USER_AGENT } });
  },

  tradeHistory(param) {
    return Request({ method: 'GET', url: API_URL + TRADEHISTORY_URL + '/' + param, headers: { 'User-Agent': USER_AGENT } });
  },

  getBalances() {
    const form = {};
    const header = {};
    header.KEY = KEY;
    header.SIGN = getSign(querystring.stringify(form));
    return Request({ method: 'POST', url: API_URL + BALANCE_URL, headers: header, form });
  },

  depositAddress(currency) {
    const form = { currency };
    const header = {};
    header.KEY = KEY;
    header.SIGN = getSign(querystring.stringify(form));
    console.log(header);
    console.log(querystring.stringify(form));
    console.log(API_URL + DEPOSITADDRESS_URL);
    return Request({ method: 'POST', url: API_URL + DEPOSITADDRESS_URL, headers: header, form });
  },

  depositsWithdrawals(start, end) {
    const form = { start, end };
    const header = {};
    header.KEY = KEY;
    header.SIGN = getSign(querystring.stringify(form));
    return Request({ method: 'POST', url: API_URL + DEPOSITSWITHDRAWALS_URL, headers: header, form });
  },

  buy(currencyPair, rate, amount) {
    const form = { currencyPair, rate, amount };
    const header = {};
    header.KEY = KEY;
    header.SIGN = getSign(querystring.stringify(form));
    return Request({ method: 'POST', url: API_URL + BUY_URL, headers: header, form });
  },

  sell(currencyPair, rate, amount) {
    const form = { currencyPair, rate, amount };
    const header = {};
    header.KEY = KEY;
    header.SIGN = getSign(querystring.stringify(form));
    return Request({ method: 'POST', url: API_URL + SELL_URL, headers: header, form });
  },

  cancelOrder(orderNumber, currencyPair) {
    const form = { currencyPair, orderNumber };
    const header = { 'Content-Type': 'application/x-www-form-urlencoded' };
    header.KEY = KEY;
    header.SIGN = getSign(querystring.stringify(form));
    return Request({ method: 'POST', url: API_URL + CANCELORDER_URL, headers: header, form });
  },

  cancelAllOrders(type, currencyPair) {
    const form = { currencyPair, type };
    const header = { 'Content-Type': 'application/x-www-form-urlencoded' };
    header.KEY = KEY;
    header.SIGN = getSign(querystring.stringify(form));
    return Request({ method: 'POST', url: API_URL + CANCELALLORDERS_URL, headers: header, form });
  },

  getOrder(orderNumber, currencyPair) {
    const form = { currencyPair, orderNumber };
    const header = { 'Content-Type': 'application/x-www-form-urlencoded' };
    header.KEY = KEY;
    header.SIGN = getSign(querystring.stringify(form));
    return Request({ method: 'POST', url: API_URL + GETORDER_URL, headers: header, form });
  },

  openOrders() {
    const form = {};
    const header = { 'Content-Type': 'application/x-www-form-urlencoded' };
    header.KEY = KEY;
    header.SIGN = getSign(querystring.stringify(form));
    return Request({ method: 'POST', url: API_URL + OPENORDERS_URL, headers: header, form });
  },

  myTradeHistory(currencyPair, orderNumber) {
    const form = { currencyPair, orderNumber };
    const header = { 'Content-Type': 'application/x-www-form-urlencoded' };
    header.KEY = KEY;
    header.SIGN = getSign(querystring.stringify(form));
    return Request({ method: 'POST', url: API_URL + MYTRADEHISTORY_URL, headers: header, form });
  },

  withdraw(currency, amount, address) {
    const form = { currency, amount, address };
    const header = { 'Content-Type': 'application/x-www-form-urlencoded' };
    header.KEY = KEY;
    header.SIGN = getSign(querystring.stringify(form));
    return Request({ method: 'POST', url: API_URL + WITHDRAW_URL, headers: header, form });
  },
};

module.exports = gate;
