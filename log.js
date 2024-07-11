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

var intervalId;

const apiKey = "51ed8bbc41a5430e96be18a1fd70cd6f";

async function checkWeather(city) {
  const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const response = await fetch(apiURL);
  var data = await response.json();
  document.querySelector(".cityname").innerText = data.name;
  document.querySelector(".temp").innerText = Math.floor(data.main.temp) + "°c";
  document.querySelector(".humidity").innerText = data.main.humidity + "%";
  document.querySelector(".Wind").innerText = data.wind.speed + "km/h";
  console.log("IMHERE");
}

function updateClockForCountry(country) {
  var timeZone = timeZones[country];

  clearInterval(intervalId);

  intervalId = setInterval(function () {
    var now = moment().tz(timeZone);

    var h = now.format("HH");
    var m = now.format("mm");
    var s = now.format("ss");
    var date = now.format("dddd D MMMM YYYY");

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
    var now = moment().tz("Asia/Kolkata");

    var h = now.format("HH");
    var m = now.format("mm");
    var s = now.format("ss");
    var date = now.format("dddd D MMMM YYYY");

    document.getElementById("india-date").innerHTML = date;
    document.getElementById("india-hours").innerText = h;
    document.getElementById("india-min").innerHTML = m;
    document.getElementById("india-sec").innerHTML = s;
  }, 1000);
}

function updateTimeGap(selectedTimeZone) {
  var now = moment();
  var indiaOffset = moment.tz.zone("Asia/Kolkata").utcOffset(now);
  var selectedOffset = moment.tz.zone(selectedTimeZone).utcOffset(now);

  var timeDifference = (selectedOffset - indiaOffset) / 60;

  document.getElementById(
    "time-difference"
  ).innerText = `TimeGap: ${timeDifference} hours`;
}

document
  .getElementById("countryList")
  .addEventListener("click", function (event) {
    if (event.target.tagName.toLowerCase() === "li") {
      var country = event.target.getAttribute("data-country");
      var city = cities[country];

      var coordinates = getCoordinates(city);

      if (coordinates) {
        updateClockForCountry(country);
        checkWeather(city);
        showLocation(coordinates);
      }
    }
  });

function showLocation() {
  var map = L.map("mapid").setView([27.959463, 78.08266], 3); 

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);


  map.eachLayer(function (layer) {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });


  Object.keys(cities).forEach(function (country) {
    var cityName = cities[country];
    var coordinates = getCoordinates(cityName); 

    if (coordinates) {
      L.marker(coordinates).addTo(map).bindPopup(cityName).openPopup();
    }
  });
}


function getCoordinates(cityName) {
  switch (cityName) {
    case "New York":
      return [40.7128, -74.006];
    case "London":
      return [51.5074, -0.1278];
    case "Toronto":
      return [43.65107, -79.347015];
    case "Sydney":
      return [-33.8688, 151.2093];
    case "Shanghai":
      return [31.2304, 121.4737];
    case "Tokyo":
      return [35.6895, 139.6917];
    case "Berlin":
      return [52.52, 13.405];
    case "Paris":
      return [48.8566, 2.3522];
    case "Moscow":
      return [55.7558, 37.6176];
    case "Sao Paulo":
      return [-23.5505, -46.6333];
    case "Johannesburg":
      return [-26.2041, 28.0473];
    case "Dubai":
      return [25.276987, 55.296249];
    case "Singapore":
      return [1.3521, 103.8198];
    case "Riyadh":
      return [24.7136, 46.6753];
    case "Kathmandu":
      return [27.7172, 85.324];
    default:
      return null;
  }
}

updateIndiaClock();
updateClockForCountry("United States");
showLocation();
getCoordinates([40.7128, -74.006]);
