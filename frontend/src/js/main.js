document.addEventListener("DOMContentLoaded", function() {
    init()
})


function init() {
    const sidePanel = document.getElementById("side_panel")
    const mainPanel = document.getElementById("main_panel")

    let weatherPanels = getWeatherPanels()
    if (weatherPanels.length > 0) {
        
    } else {

    }
}

function getWeatherPanels() {
    return []
}
