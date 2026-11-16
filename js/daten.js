/* Gruppen Website von Alex: einzige Stelle für Name, Marken, Standorte, Zahlen und Übersetzungen.
   Deutsch steht zusätzlich als Text im HTML (data-i18n), Englisch nur hier unter texte.en.
   Zahlen nur mit Quelle eintragen (siehe Kommentar je Zahl). Kein Gedankenstrich in Texten (Naders Regel). */
window.GRUPPE = {
  // Name von Nader am 03.11.2026 bestätigt. kurz = riesige Buchstaben im Hero und Footer.
  name: 'ALX Group',
  kurz: 'ALX',
  zusatz: 'Group',

  // Leer = Kontakt läuft über die Marken. Sobald da, erscheint der große Mail Knopf.
  kontakt: { email: '', telefon: '' },

  // Abschnitte im Hero Reel (Sekunden in assets/video/reel.mp4, gebaut von tools/medien_bauen.py, Liste REEL)
  reel: [
    { marke: 'meat', von: 0, bis: 4.5 },
    { marke: 'wac', von: 4.5, bis: 9 },
    { marke: 'h25', von: 9, bis: 13.5 }
  ],

  marken: [
    {
      id: 'meat',
      name: 'The Meat Company',
      farbe: '#D4875A',
      logo: 'assets/logo/meat.webp', logoBreite: 1200, logoHoehe: 486,
      video: 'meat', // assets/video/meat.mp4, meat-sm.mp4, meat-poster.webp
      url: 'https://nadercbz.github.io/the-meat-company/',
      instagram: 'https://www.instagram.com/themeatcompanyberlin/',
      bezirk: 'Berlin Mitte',
      adresse: 'Friedrichstraße 63, 10117 Berlin',
      kategorie: { de: 'Smokehouse · Burger · Sandwiches', en: 'Smokehouse · Burgers · Sandwiches' },
      text: {
        de: 'Pastrami, Brisket und Short Rib aus dem eigenen Smoker, US Prime Beef und ehrliche Portionen mitten an der Friedrichstraße. Lieferung über Wolt und Uber Eats. Der zweite Standort in Charlottenburg ist in Vorbereitung.',
        en: 'Pastrami, brisket and short rib from our own smoker, US prime beef and honest portions right on Friedrichstraße. Delivery via Wolt and Uber Eats. The second location in Charlottenburg is in preparation.'
      },
      // Quellen: 14 h Prozess und 55 Gerichte aus Projekt 91 (menu.json), 14.200 Follower Stand 01.11.2026
      fakten: [
        { zahl: '14 h', de: 'im Smoker', en: 'in the smoker' },
        { zahl: '55', de: 'Gerichte auf der Karte', en: 'dishes on the menu' },
        { zahl: '14.200', de: 'Follower auf Instagram', en: 'Instagram followers' }
      ]
    },
    {
      id: 'wac',
      name: 'What about coffee?',
      farbe: '#D39A55',
      logo: 'assets/logo/wac.svg', logoBreite: 1000, logoHoehe: 356,
      video: 'wac',
      url: 'https://nadercbz.github.io/what-about-coffee/',
      instagram: 'https://www.instagram.com/whataboutcoffeeberlin/',
      bezirk: 'Berlin Zehlendorf',
      adresse: 'Berliner Straße 1, 14169 Berlin',
      kategorie: { de: 'Café · Croffles · Matcha', en: 'Café · Croffles · Matcha' },
      text: {
        de: 'Specialty Coffee, Croffles frisch aus dem Waffeleisen, gefüllte Croissants, Açaí und Matcha. Ein Café mit Humor und Fensterplätzen, mitten in Zehlendorf.',
        en: 'Specialty coffee, croffles fresh from the waffle iron, filled croissants, açaí and matcha. A café with humour and window seats in the heart of Zehlendorf.'
      },
      // Quellen: 3 Menütafeln und rund 40 Produkte aus Projekt 92 (karte-daten.js), 3.600 Follower Stand 30.10.2026
      fakten: [
        { zahl: '3', de: 'Tafeln: fresh, sweet, salty', en: 'boards: fresh, sweet, salty' },
        { zahl: '40+', de: 'Produkte auf der Karte', en: 'items on the menu' },
        { zahl: '3.600', de: 'Follower auf Instagram', en: 'Instagram followers' }
      ]
    },
    {
      id: 'h25',
      name: 'The 25 Hours Store',
      farbe: '#FF5A1F',
      logo: 'assets/logo/h25.webp', logoBreite: 1400, logoHoehe: 315,
      video: 'h25',
      url: 'https://nadercbz.github.io/the-25-hours-store/',
      instagram: '',
      bezirk: 'Märkisches Viertel',
      adresse: 'Wilhelmsruher Damm 140, 13439 Berlin',
      kategorie: { de: 'Späti · Drinks · Snacks', en: 'Convenience · Drinks · Snacks' },
      text: {
        de: 'Ein Tag hat 24 Stunden. Wir haben eine mehr. Der Späti im Märkischen Zentrum mit Drinks, Snacks, Sweets, Eis, Bier und Wein und allem für den Alltag.',
        en: 'A day has 24 hours. We have one more. The convenience store in Märkisches Zentrum with drinks, snacks, sweets, ice cream, beer, wine and everything for every day.'
      },
      // Quellen: Öffnungszeiten aus dem Branchenverzeichnis (noch nicht vom Kunden bestätigt), 6 Bereiche aus Projekt 95
      fakten: [
        { zahl: '4:30', de: 'Uhr auf, Montag bis Samstag', en: 'a.m. opening, Monday to Saturday' },
        { zahl: '6', de: 'Bereiche von Snacks bis Wein', en: 'sections from snacks to wine' },
        { zahl: '7', de: 'Tage die Woche geöffnet', en: 'days a week' }
      ]
    }
  ],

  // Karte und Liste. bezirkKarte = Name in karte-daten.js, seite: 'links' setzt das Etikett links vom Punkt. zeiten: [Sonntag bis Samstag] je [von, bis] oder null = zu. zeiten: null = kein Live Status.
  standorte: [
    {
      marke: 'meat', name: 'The Meat Company', bezirk: 'Mitte', bezirkKarte: 'Mitte', adresse: 'Friedrichstraße 63, 10117 Berlin',
      lon: 13.38984, lat: 52.51163,
      zeiten: [['12:00', '22:00'], ['12:00', '22:00'], ['12:00', '22:00'], ['12:00', '22:00'], ['12:00', '22:00'], ['12:00', '23:00'], ['12:00', '23:00']]
    },
    {
      marke: 'wac', name: 'What about coffee?', bezirk: 'Zehlendorf', bezirkKarte: 'Steglitz-Zehlendorf', adresse: 'Berliner Straße 1, 14169 Berlin',
      lon: 13.26177, lat: 52.43513,
      zeiten: null // Öffnungszeiten noch nicht bestätigt (Projekt 92), deshalb kein Live Status
    },
    {
      marke: 'h25', name: 'The 25 Hours Store', bezirk: 'Märkisches Viertel', bezirkKarte: 'Reinickendorf', adresse: 'Wilhelmsruher Damm 140, 13439 Berlin',
      lon: 13.35384, lat: 52.59688,
      zeiten: [['07:00', '11:00'], ['04:30', '20:00'], ['04:30', '20:00'], ['04:30', '20:00'], ['04:30', '20:00'], ['04:30', '20:00'], ['04:30', '20:00']]
    },
    {
      marke: 'meat', name: 'The Meat Company', bezirk: 'Charlottenburg', bezirkKarte: 'Charlottenburg-Wilmersdorf', adresse: null, bald: true, seite: 'links',
      lon: 13.3041, lat: 52.5163, // Mitte des Ortsteils, genaue Adresse folgt
      zeiten: null
    }
  ],

  // Gruppe in Zahlen. n wird hochgezählt, plus hängt hinten an.
  // Quellen: 3 Marken, 4 Standorte (3 offen, Charlottenburg in Vorbereitung), 4 Bezirke, 55 + 40 Gerichte plus Späti Sortiment,
  // 14.200 + 3.600 Follower, Meat und Späti haben an 7 Tagen geöffnet.
  zahlen: [
    { n: 3, de: 'Marken', en: 'Brands' },
    { n: 4, de: 'Standorte, einer davon in Vorbereitung', en: 'Locations, one of them in preparation' },
    { n: 4, de: 'Berliner Bezirke', en: 'Berlin districts' },
    { n: 100, plus: '+', de: 'Produkte auf Karten und im Regal', en: 'Products on menus and shelves' },
    { n: 17800, plus: '+', de: 'Follower auf Instagram', en: 'Instagram followers' },
    { n: 7, de: 'Tage die Woche geöffnet', en: 'Days a week open' }
  ],

  // Texte. de: nur was main.js selbst schreibt (der Rest steht im HTML). en: alles mit data-i18n plus die main.js Texte.
  texte: {
    de: {
      'meta.titel': 'ALX Group · Gastronomie und Handel aus Berlin',
      'marke.besuchen': 'Website besuchen',
      'marke.cursor': 'Website öffnen',
      'standorte.route': 'Route',
      'standorte.bald': 'In Vorbereitung',
      'standorte.adresseFolgt': 'Adresse folgt',
      'standorte.offen': 'Jetzt geöffnet',
      'standorte.zu': 'Gerade geschlossen',
      'standorte.oeffnet': 'öffnet',
      'standorte.schliesst': 'bis',
      'standorte.morgen': 'morgen',
      'standorte.zeitenWebsite': 'Öffnungszeiten auf der Website',
      'kontakt.website': 'Website',
      'kontakt.mail': 'Schreib uns',
      'modal.impressum': 'Impressum',
      'modal.datenschutz': 'Datenschutz',
      'modal.folgt': 'Die Angaben werden vor dem offiziellen Start ergänzt.',
      'modal.ds': 'Diese Website setzt keine Cookies und kein Tracking ein. Schriften, Videos und Bilder kommen von diesem Server, es werden keine Daten an Dritte übertragen. Links zu den Websites der Marken und zu Instagram öffnen externe Seiten mit eigener Datenschutzerklärung.'
    },
    en: {
      'meta.titel': 'ALX Group · Hospitality and retail from Berlin',
      'marke.cursor': 'Open website',
      'standorte.morgen': 'tomorrow',
      'kontakt.website': 'Website',
      'nav.gruppe': 'Group',
      'nav.marken': 'Brands',
      'nav.standorte': 'Locations',
      'nav.wachstum': 'Growth',
      'nav.kontakt': 'Contact',
      'nav.partner': 'Partner with us',
      'nav.menu': 'Menu',
      'hero.ueber': 'A Berlin group for food, coffee and retail',
      'hero.unter': 'Three brands. Four locations. One standard.',
      'hero.scroll': 'Scroll',
      'hero.jetzt': 'Now showing',
      'hero.titel': 'Hospitality and retail <em>made in Berlin.</em>',
      'statement.label': 'The group',
      'statement.text': 'We build places Berlin comes back to. From the store that opens its doors at 4:30 a.m. <span class="pill" data-pill="h25"></span> to croffles in Zehlendorf <span class="pill" data-pill="wac"></span> and brisket that spent fourteen hours in the smoker. <span class="pill" data-pill="meat"></span>',
      'zahlen.label': 'The group in numbers',
      'zahlen.titel': 'Built to <em>grow.</em>',
      'marken.label': 'The portfolio',
      'marken.titel': 'Three brands. <em>Each one its own world.</em>',
      'marken.text': 'Every brand of the group has its own face, its own menu and its own website. Click through to each one.',
      'marke.besuchen': 'Visit website',
      'marke.standort': 'Location',
      'marke.konzept': 'Concept',
      'sortiment.label': 'Range',
      'sortiment.titel': 'More than 100 products. <em>Three ranges.</em>',
      'standorte.label': 'Locations',
      'standorte.titel': 'At home <em>across Berlin.</em>',
      'standorte.text': 'Mitte, Zehlendorf and Märkisches Viertel. Charlottenburg is next.',
      'standorte.route': 'Directions',
      'standorte.bald': 'In preparation',
      'standorte.adresseFolgt': 'Address to follow',
      'standorte.offen': 'Open now',
      'standorte.zu': 'Closed now',
      'standorte.oeffnet': 'Opens',
      'standorte.schliesst': 'until',
      'standorte.zeitenWebsite': 'Opening hours on the website',
      'prinzipien.label': 'What drives us',
      'prinzipien.titel': 'Four principles. <em>Every location.</em>',
      'p1.titel': 'Our own brands',
      'p1.text': 'Every brand has its own face, its own menu and its own website. No copy, no off the shelf franchise.',
      'p2.titel': 'Product first',
      'p2.text': 'Fourteen hours in the smoker, croissants filled by hand, shelves stocked before sunrise. Quality is not a promise for us, it is the routine.',
      'p3.titel': 'Neighbourhood',
      'p3.text': 'Mitte, Zehlendorf, Märkisches Viertel. We build places for the people who are there every single day.',
      'p4.titel': 'Growth with a plan',
      'p4.text': 'Charlottenburg is the next location. We grow where a brand is genuinely needed.',
      'wachstum.label': 'Growth',
      'wachstum.titel': 'Next stop: <em>Charlottenburg.</em>',
      'wachstum.text': 'The group keeps growing. We are looking for the right spaces, partners and people in Berlin.',
      'w1.titel': 'For landlords',
      'w1.text': 'Retail and food spaces with footfall. We bring established brands, content and a team that delivers.',
      'w2.titel': 'For partners',
      'w2.text': 'Suppliers, delivery platforms, brands and creators who want to build something with us.',
      'w3.titel': 'For talent',
      'w3.text': 'Kitchen, smoker, barista, service and store. Three brands, many ways in.',
      'kontakt.label': 'Contact',
      'kontakt.titel': 'Let’s <em>talk.</em>',
      'kontakt.text': 'Enquiries about spaces, partnerships and careers.',
      'kontakt.marken': 'Reach our brands directly',
      'kontakt.mail': 'Write to us',
      'footer.rechte': 'All rights reserved.',
      'footer.impressum': 'Legal notice',
      'footer.datenschutz': 'Privacy',
      'footer.karte': 'Map: Berlin district borders, open data.',
      'footer.oben': 'Back to top',
      'modal.schliessen': 'Close',
      'modal.impressum': 'Legal notice',
      'modal.datenschutz': 'Privacy',
      'modal.folgt': 'Details will be added before the official launch.',
      'modal.ds': 'This website does not use cookies or tracking. Fonts, videos and images are served from this server, no data is sent to third parties. Links to the brand websites and Instagram open external pages with their own privacy policies.'
    }
  }
};
