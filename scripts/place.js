document.getElementById("currentyear").textContent = new Date().getFullYear();
document.getElementById("lastModified").textContent = `Last Modification: ${document.lastModified}`;

const temperature = 9; // °C
const windSpeed = 22;  // km/h

function calculateWindChill(tempC, windKmh) {
  return 13.12 + 0.6215 * tempC - 11.37 * Math.pow(windKmh, 0.16) + 0.3965 * tempC * Math.pow(windKmh, 0.16);
}

const windChillEl = document.getElementById("windChill");

if (temperature <= 10 && windSpeed > 4.8) {
  const windChill = calculateWindChill(temperature, windSpeed);
  windChillEl.textContent = `${windChill.toFixed(1)} °C`;
} else {
  windChillEl.textContent = "N/A";
}
