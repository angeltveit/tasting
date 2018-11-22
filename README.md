# Blindsmaking av øl via untappd AKA WOOZY

## HOW IT WORKS AKA MVP

1. Opprette event via backoffice-side, man setter navn, får en unik pin
2. Verten/ølmasteren finne alle øllene og lager en liste med de som skal drikkes
3. Det er en storskjerm med oversikt over hva som skjer, og en "add pin to join" så brukerene kan delta på hendelsen
4. Når hendensel starter vises noe ala "4/7 personer er ferdig" og "venter på torbjørn før neste runde"
5. Brukeren gir en vurdering, tar et bilde og gir en kommentar per øl
6. Når alle øllene er ferdig smakt: gjestene får "thanks for participating" på mobilen
7. Når alt er ferdig vises noe fornuftig på storskjermen TBD
8. Til slutt er det automatisk checkin for hver bruker av øllene man har drukket, med kommentar, bilde, rating

### Ekstra

* End of round summary
* Gjettelek av hvilken øl man har drukket. Oppsummering til slutt 
* Etterpå: Mulighet for å hake av øllene du har dukket og legge de til wishlist

## HOW ITS ALL CONNECTED

Database med tre tables

* events_participants
* events
* user_table

APIet er tilgjengelig på /api

POST  /events create

POST /events/join :code


## HOW TO SET UP LOCAL DEVELOPMENT

1. `git clone https://github.com/angeltveit/tasting.git`
2. `yarn`
3. [installer postgres](https://www.postgresql.org/download)
2. `knex migrate:latest`
4. kjøre `yarn dev`
5. i et annet vindu `yarn watch` siden torbjørn hater paralelle tasks
6. [localhost:3000](http://localhost:3000)
7. ???


## Debug in browser

1. Gå til https://tastr.xyz/p/[EVENTKODEN]
2. Høydeklikk og inspect elementet med checkinnene (beerplay)
3. Gå i konsollen og skriv `$0.event.checkins` for å få alle checkin-ene
4. Bla rundt og se på de fine dataene 
5. ???
