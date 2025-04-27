const API_KEY = "46b962e98751dc156e159fb9"; // Your API key from ExchangeRate-API
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`; // Correct ExchangeRate-API URL

// Function to toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}

// Function to populate the currencies in the dropdowns
async function populateCurrencies() {
    const response = await fetch(API_URL);
    const data = await response.json();
    const currencies = Object.keys(data.conversion_rates);
    const fromCurrencySelect = document.getElementById("from-currency");
    const toCurrencySelect = document.getElementById("to-currency");

    currencies.forEach(currency => {
        const optionFrom = document.createElement("option");
        optionFrom.value = currency;
        optionFrom.innerText = `${currency} - ${currencySymbol(currency)}`;
        fromCurrencySelect.appendChild(optionFrom);

        const optionTo = document.createElement("option");
        optionTo.value = currency;
        optionTo.innerText = `${currency} - ${currencySymbol(currency)}`;
        toCurrencySelect.appendChild(optionTo);
    });
}

// Function to get currency symbol
function currencySymbol(currency) {
    const symbols = {
        "USD": "$",
        "EUR": "€",
        "GBP": "£",
        "INR": "₹",
        "AUD": "A$",
    };
    return symbols[currency] || currency;
}

// Convert function
async function convertCurrency() {
    const amount = document.getElementById("amount").value;
    const fromCurrency = document.getElementById("from-currency").value;
    const toCurrency = document.getElementById("to-currency").value;

    if (!amount || isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount!");
        return;
    }

    document.getElementById("loading").style.display = "block";
    document.getElementById("error").style.display = "none";

    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (!data.conversion_rates) {
            throw new Error("Unable to fetch conversion rates.");
        }

        const fromRate = data.conversion_rates[fromCurrency];
        const toRate = data.conversion_rates[toCurrency];

        const convertedAmount = (amount * toRate) / fromRate;
        document.getElementById("result").innerText = `Converted Amount: ${currencySymbol(toCurrency)}${convertedAmount.toFixed(2)}`;

    } catch (error) {
        document.getElementById("error").style.display = "block";
        document.getElementById("result").innerText = "Converted Amount: ";
    } finally {
        document.getElementById("loading").style.display = "none";
    }
}

populateCurrencies();


document.getElementById("convert-btn").addEventListener("click", convertCurrency);

document.getElementById("darkModeToggle").addEventListener("click", toggleDarkMode);
