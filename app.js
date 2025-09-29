const OPENWEATHER_API_KEY = '20e877181ba8c333fb3663c3eb988bbc';

const cityInput = document.getElementById('city-input');
const fetchButton = document.getElementById('fetch-pollution-btn');
const modal = document.getElementById('air-quality-modal');
const closeModalBtn = modal.querySelector('.close-btn');
const aqiValueEl = document.getElementById('aqi-value');
const aqiStatusEl = document.getElementById('aqi-status');
const pollutantsEl = document.getElementById('pollutants');
const healthAdviceEl = document.getElementById('health-advice');
const carbonTipEl = document.getElementById('carbon-tip');

closeModalBtn.addEventListener('click', () => {
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
});

const AQI_CATEGORIES = {
  1: { label: "Good", className: "aqi-category-good", advice: "Air quality is considered satisfactory, and air pollution poses little or no risk." },
  2: { label: "Fair", className: "aqi-category-moderate", advice: "Air quality is acceptable; sensitive groups should take precautions." },
  3: { label: "Moderate", className: "aqi-category-unhealthy-sensitive", advice: "Sensitive groups may experience health effects. General public unlikely affected." },
  4: { label: "Poor", className: "aqi-category-unhealthy", advice: "Everyone may experience health effects; sensitive groups more serious." },
  5: { label: "Very Poor", className: "aqi-category-hazardous", advice: "Health warnings of emergency conditions. Entire population more likely affected." }
};

const carbonReductionTips = [
  "Switch to renewable energy sources like solar or wind.",
  "Reduce meat consumption to lower your carbon footprint.",
  "Use public transportation, carpool, bike, or walk instead of driving alone.",
  "Unplug electronics when not in use to save energy.",
  "Shop locally and seasonally to reduce transportation emissions.",
  "Plant trees or support reforestation projects to offset carbon emissions.",
  "Reduce, reuse, and recycle materials to minimize waste.",
  "Use energy-efficient appliances and light bulbs.",
  "Maintain your vehicle for better fuel efficiency.",
  "Avoid single-use plastics and bring reusable bags."
];

function createPollutantElement(name, value, unit) {
  const el = document.createElement('div');
  el.className = 'pollutant';
  el.innerHTML = `<strong>${name}</strong>${value} ${unit}`;
  return el;
}

function getRandomCarbonTip() {
  const idx = Math.floor(Math.random() * carbonReductionTips.length);
  return carbonReductionTips[idx];
}

async function fetchAirQualityData(city) {
  if (!city) return;

  aqiValueEl.textContent = '--';
  aqiStatusEl.textContent = 'Fetching air quality data...';
  pollutantsEl.innerHTML = '';
  healthAdviceEl.textContent = '';
  carbonTipEl.textContent = '';
  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');

  try {
    const geoResponse = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${OPENWEATHER_API_KEY}`
    );
    const geoData = await geoResponse.json();
    if (!geoData.length) throw new Error('City not found');

    const { lat, lon } = geoData[0];

    const aqiResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`
    );
    if (!aqiResponse.ok) throw new Error('Failed to fetch air pollution data');

    const aqiData = await aqiResponse.json();
    if (!aqiData.list || !aqiData.list.length) throw new Error('No air quality data available');

    const details = aqiData.list[0];
    const aqi = details.main.aqi;
    const category = AQI_CATEGORIES[aqi] || { label: "Unknown", className: "", advice: "" };

    aqiValueEl.textContent = aqi;
    aqiStatusEl.textContent = category.label;
    aqiStatusEl.className = 'aqi-status ' + category.className;

    pollutantsEl.innerHTML = '';
    const components = details.components;
    const pollutantsOrder = ['pm2_5', 'pm10', 'co', 'no', 'no2', 'o3', 'so2'];

    pollutantsOrder.forEach((key) => {
      if (components[key] !== undefined) {
        let displayName = key.toUpperCase().replace('_', '.');
        if (key === 'pm2_5') displayName = 'PM2.5';
        if (key === 'pm10') displayName = 'PM10';
        if (key === 'co') displayName = 'CO';
        if (key === 'no') displayName = 'NO';
        if (key === 'no2') displayName = 'NO₂';
        if (key === 'o3') displayName = 'O₃';
        if (key === 'so2') displayName = 'SO₂';

        pollutantsEl.appendChild(createPollutantElement(displayName, components[key].toFixed(2), 'μg/m³'));
      }
    });

    healthAdviceEl.textContent = category.advice;

    // Show random carbon reduction tip
    carbonTipEl.textContent = "🌱 Tip: " + getRandomCarbonTip();

  } catch (error) {
    aqiValueEl.textContent = '--';
    aqiStatusEl.textContent = 'Failed to fetch data';
    pollutantsEl.innerHTML = '';
    healthAdviceEl.textContent = '';
    carbonTipEl.textContent = '';
    alert('Error: ' + error.message);
  }
}

fetchButton.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (!city) {
    alert('Please enter a city name.');
    return;
  }
  fetchAirQualityData(city);
});

// --- CARBON FOOTPRINT SECTION ---

const conversionFactors = {
  transport: 0.21,
  electricity: 0.43,
  diet: 2.0,
  flight: 0.19,
  heating: 0.2,
  waste: 0.5,
  shopping: 1.5,
};

let activities = [];
let userGoal = 0;

const totalFootprintEl = document.getElementById('total-footprint');
const historyListEl = document.getElementById('history-list');
const footprintForm = document.getElementById('footprint-form');
const goalForm = document.getElementById('goal-form');
const goalAmountEl = document.getElementById('goal-amount');
const progressBarFillEl = document.getElementById('progress-bar-fill');
const footprintCardEl = document.getElementById('footprint-card');

function showMessageModal(title, body) {
  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
  aqiValueEl.textContent = '';
  aqiStatusEl.textContent = title;
  aqiStatusEl.className = "aqi-status aqi-category-good";
  pollutantsEl.innerHTML = `<p>${body}</p>`;
  healthAdviceEl.textContent = '';
  carbonTipEl.textContent = '';
}

function updateProgressBar(total, goal) {
  if (goal > 0) {
    let percentage = (total / goal) * 100;
    percentage = Math.min(percentage, 100);
    progressBarFillEl.style.width = percentage + '%';
    if (total >= goal) {
      footprintCardEl.classList.add('animate-pulse-on-success');
    } else {
      footprintCardEl.classList.remove('animate-pulse-on-success');
    }
  } else {
    progressBarFillEl.style.width = '0%';
    footprintCardEl.classList.remove('animate-pulse-on-success');
  }
}

function renderHistory() {
  historyListEl.innerHTML = '';
  if (activities.length === 0) {
    historyListEl.innerHTML = '<p class="text-gray-500">No activities logged yet.</p>';
    return;
  }
  activities.forEach((activity, index) => {
    const activityEl = document.createElement('div');
    activityEl.innerHTML = `
      <div>
        <strong>${activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}</strong>: ${activity.amount} 
        (${activity.co2.toFixed(2)} kg CO₂)
      </div>
      <button class="delete-btn" aria-label="Delete activity ${index + 1}" data-index="${index}" style="background:transparent; border:none; color:#dc2626; cursor:pointer; font-size:1.25rem;">&times;</button>
    `;
    activityEl.style.display = "flex";
    activityEl.style.justifyContent = "space-between";
    activityEl.style.alignItems = "center";
    activityEl.style.padding = "0.3rem 0.6rem";
    activityEl.style.borderRadius = "0.5rem";
    activityEl.style.backgroundColor = "#f9fafb";
    activityEl.addEventListener('mouseenter', () => activityEl.style.backgroundColor = "#e0f2fe");
    activityEl.addEventListener('mouseleave', () => activityEl.style.backgroundColor = "#f9fafb");
    historyListEl.appendChild(activityEl);
  });
}

function updateTotalFootprint() {
  const total = activities.reduce((sum, a) => sum + a.co2, 0);
  totalFootprintEl.textContent = total.toFixed(2);
  updateProgressBar(total, userGoal);
}

footprintForm.addEventListener('submit', e => {
  e.preventDefault();
  const type = document.getElementById('activity-type').value;
  const amount = parseFloat(document.getElementById('activity-amount').value);
  if (amount <= 0 || isNaN(amount)) {
    showMessageModal("Invalid Input", "Please enter a valid amount greater than zero.");
    return;
  }
  const co2 = amount * (conversionFactors[type] || 0);
  activities.push({ type, amount, co2 });
  footprintForm.reset();
  renderHistory();
  updateTotalFootprint();
  showMessageModal("Success!", "Activity logged successfully. Keep reducing your footprint!");
});

goalForm.addEventListener('submit', e => {
  e.preventDefault();
  const newGoal = parseFloat(document.getElementById('goal-input').value);
  if (newGoal < 0 || isNaN(newGoal)) {
    showMessageModal("Invalid Goal", "Please enter a non-negative goal value.");
    return;
  }
  userGoal = newGoal;
  goalAmountEl.textContent = userGoal.toFixed(2);
  updateTotalFootprint();
  showMessageModal("Goal Saved", `Your weekly carbon footprint goal is set to ${userGoal.toFixed(2)} kg CO₂.`);
});

historyListEl.addEventListener('click', e => {
  if (e.target.classList.contains('delete-btn')) {
    const index = parseInt(e.target.getAttribute('data-index'));
    activities.splice(index, 1);
    renderHistory();
    updateTotalFootprint();
    showMessageModal("Deleted", "Activity removed successfully.");
  }
});