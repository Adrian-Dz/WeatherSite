moj-projekt/
├── backend/               # Kod źródłowy API w Go
│   ├── cmd/               # Punkty wejścia aplikacji
│   │   └── api/
│   │       └── main.go    # Główny plik uruchamiający serwer
│   ├── internal/          # Kod prywatny (niedostępny dla innych modułów)
│   │   ├── handler/       # Obsługa żądań HTTP (kontrolery)
│   │   ├── model/         # Struktury danych (np. struktury bazy danych)
│   │   └── repository/    # Operacje na bazie danych (SQL/zapytania)
│   ├── go.mod             # Definicja modułu Go
│   ├── go.sum             # Sumy kontrolne zależności Go
│   └── Dockerfile         # Konfiguracja kontenera (przydatna do wdrożenia)
│
├── frontend/              # Kod źródłowy strony w JS
│   ├── public/            # Pliki statyczne (obrazy, ikony)
│   ├── src/
│   │   ├── assets/        # Style CSS, obrazki
│   │   ├── js/            # Skrypty JavaScript (logika, zapytania API)
│   │   └── index.html     # Główny plik HTML strony
│   └── package.json       # Zależności i skrypty JS (jeśli używasz np. Vite/NPM)
│
└── README.md              # Dokumentacja projektu