const endPoints = {
  priceEndPoints: {
    coinmarketcap: {
      url: "https://api.coinmarketcap.com/v1/ticker/iota/?convert=USD",
      path: "0.price_usd"
    },
    bitfinex: {
      url: "https://api.bitfinex.com//v2/ticker/tIOTUSD",
      path: "6"
    }
  },
  coinsEndPoint: {
    price: {
      url: "https://api.coinmarketcap.com/v1/ticker/_COIN_/?convert=USD",
      path: "0.price_usd",
    },
    coinsList: "https://api.coinmarketcap.com/v1/ticker/"
  },
  fiatsConvertEndPoint: {
    url: "https://api.fixer.io/latest?base=USD&symbols=",
    fiatsList: "https://free.currencyconverterapi.com/api/v5/currencies"
  },
};

const config = {
  woonBreakpoint: 0.02
};

const mainKey = "iotaChromeExt";
class commonUtils {
  initStore() {
    return new Promise(async (resolve, reject) => {
      try {
        chrome.storage.sync.set({[mainKey] : {
          iotaNumber: 1,
          currency: "EUR"
        }}, () => {
          if (chrome.runtime.error) {
            console.log(chrome.runtime.lastError);
          }
          resolve(true);
        })
      }
      catch(err) {
        reject(err);
      }
    })
  };
  checkIfStoreExist() {
    return new Promise(async (resolve, reject) => {
      try {
        chrome.storage.sync.get([mainKey], (data) => {
          for (let x in data) {
            resolve(true);
          }
          resolve(false);
        })
      }
      catch(err) {
        reject(err);
      }
    })
  };
  getAllFromStore() {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.sync.get([mainKey], (data) => {
          resolve(data[mainKey]);
        })
      }
      catch(err) {
        console.log(err)
      }
    })
  }
  setToStore(key, value) {
    return new Promise(async (resolve, reject) => {
      try {
        let allData = await this.getAllFromStore();
        chrome.storage.sync.set({[mainKey] : {...allData, [key]: value}}, () => {
          if (chrome.runtime.error) {
            console.log(chrome.runtime.lastError);
          }
          resolve(true);
        })
      }
      catch(err) {
        reject(err);
      }
    })
  }
  getFromStore(key) {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.sync.get([mainKey], (data) => {
          resolve(data[mainKey][key]);
        })
      }
      catch(err) {
        reject(err);
      }
    })
  }
  getFromURL(url) {
    return new Promise((resolve, reject) => {
      var req = new XMLHttpRequest();
      req.open('GET', url, true);
      req.responseType = 'json';
      req.onload = function() {
        if (req.status == 200) {
          resolve(req.response);
        }
        else {
          reject(Error(req.statusText));
        }
      };
      req.onerror = function() {
        reject(Error("Network Error"));
      };
      req.send();
    })
  };
  deepFind(obj, path) {
    var paths = path.split('.')
      , current = obj
      , i;

    for (i = 0; i < paths.length; ++i) {
      if (current[paths[i]] == undefined) {
        return undefined;
      } else {
        current = current[paths[i]];
      }
    }
    return current;
  }
  async getCurrencyPrice(coin) {
    const url = endPoints.coinsEndPoint.price.url.replace("_COIN_", coin);
    let coinData = await utils.getFromURL(url);
    return utils.deepFind(coinData, endPoints.coinsEndPoint.price.path);
  }

  async convertFromUsdToAnother(usdPrice, fiat) {
    let currencysRateObj = await utils.getFromURL(`${endPoints.fiatsConvertEndPoint.url}${fiat}`);
    return usdPrice * currencysRateObj.rates[fiat];
  }
};



