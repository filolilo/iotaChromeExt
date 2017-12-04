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
  await loadScript('scripts/common.js');
  utils = new iotaCommonUtils();
  let allCurrencies = await utils.getFromURL('https://free.currencyconverterapi.com/api/v5/currencies');
  let allCurrenciesList = Object.keys(allCurrencies['results']);

  let savedCurrency = await utils.getFromStore("currency");
  let savedNumber = await utils.getFromStore("iotaNumber");

  let select = document.getElementById('yourCurrency');
  let iotaNumber = document.getElementById('iotaNumber');
  let optionsForm = document.getElementById('optionsForm');

  //add options to select
  for (let a in allCurrenciesList) {
    let option = document.createElement("option");
    let currency = allCurrencies['results'][allCurrenciesList[a]];
    option.text = `${currency.currencyName} (${currency.currencySymbol})`;
    option.value = currency.id;
    if (currency.id === savedCurrency) {
      option.selected = true;
    }
    select.add(option);
  }
  if (savedNumber) {
    iotaNumber.value = savedNumber;
  }
  //loader part
  let loader = document.getElementById('loader');
  loader.style.opacity = 0;
  setTimeout(() => {
    loader.style.display = 'none';
  }, 1000)
  optionsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loader.style.opacity = 1;
    loader.style.display = 'flex';
    await utils.setToStore("currency", select.value);
    await utils.setToStore("iotaNumber", iotaNumber.value);
    loader.style.opacity = 0;
    setTimeout(() => {
      loader.style.display = 'none';
    }, 1000)
  })

  //check if submit should be enabled
  if(iotaNumber.value > 0) {
    document.getElementById('submit').disabled = false;
  }
  //check if positive number, then submit enabled
  iotaNumber.addEventListener("input", (e) => {
    if(iotaNumber.value > 0) {
      document.getElementById('submit').disabled = false;
    } else {
      document.getElementById('submit').disabled = true;
    }
  })




})();