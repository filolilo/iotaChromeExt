const endPoints = {
  priceEnPoints: {
    coinmarketcap: {
      url: "https://api.coinmarketcap.com/v1/ticker/iota/?convert=USD",
      path: "0.price_usd"
    },
    bitfinex: {
      url: "https://api.bitfinex.com//v2/ticker/tIOTUSD",
      path: "6"
    }
  },
  currencyConvertEndPoint: {
    url: "https://free.currencyconverterapi.com/api/v5/convert?compact=y&q=",
    currencysList: "https://free.currencyconverterapi.com/api/v5/currencies"
  }
}

const mainKey = "iotaChromeExt";
class iotaCommonUtils {
  initStore() {
    return new Promise(async (resolve, reject) => {
      try {
        chrome.storage.sync.set({[mainKey] : {
          iotaNumber: 1,
          currency: "EUR"
        }}, () => {
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
}


