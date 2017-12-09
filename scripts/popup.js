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

let utils;

(async function() {
  let loader = document.getElementById('loader');
  await loadScript('scripts/common.js');
  utils = new iotaCommonUtils();
  let data = await utils.getFromStore("IOTAUSD");
  let currency = await utils.getFromStore("currency");
  let iotaNumber = await utils.getFromStore("iotaNumber");
  let currencysRateObj = await utils.getFromURL(`${endPoints.currencyConvertEndPoint.url}USD_${currency}`, false);
  let currencysValue = currencysRateObj[`USD_${currency}`].val;
  document.getElementById('pricePln').innerHTML = (data * currencysValue).toLocaleString(undefined, {style: 'currency', currency: currency});
  document.getElementById('priceUsd').innerHTML = (data).toLocaleString(undefined, {style: 'currency', currency: 'USD'});
  document.getElementById('sumPln').innerHTML = (iotaNumber * data * currencysValue).toLocaleString(undefined, {style: 'currency', currency: currency});
  document.getElementById('sumUsd').innerHTML = (iotaNumber * data).toLocaleString(undefined, {style: 'currency', currency: 'USD'});
  let currencyNameFields = document.getElementsByClassName('currency');
  for (a = 0; a < currencyNameFields.length; a++) {
    currencyNameFields[a].innerHTML = currency;
  };

  loader.style.opacity = 0;
  setTimeout(() => {
    loader.style.display = 'none';
  }, 1000)
})();