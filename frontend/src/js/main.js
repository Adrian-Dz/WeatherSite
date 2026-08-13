document.addEventListener('DOMContentLoaded', function () {
    init();
});

const STORAGE_KEY = 'weatherPanels';
let selectedLocation = null;
let activePanelId = null;

function init() {
    const savedPanels = getWeatherPanels();
    if (savedPanels.length > 0) {
        activePanelId = savedPanels[0].id;
    }

    renderSidePanel();
    renderMainPanel();

    document.addEventListener('click', function (event) {
        const addButton = event.target.closest('.add-panel-btn');
        if (addButton) {
            selectedLocation = null;
            renderMainPanel('create');
            return;
        }

        const weatherButton = event.target.closest('.weather-card');
        if (weatherButton) {
            const panelId = Number(weatherButton.dataset.panelId);
            const panel = getWeatherPanels().find((item) => item.id === panelId);
            if (panel) {
                activePanelId = panelId;
                renderMainPanel('selected', panel);
            }
            return;
        }

        const saveButton = event.target.closest('.primary-action');
        if (saveButton) {
            const input = document.getElementById('panel-name');
            const regionValue = document.getElementById('selected-region');
            const coordsValue = document.getElementById('selected-coordinates');

            if (!selectedLocation) {
                alert('Wybierz lokalizację na mapie, klikając w wybrane miejsce.');
                return;
            }

            const name = (input && input.value.trim()) || selectedLocation.name || 'Nowy region';
            const region = (regionValue && regionValue.textContent.trim()) || selectedLocation.name || 'Polska';
            const coords = (coordsValue && coordsValue.textContent.trim()) || `${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`;

            const weatherPanels = getWeatherPanels();
            const newPanel = {
                id: Date.now(),
                name,
                region,
                coords,
                latitude: selectedLocation.lat,
                longitude: selectedLocation.lng
            };

            weatherPanels.push(newPanel);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(weatherPanels));
            activePanelId = newPanel.id;

            renderSidePanel();
            renderMainPanel('selected', newPanel);
        }
    });
}

function getWeatherPanels() {
    const savedValue = localStorage.getItem(STORAGE_KEY);
    if (!savedValue) {
        return [];
    }

    try {
        const parsed = JSON.parse(savedValue);
        if (Array.isArray(parsed)) {
            return parsed;
        }
    } catch (error) {
        console.warn('Nie udało się odczytać paneli z localStorage.', error);
    }

    return [];
}

function renderSidePanel() {
    const sidePanel = document.getElementById('side_panel');
    const panels = getWeatherPanels();

    const cards = panels.map((panel) => `
        <button type="button" class="weather-card" data-panel-id="${panel.id}">${panel.name}</button>
    `).join('');

    sidePanel.innerHTML = `
        <div class="panel-list">
            ${cards}
            <button type="button" class="add-panel-btn">Dodaj panel</button>
        </div>
    `;
}

function renderMainPanel(mode = 'overview', panel = null) {
    const mainPanel = document.getElementById('main_panel');
    const panels = getWeatherPanels();

    if (mode === 'create') {
        mainPanel.innerHTML = `
            <div class="dashboard-view">
                <div class="map-stage">
                    <div id="map"></div>
                </div>
                <aside class="selector-panel">
                    <div class="selector-box">
                        <input id="panel-name" type="text" placeholder="TEXTBOX: NAZWA WŁASNA" aria-label="Nazwa panelu">
                    </div>
                    <div class="selector-box">
                        <div id="selected-region" class="region-button">Wybierz lokalizację na mapie</div>
                    </div>
                    <div class="selector-box">
                        <div id="selected-coordinates" class="region-value">LAT / LNG</div>
                    </div>
                    <div class="selector-box">
                        <button type="button" class="primary-action">UTWÓRZ</button>
                    </div>
                </aside>
            </div>
        `;

        initMapSelection();
        return;
    }

    if (mode === 'selected' && panel) {
        mainPanel.innerHTML = `
            <div class="dashboard-view">
                <div class="map-stage">
                    <div id="map"></div>
                </div>
                <aside class="selector-panel">
                    <div class="selector-box">
                        <div class="detail-card">
                            <h2>${panel.name}</h2>
                            <div class="detail-grid">
                                <div class="detail-item"><span>Region</span><strong>${panel.region}</strong></div>
                                <div class="detail-item"><span>Koord.</span><strong>${panel.coords || 'brak danych'}</strong></div>
                            </div>
                        </div>
                    </div>
                    <div class="selector-box">
                        <button type="button" class="primary-action add-panel-btn-secondary">Dodaj kolejny panel</button>
                    </div>
                </aside>
            </div>
        `;

        const addAnother = document.querySelector('.add-panel-btn-secondary');
        if (addAnother) {
            addAnother.addEventListener('click', function () {
                selectedLocation = null;
                renderMainPanel('create');
            });
        }

        initMapSelection(panel.latitude, panel.longitude, panel.region);
        return;
    }

    if (panels.length === 0) {
        mainPanel.innerHTML = '<div class="empty-state">mapa</div>';
        return;
    }

    const firstPanel = panels.find((item) => item.id === activePanelId) || panels[0];
    renderMainPanel('selected', firstPanel);
}

function initMapSelection(lat = 52.069, lng = 19.480, regionName = 'Polska') {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
        return;
    }

    const map = L.map('map', {
        zoomControl: true,
        scrollWheelZoom: true
    }).setView([lat, lng], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const regionNameEl = document.getElementById('selected-region');
    const coordsEl = document.getElementById('selected-coordinates');

    if (regionNameEl) {
        regionNameEl.textContent = regionName;
    }

    if (coordsEl) {
        coordsEl.textContent = `${lat.toFixed(4)} / ${lng.toFixed(4)}`;
    }

    if (document.querySelector('.primary-action')) {
        map.on('click', function (event) {
            if (window.selectedMarker) {
                map.removeLayer(window.selectedMarker);
            }

            const marker = L.marker(event.latlng).addTo(map);
            window.selectedMarker = marker;

            const city = findClosestPolishCity(event.latlng.lat, event.latlng.lng);
            selectedLocation = {
                lat: event.latlng.lat,
                lng: event.latlng.lng,
                name: city.name
            };

            if (regionNameEl) {
                regionNameEl.textContent = city.name;
            }

            if (coordsEl) {
                coordsEl.textContent = `${event.latlng.lat.toFixed(4)} / ${event.latlng.lng.toFixed(4)}`;
            }
        });
    }

    setTimeout(() => {
        map.invalidateSize();
    }, 100);
}

function findClosestPolishCity(lat, lng) {
    const cities = [
        { name: 'Warszawa', coords: [52.2297, 21.0122] },
        { name: 'Kraków', coords: [50.0647, 19.9450] },
        { name: 'Gdańsk', coords: [54.3520, 18.6466] },
        { name: 'Wrocław', coords: [51.1079, 17.0385] },
        { name: 'Poznań', coords: [52.4064, 16.9252] },
        { name: 'Lublin', coords: [51.2465, 22.5684] },
        { name: 'Katowice', coords: [50.2649, 19.0238] },
        { name: 'Białystok', coords: [53.1325, 23.1688] },
        { name: 'Łódź', coords: [51.7592, 19.4560] },
        { name: 'Szczecin', coords: [53.4285, 14.5528] }
    ];

    let nearest = cities[0];
    let shortestDistance = Number.POSITIVE_INFINITY;

    cities.forEach((city) => {
        const distance = Math.hypot(lat - city.coords[0], lng - city.coords[1]);
        if (distance < shortestDistance) {
            shortestDistance = distance;
            nearest = city;
        }
    });

    return nearest;
}
