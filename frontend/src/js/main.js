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

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);

      setTimeout(() => {
        map.invalidateSize();
    }, 100); 
    }
}

function getWeatherPanels() {
    return []
}
