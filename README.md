# WeatherSite
Interactive website with rest api written in Golang.

Api bedzie postawione na "**Render**"

Front postawiony na "**Render**"

Baza danych postawiona na **Supabase** hasło: AdrianAdmin123.123

**Założenia FRONT**:
Strona Użytkownika:
<img width="1091" height="461" alt="image" src="https://github.com/user-attachments/assets/44cf8246-b57e-46bf-b52d-50d86f4e995d" />

Admin Bedzie w navbarze posiadał odwołanie do strony z modyfikowaniem użytkowników w tym samym formacie


**Założenia API**:
- Token JWT (werifikowanie usera)
- CORS
- Autoryzacja poprzez middleware
- Autoryzacja Uprawnien uzytkownika

**USER**:
- [POST] Tworzenie nowego okna dla nowego regionu gdzie mozna zobaczyc dane o pogodzie na nastepne 24h (Temperature, Szansa na deszcz, Przewidywane opady, Wiatr, Cisnienie)
- [GET] Odczyt stworzonych okien przez siebie z mozliwoscia ukrycia poszczegolnych danych. Kiedy zaznaczamy ze nie chcemy jakis danych np. Ciśnienie to api nie wysyła ich.

**ADMIN**:
- [PUT] Mozliwosc modyfikowania okien dla innych uzytkownikow
- [GET]Mozliwosc odczytu okien innych użytkowników
- [PUT] Mozliwosc zmiany uprawnień użytkowników
- [POST, PUT, GET] Dodawanie, Usuwanie, blokowanie na czas użytkowników
