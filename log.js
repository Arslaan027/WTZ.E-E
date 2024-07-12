var timeZones = {
    "United States": "America/New_York",
    London: "Europe/London",
    Canada: "America/Toronto",
    Australia: "Australia/Sydney",
    China: "Asia/Shanghai",
    Japan: "Asia/Tokyo",
    Germany: "Europe/Berlin",
    France: "Europe/Paris",
    Russia: "Europe/Moscow",
    Brazil: "America/Sao_Paulo",
    "South Africa": "Africa/Johannesburg",
    UAE: "Asia/Dubai",
    Singapore: "Asia/Singapore",
    "Saudi Arabia": "Asia/Riyadh",
    Nepal: "Asia/Kathmandu",
  };
  
  const cities = {
    "United States": "New York",
    London: "London",
    Canada: "Toronto",
    Australia: "Sydney",
    China: "Shanghai",
    Japan: "Tokyo",
    Germany: "Berlin",
    France: "Paris",
    Russia: "Moscow",
    Brazil: "Sao Paulo",
    "South Africa": "Johannesburg",
    UAE: "Dubai",
    Singapore: "Singapore",
    "Saudi Arabia": "Riyadh",
    Nepal: "Kathmandu",
  };
  
  const coords = {
    "New York": [40.712776, -74.005974],
    London: [51.507351, -0.127758],
    Toronto: [43.653225, -79.383186],
    Sydney: [-33.868820, 151.209290],
    Shanghai: [31.2304, 121.4737],
    Tokyo: [35.6762, 139.6503],
    Berlin: [52.5200, 13.4050],
    Paris: [48.8566, 2.3522],
    Moscow: [55.7558, 37.6173],
    "Sao Paulo": [-23.5505, -46.6333],
    Johannesburg: [-26.2041, 28.0473],
    Dubai: [25.276987, 55.296249],
    Singapore: [1.3521, 103.8198],
    Riyadh: [24.7136, 46.6753],
    Kathmandu: [27.7172, 85.3240]
  };
  
  var intervalId;
  var map; // Declare map variable at a higher scope
  
  function getCoordinates(city) {
    return coords[city] || null;
  }
  
  const apiKey = "51ed8bbc41a5430e96be18a1fd70cd6f";
  
  async function checkWeather(city) {
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiURL);
    const data = await response.json();
    document.querySelector(".cityname").innerText = data.name;
    document.querySelector(".temp").innerText = Math.floor(data.main.temp) + "°C";
    document.querySelector(".humidity").innerText = data.main.humidity + "%";
    document.querySelector(".Wind").innerText = data.wind.speed + " km/h";
  }
  
  function updateClockForCountry(country) {
    const timeZone = timeZones[country];
  //git checkup
    clearInterval(intervalId);
  
    intervalId = setInterval(function () {
      const now = moment().tz(timeZone);
  
      const h = now.format("HH");
      const m = now.format("mm");
      const s = now.format("ss");
      const date = now.format("dddd D MMMM YYYY");
  
      document.getElementById("date").innerHTML = date;
      document.getElementById("hours").innerText = h;
      document.getElementById("min").innerHTML = m;
      document.getElementById("sec").innerHTML = s;
  
      document.getElementById("country-name").innerText = country;
  
      updateTimeGap(timeZone);
    }, 1000);
  }
  
  function updateIndiaClock() {
    setInterval(function () {
      const now = moment().tz("Asia/Kolkata");
  
      const h = now.format("HH");
      const m = now.format("mm");
      const s = now.format("ss");
      const date = now.format("dddd D MMMM YYYY");
  
      document.getElementById("india-date").innerHTML = date;
      document.getElementById("india-hours").innerText = h;
      document.getElementById("india-min").innerHTML = m;
      document.getElementById("india-sec").innerHTML = s;
    }, 1000);
  }
  
  function updateTimeGap(selectedTimeZone) {
    const now = moment();
    const indiaOffset = moment.tz.zone("Asia/Kolkata").utcOffset(now);
    const selectedOffset = moment.tz.zone(selectedTimeZone).utcOffset(now);
  
    const timeDifference = (selectedOffset - indiaOffset) / 60;
  
    document.getElementById("time-difference").innerText = `TimeGap: ${timeDifference} hours`;
  }
  
  document.getElementById("countryList").addEventListener("click", function (event) {
    if (event.target.tagName.toLowerCase() === "li") {
      const country = event.target.getAttribute("data-country");
      const city = cities[country];
  
      const coordinates = getCoordinates(city);
      if (coordinates) {
        updateClockForCountry(country);
        checkWeather(city);
        showLocation(city, coordinates);
      }
    }
  });
  
  function showLocation(city, coordinates) {
    if (!map) {
      // Initialize the map only once
      map = L.map("mapid").setView(coordinates, 3);
  
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
    } else {
      // Update the map view to the new coordinates
      map.setView(coordinates, 3);
  
      // Remove existing markers
      map.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });
    }
  
    // Add new marker
    L.marker(coordinates).addTo(map).bindPopup(city).openPopup();
  }
  
  updateIndiaClock();
  updateClockForCountry("United States");
  showLocation("New York", getCoordinates("New York"));
  