loadScript = (scriptName) => {
  return new Promise((resolve, reject) => {
    var scriptEl = document.createElement('script');
    scriptEl.src = chrome.extension.getURL(scriptName);
    scriptEl.addEventListener('load', () => {
      resolve(true);
    }, false);
    document.head.appendChild(scriptEl);
  })
};

async function main(endpoint) {
  let dataObj = await utils.getFromURL(endPoints.priceEndPoints[endpoint].url);
  let price = utils.deepFind(dataObj, endPoints.priceEndPoints[endpoint].path);
  let previousPrice = await utils.getFromStore('IOTAUSD');
  let color;
  if (!previousPrice) { //no prevPrice - probably first run
    color = "#cc6c0f";
  } else if(price < previousPrice) {
    color = "#ad0b27";
  } else if(price === previousPrice) {
    color = "#1e0bad";
  } else if(price > previousPrice) {
    color = "#0bad20";
  }
  if (previousPrice) {
    let isWoon = (price - previousPrice)/previousPrice > config.woonBreakpoint ? true : false;
    if(isWoon) {
      chrome.browserAction.setIcon({
        path: '/images/rocket.png'
      });
    } else {
      chrome.browserAction.setIcon({
        path: '/images/icon.png',
      });
    }
  } else {
    chrome.browserAction.setIcon({
      path: '/images/icon.png'
    });
  }
  chrome.browserAction.setBadgeBackgroundColor({color: color})
  chrome.browserAction.setBadgeText({text: String(price).substr(0,6)})
  await utils.setToStore('IOTAUSD', price);
}

let utils;
let endpoint = "bitfinex";

async function tmp() {
  console.clear();
  const fiat = 'PLN';

  let xrbUsd = await utils.getCurrencyPrice('raiblocks');
  let dataObj = await utils.getFromURL(endPoints.priceEndPoints[endpoint].url);
  let iotaUsd = utils.deepFind(dataObj, endPoints.priceEndPoints[endpoint].path);

  let xrbFiat = await utils.convertFromUsdToAnother(xrbUsd, fiat);
  let iotaFiat = await utils.convertFromUsdToAnother(iotaUsd, fiat);

  const allIotaUsd = iotaUsd*2810;
  const allXrbUsd = xrbUsd*267;

  const allIotaFiat = iotaFiat*2810;
  const allXrbFiat = xrbFiat*267;

  const allInUsd = allIotaUsd + allXrbUsd;
  const allInFiat =(xrbFiat*267) + (iotaFiat*2810);

  console.log('%cCoinMarketCap', 'background: #222; color: #bada55');
  console.log(`XRB: ${xrbUsd} USD`);
  console.log(`IOTA: ${iotaUsd} USD`);
  console.log(`Summary: ${allInUsd} USD`);
  console.log(`Summary: ${allInFiat} ${fiat}`);
  console.log(`${allInUsd - (iotaUsd*3010)} USD`);
  console.log(`XRB percentage: ${allXrbUsd*100/allInUsd}% (${allXrbUsd} USD)`);
  console.log(`IOTA percentage: ${allIotaUsd*100/allInUsd}% (${allIotaUsd} USD)`);

}


(async function() {
  await loadScript('scripts/common.js');
  utils = new commonUtils();
  if (false === await utils.checkIfStoreExist()) {
    await utils.initStore();
  };
  main(endpoint);
  tmp();
  setInterval(() => {
    main(endpoint);
    tmp();
  }, 60000);
})();

