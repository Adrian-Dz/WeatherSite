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
      var map = L.map('map').setView([51.505, -0.09], 13);
    }
}

function getWeatherPanels() {
    return []
}
