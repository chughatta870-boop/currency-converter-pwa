const amountEl = document.getElementById('amount');
const fromCurrencyEl = document.getElementById('fromCurrency');
const toCurrencyEl = document.getElementById('toCurrency');
const convertBtn = document.getElementById('convertBtn');
const swapBtn = document.getElementById('swapBtn');
const resultEl = document.getElementById('result');
const rateEl = document.getElementById('rate');

const API_URL = 'https://api.exchangerate-api.com/v4/latest/';

let currencies = [];
let rates = {};

// Load currencies
async function loadCurrencies() {
  try {
    const res = await fetch(API_URL + 'USD');
    const data = await res.json();
    rates = data.rates;
    currencies = Object.keys(rates);

    currencies.forEach(currency => {
      const option1 = new Option(currency, currency);
      const option2 = new Option(currency, currency);
      fromCurrencyEl.add(option1);
      toCurrencyEl.add(option2);
    });

    fromCurrencyEl.value = 'USD';
    toCurrencyEl.value = 'PKR';
    convert();
  } catch (error) {
    resultEl.innerText = "Error loading rates";
  }
}

function convert() {
  const amount = amountEl.value;
  const from = fromCurrencyEl.value;
  const to = toCurrencyEl.value;

  if (!amount || amount <= 0) return;

  // Convert via USD base
  const fromRate = rates[from];
  const toRate = rates[to];
  const converted = (amount / fromRate) * toRate;

  resultEl.innerText = `${amount} ${from} = ${converted.toFixed(2)} ${to}`;
  rateEl.innerText = `1 ${from} = ${(toRate / fromRate).toFixed(4)} ${to} | Updated: ${new Date().toLocaleDateString()}`;
}

// Swap currencies
swapBtn.addEventListener('click', () => {
  const temp = fromCurrencyEl.value;
  fromCurrencyEl.value = toCurrencyEl.value;
  toCurrencyEl.value = temp;
  convert();
});

convertBtn.addEventListener('click', convert);
amountEl.addEventListener('input', convert);
fromCurrencyEl.addEventListener('change', convert);
toCurrencyEl.addEventListener('change', convert);

// PWA Service Worker Register
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}

loadCurrencies();
