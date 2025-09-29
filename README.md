# 🌍 Carbon Footprint Tracker & Live Air Quality App

A modern, responsive web application built with HTML, CSS, and vanilla JavaScript for tracking personal carbon footprints and viewing real-time Air Quality Index (AQI) data for any city.

## ✨ Features

* **Carbon Footprint Tracking:** Log various activities (Transportation, Electricity, Diet, etc.) and see your total calculated CO₂ footprint in real-time.
* **Weekly Goal Setting:** Set a target for your weekly carbon emissions and visualize your progress with a dynamic progress bar.
* **Activity History:** View and manage a list of all logged activities with an option to delete entries.
* **Live Air Quality Index (AQI):** Check the AQI, status, and concentrations of major pollutants (PM2.5, CO, O₃, etc.) for any city worldwide using the OpenWeatherMap API.
* **Health Advice & Carbon Tips:** Get health recommendations based on the current AQI and a random tip for reducing your carbon emissions.
* **Interactive Design:** A clean, user-friendly interface with modal popups for displaying detailed air quality and goal information.

## 🛠️ Tech Stack

* **HTML5:** Structure and Semantics
* **CSS3:** Styling (Custom and responsive)
* **JavaScript (ES6+):** Core logic, API calls, and DOM manipulation

## 🚀 Getting Started

### Prerequisites

You will need a free API key from **OpenWeatherMap** to fetch both geolocation and Air Quality Index data.

1.  Sign up at [OpenWeatherMap](https://openweathermap.org/) and generate a new API key.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/YourUsername/repo-name.git](https://github.com/YourUsername/repo-name.git)
    cd repo-name
    ```

2.  **Update the API Key:**
    Open `app.js` and replace the placeholder with your actual OpenWeatherMap API key:
    ```javascript
    // app.js
    const OPENWEATHER_API_KEY = 'YOUR_OPENWEATHER_API_KEY_HERE'; // Replace with your key
    // ... rest of the code
    ```

3.  **Run the application:**
    Since this is a client-side application, simply open the `index.html` file in your web browser.

    > **Tip:** For local development and to avoid CORS issues that some browsers might impose on local files, it's recommended to run it using a simple local server (e.g., using VS Code's "Live Server" extension or Python's `http.server`).

## ✍️ Usage

### Carbon Footprint Tracker

1.  **Set a Goal:** Use the "Weekly Goal" form to set your target (in kg CO₂).
2.  **Log Activity:** Select an **Activity Type** from the dropdown (e.g., 'transport', 'electricity') and enter the **Amount** (e.g., kilometers, kWh).
3.  Click **Log Activity** to add the entry. The total footprint will update instantly, and your history will be populated.

### Live Air Quality

1.  Enter a **City Name** (e.g., *London*, *New Delhi*, *Tokyo*) in the input field.
2.  Click the **Check** button.
3.  A modal will appear showing the **AQI** level, **status**, pollutant concentrations, and relevant health advice.

## ⚙️ Core Logic Details

### Carbon Footprint Calculation

The application uses the following pre-defined **conversion factors** (kg CO₂ per unit) in `app.js` to calculate the footprint for each activity:

```javascript
const conversionFactors = {
  transport: 0.21, // kg CO₂ per km
  electricity: 0.43, // kg CO₂ per kWh
  diet: 2.0, // kg CO₂ per meal (average)
  flight: 0.19, // kg CO₂ per km
  heating: 0.2, // kg CO₂ per kWh
  waste: 0.5, // kg CO₂ per kg
  shopping: 1.5, // kg CO₂ per item (average)
};
