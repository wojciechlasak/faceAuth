# faceAuth

Dwu stopniowa autoryzacja za pomocą hasła i rozpoznawania twarzy

## Opis

Projekt wykorzystuje biometryczne możliwości do rozpoznawnia twarzy. Program zawiera 
dwu stopniową autoryzację, na początku sprawdzany jest zwykły login i hasło, następny etap to 
sprawdzanie zdjęcia z kamerki internetowej. Sprawdzana jest baza zdjęć użytkownika i określane
podobieństwo. Program wykorzystuje zdjęcie przechowane w swojej bazie i na tej podstawie ocenia czy ma 
doczynienia z daną osobą. Taka autoryzacja pozwala na zwiększenie bezpieczeństwa podczas logowania.

Do rozpoznawania twarzy został wykorzystany algorytm Local binary patterns histograms (LBPH),
daje on nieco lepsze rezultaty niż algorytm Fisherfaces. Algorytm Eigenfaces miał problemy
z poprawnym rozponawaniem, źle sobie radzi z niedoświetlonymi zdjęciami.


## Wymagania i instalacja

Potrzebny jest zainstalowany OpenCV na swoim systemie oraz Node.js przynajmniej v12.6.4
Następnie należy doinstalować resztę modułów za pomocą poniższej komendy

```
npm install

```

## Jak uruchomić logowanie

Poniższa linia pozwala uruchomić serwer

```
node server.js
```

Aplikacja dostępna jest pod adresem http://localhost:8080/.
W obecnej wersji jest tylko jeden użytkownik login: wojciech / hasło: wojtek
Należy pozwolić przeglądarce na wykorzystanie kamery internetowej

## Jak to działa

- Najpierw autoryzacja za pomocą loginu oraz hasła

<img src="./documentation/1.JPG">

- Następnie wykonanie zdjęcia poprzez kamerkę internetową

<img src="./documentation/2.JPG">

- Teraz podejmujemy decyzje czy wykonane zdjęcie wysłać czy zmienić

<img src="./documentation/3.JPG">

- Następuje weryfikacja, która zajmuje chwilę, jeśli się nie uda
wracamy do ekranu logowania

<img src="./documentation/4.JPG">

- Jeśli zostanie rozponana twarz, zostajemy poprawnie zalogowani

<img src="./documentation/5.JPG">

## Jak uruchomić testowanie twarzy z bazy

Poniższa linia pozwala uruchomić rozponanie testowych twarzy

```
node regonizer.js
```

## Jak to działa

Aplikacja na podstawie bazy ocenia testowe zdjęcia i przypisuje je do osób.
Sprawdza ona podobieństwo próbek testowych za pomocą 3 algorytmów: Eigenfaces, 
Fisherfaces oraz Local binary patterns histograms (LBPH)

<img src="./documentation/recognizer.JPG">
