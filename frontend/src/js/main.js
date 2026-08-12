document.addEventListener("DOMContentLoaded", function() {
    init()
})


function init() {
    const sidePanel = document.getElementById("side_panel")
    const mainPanel = document.getElementById("main_panel")

    let weatherPanels = getWeatherPanels()
    if (weatherPanels.length > 0) {
        
    } else {
      html = `<div id="map"></div>`

      mainPanel.innerHTML = html

      //Leaflet code
      var map = L.map('map').setView([51.505, -0.09], 13);

      L.tileLayer('https://api.openstreetmap.org/api/0.6/map?bbox=14.106,48.959,24.258,54.997', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);
    }
}

function getWeatherPanels() {
    return []
}
