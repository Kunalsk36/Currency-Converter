// DOM Elements
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const amountInput = document.getElementById("amount");
const amountError = document.getElementById("amountError");
const resultContainer = document.getElementById("resultContainer");
const resultDiv = document.getElementById("result");
const errorContainer = document.getElementById("errorContainer");
const loader = document.getElementById("loader");
const themeToggle = document.getElementById("themeToggle");
const html = document.documentElement;

// Populate dropdowns with currencies
async function initCurrencies() {
  try {
    const response = await fetch("/api/currencies");
    const data = await response.json();

    if (data.success) {
      fromCurrency.innerHTML = "";
      toCurrency.innerHTML = "";

      data.currencies.forEach((currency) => {
        const option1 = document.createElement("option");
        option1.value = currency;
        option1.textContent = currency;

        const option2 = document.createElement("option");
        option2.value = currency;
        option2.textContent = currency;

        fromCurrency.appendChild(option1);
        toCurrency.appendChild(option2);
      });

      // Set default selections
      fromCurrency.value = "USD";
      toCurrency.value = "INR";
    } else {
      console.error("⚠ Failed to fetch currencies from server.");
      fallbackCurrencies();
    }
  } catch (error) {
    console.error("❌ Error fetching currencies:", error);
    fallbackCurrencies();
  }
}

// Fallback hardcoded currencies (if API fails)
function fallbackCurrencies() {
  const fallback = ["USD", "EUR", "INR", "JPY", "GBP", "AUD", "CAD", "CNY", "NZD", "CHF"];
  fromCurrency.innerHTML = "";
  toCurrency.innerHTML = "";

  fallback.forEach((currency) => {
    const option1 = document.createElement("option");
    option1.value = currency;
    option1.textContent = currency;

    const option2 = document.createElement("option");
    option2.value = currency;
    option2.textContent = currency;

    fromCurrency.appendChild(option1);
    toCurrency.appendChild(option2);
  });

  fromCurrency.value = "USD";
  toCurrency.value = "INR";
}

// Convert currency
async function convertCurrency(from, to, amount) {
  resultContainer.classList.add("hidden");
  errorContainer.classList.add("hidden");
  loader.classList.remove("hidden");

  try {
    const response = await fetch(`/api/convert?from=${from}&to=${to}&amount=${amount}`);
    const data = await response.json();

    loader.classList.add("hidden");

    if (data.result === "success") {
      resultDiv.textContent = `${amount} ${from} = ${data.conversion_result.toFixed(2)} ${to}`;
      resultContainer.classList.remove("hidden");
      resultContainer.classList.add("opacity-0");
      setTimeout(() => {
        resultContainer.classList.replace("opacity-0", "opacity-100");
      }, 50);
    } else {
      console.error("❌ Conversion failed:", data.error);
      showError();
    }
  } catch (error) {
    console.error("❌ Error during conversion:", error);
    loader.classList.add("hidden");
    showError();
  }
}

// Show error container
function showError() {
  errorContainer.classList.remove("hidden");
  errorContainer.classList.add("opacity-0");
  setTimeout(() => {
    errorContainer.classList.replace("opacity-0", "opacity-100");
  }, 50);
}

// Handle form submission
document.getElementById("converterForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const amount = parseFloat(amountInput.value);

  if (isNaN(amount) || amount <= 0) {
    amountError.classList.remove("hidden");
    return;
  }

  amountError.classList.add("hidden");
  convertCurrency(fromCurrency.value, toCurrency.value, amount);
});

// Theme toggle (light/dark mode)
themeToggle.addEventListener("click", () => {
  html.classList.toggle("dark");
  themeToggle.textContent = html.classList.contains("dark") ? "☀️" : "🌙";
});

// Initialize dropdowns
initCurrencies();
