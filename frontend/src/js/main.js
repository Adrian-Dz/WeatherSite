document.addEventListener('DOMContentLoaded', function () {
    init();
});

const STORAGE_KEY = 'weatherPanels';

function init() {
    renderSidePanel();
    renderMainPanel();

    document.addEventListener('click', function (event) {
        const addButton = event.target.closest('.add-panel-btn');
        if (addButton) {
            renderMainPanel('create');
        }

        const saveButton = event.target.closest('.primary-action');
        if (saveButton) {
            const nameInput = document.getElementById('panel-name');
            const regionName = document.getElementById('selected-region');
            const panelName = (nameInput && nameInput.value.trim()) || 'Nowy region';
            const region = regionName && regionName.textContent.trim() ? regionName.textContent.trim() : 'Polska';

            const weatherPanels = getWeatherPanels();
            weatherPanels.push({ id: Date.now(), name: panelName, region });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(weatherPanels));

            renderSidePanel();
            renderMainPanel();
        }
    });
}

function getWeatherPanels() {
    const savedValue = localStorage.getItem(STORAGE_KEY);
    if (savedValue) {
        try {
            const parsed = JSON.parse(savedValue);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        } catch (error) {
            console.warn('Nie udało się odczytać paneli z localStorage.', error);
        }
    }

    const defaults = [
        { id: 1, name: 'Panel 1', region: 'Warszawa' },
        { id: 2, name: 'Panel 2', region: 'Kraków' },
        { id: 3, name: 'Panel 3', region: 'Gdańsk' },
        { id: 4, name: 'Panel 4', region: 'Wrocław' }
    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    return defaults;
}

function renderSidePanel() {
    const sidePanel = document.getElementById('side_panel');
    const panels = getWeatherPanels();

    const cards = panels.map((panel) => `
        <div class="weather-card" title="${panel.region}">${panel.region}</div>
    `).join('');

    const addButton = `
        <button type="button" class="add-panel-btn">Dodaj panel</button>
    `;

    sidePanel.innerHTML = `<div class="panel-list">${cards}${addButton}</div>`;
}

function renderMainPanel(mode = 'overview') {
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
                        <div id="selected-region" class="region-button">DANE REGIONU</div>
                    </div>
                    <div class="selector-box">
                        <button type="button" class="primary-action">button: UTWÓRZ</button>
                    </div>
                </aside>
            </div>
        `;

        initMapSelection();
        return;
    }

    if (panels.length === 0) {
        mainPanel.innerHTML = `
            <div class="empty-state">mapa</div>
        `;
        return;
    }

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
                    <div id="selected-region" class="region-button">DANE REGIONU</div>
                </div>
                <div class="selector-box">
                    <button type="button" class="primary-action">button: UTWÓRZ</button>
                </div>
            </aside>
        </div>
    `;

    initMapSelection();
}

function initMapSelection() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
        return;
    }

    const map = L.map('map', {
        zoomControl: true,
        scrollWheelZoom: true
    }).setView([52.069, 19.480], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const regionNameEl = document.getElementById('selected-region');

    const regionMarkers = [
        { name: 'Warszawa', coords: [52.2297, 21.0122] },
        { name: 'Kraków', coords: [50.0647, 19.9450] },
        { name: 'Gdańsk', coords: [54.3520, 18.6466] },
        { name: 'Wrocław', coords: [51.1079, 17.0385] },
        { name: 'Poznań', coords: [52.4064, 16.9252] },
        { name: 'Lublin', coords: [51.2465, 22.5684] },
        { name: 'Katowice', coords: [50.2649, 19.0238] },
        { name: 'Białystok', coords: [53.1325, 23.1688] }
    ];

    regionMarkers.forEach((region) => {
        const marker = L.marker(region.coords).addTo(map);
        marker.bindPopup(region.name);
        marker.on('click', function () {
            if (regionNameEl) {
                regionNameEl.textContent = region.name;
            }
        });
    });

    setTimeout(() => {
        map.invalidateSize();
    }, 100);
}
