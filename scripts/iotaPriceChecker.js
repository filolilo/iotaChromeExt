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
  let data = await utils.getFromURL(endPoints.priceEnPoints[endpoint].url);
  let dataObj = data;
  let price = utils.deepFind(dataObj, endPoints.priceEnPoints[endpoint].path);
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
  chrome.browserAction.setBadgeBackgroundColor({color: color})
  chrome.browserAction.setBadgeText({text: String(price).substr(0,6)})
  await utils.setToStore('IOTAUSD', price);
}

let utils;
let endpoint = "bitfinex";

(async function() {
  await loadScript('scripts/common.js');
  utils = new iotaCommonUtils();
  if (false === await utils.checkIfStoreExist()) {
    await utils.initStore();
  };
  main(endpoint);
  setInterval(() => main(endpoint), 60000);
})();

