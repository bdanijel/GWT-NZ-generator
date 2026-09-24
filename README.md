# Great Western Trail: New Zealand - Companion & Scoring Pad 🐑🇳🇿

Moderna, responsivna veb aplikacija prilagođena za **mobilne telefone, tablete i računare**, namenjena igračima društvene igre **Great Western Trail: New Zealand** (autor: Alexander Pfister, Plan B Games / Eggertspiele).

Aplikacija omogućava automatsku pripremu partije (Setup Generator) po zvaničnim pravilima, interaktivno računanje poena na kraju igre (12 kategorija sa scoring pad-a), enciklopediju pravila i komponenti, i pomoćnika za Solo Sarah automa mod.

---

## 📱 Optimizovano za mobilne telefone i tablete
- **Dodirni steperi (+/-)** za unos poena na telefonu tokom igre bez iskakanja tastature.
- **Donja traka za brzu navigaciju palcem (Mobile Bottom Bar)**.
- **Prilagodljiv prikaz (Responsive layout)** za sve veličine ekrana (telefoni, tableti u portrait i landscape orijentaciji, laptopovi).
- **Offline / LocalStorage čuvanje**: Podaci i arhive se automatski čuvaju na vašem uređaju.

---

## ✨ Ključne Funkcionalnosti

1. **🎲 Generator Početnog Setup-a**:
   - Izbor broja igrača (1 Solo Sarah, 2, 3, 4 igrača).
   - Nasumičan izbor 4 seta bonus karata (od 10) sa raspodelom po ceni u zlatu: Kormilo (3G), Bure (3G), Zvono (4G), Kompas (5G).
   - Skaliranje broja karata prema broju igrača (2p: 3 karte, 3p: 5 karata, 4p: 6 karata).
   - Nasumično izvlačenje 5 pločica lučkih kapetana na tablu morskih ruta (3 se vraćaju u kutiju).
   - Wellington priprema (12, 13 ili 14 pločica iz vreće A, početni radnici, berza bonusa).
   - Simulirano tržište ovaca poređano po zvaničnom redosledu boja.
   - Prikaz početnog kapitala, karata i žetona zamene za svakog igrača.
   - Interaktivna čeklista za postavljanje igre.

2. **🧮 Zvanični Kalkulator Poena (Scoring Pad - 12 Kategorija)**:
   - 1. Novac (£): 1 VP na svakih 5 funti.
   - 2. Privatne zgrade: zbir poena postavljenih zgrada.
   - 3. Trgovačke stanice: lokalne, strane, vuna (-8 VP na polju 0, zelene strelice).
   - 4. Luke i pristaništa: male i srednje luke + 4 VP parovi malih luka.
   - 5. Pathfinder staza: 0, 1, 2, 4, 7, 10 ili 15 VP.
   - 6. Pločice nepogoda i bonusa: 2, 3, 4 VP + bonus pločice.
   - 7. Ovce i bonus karte u špilu.
   - 8. Karte ciljeva: ispunjene (+VP) minus neispunjene (-VP).
   - 9. Pločice lučkih kapetana: zadaci sa osvojenih pločica.
   - 10. Disk za limit karata: 3 VP za oslobođeni tamni disk.
   - 11. Radnici na 5. mestu i skladišta: 4 VP po radniku + parovi skladišta.
   - 12. Token za kraj igre: 5 VP za nosioca tokena.
   - Poredak uživo, komparativna tabela i čuvanje partija.

3. **📖 Pravila & Enciklopedija**:
   - Vodič kroz faze poteza (Faza A, B, C) i 4 podfaze Wellingtona.
   - **Simulator striže ovaca**: kalkulator prihoda od vune i dostupnih stanica (5, 9, 13).
   - Katalog 10 rasa ovaca sa svim parametrima.
   - Katalog 10 setova bonus karata i 8 kapetana.

4. **🤖 Solo Sarah Režim**:
   - Pomoćnik i pravila za igru protiv zvanične autome.

---

## 🚀 Pokretanje i Razvoj

### Zahtevi
- [Node.js](https://nodejs.org/) verzija 18 ili novija
- `npm` ili `bun`

### Instalacija i lokalno pokretanje
```bash
# 1. Kloniranje repozitorijuma
git clone https://github.com/<vas-username>/<ime-repozitorijuma>.git
cd <ime-repozitorijuma>

# 2. Instalacija zavisnosti
npm install

# 3. Pokretanje razvojnog servera
npm run dev
```
Aplikacija će biti dostupna na `http://localhost:3000`.

### Bildovanje za produkciju
```bash
npm run build
```
Izlazni fajlovi će biti generisani u `dist/` direktorijumu.

---

## 🌐 Automatski Publish na GitHub Pages (preko GitHub Actions)

U projektu se već nalazi pripremljen GitHub Actions workflow (`.github/workflows/deploy.yml`).

Da biste aktivirali automatski deployment:
1. Push-ujte kod na vaš GitHub repozitorijum (na `main` ili `master` granu).
2. Na GitHub-u otvorite repozitorijum i idite na:
   **Settings** -> **Pages**
3. U delu **Build and deployment**:
   - Za **Source** izaberite: **GitHub Actions**
4. Svaki sledeći `git push` će automatski pokrenuti akciju, kompajlirati aplikaciju i objaviti je na vašem GitHub Pages URL-u (`https://<username>.github.io/<repo>/`).

---

## 📜 Licenca i Zasluge
Igru *Great Western Trail: New Zealand* kreirao je Alexander Pfister, a izdavači su Plan B Games / Eggertspiele. Ova aplikacija je nezavisni besplatni pomoćnik (fan companion app) otvorenog koda za ljubitelje društvene igre.
