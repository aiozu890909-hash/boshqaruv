# Yagona Ta'lim Davomat va Nazorat Tizimi

Viloyat → Tuman → Maktab → O'quvchi bosqichlari bo'yicha boshqariladigan, Face ID (Python) orqali avtomatik davomat oladigan markazlashgan ta'lim monitoring tizimi.

## Tarkib

- **`index.html`** — to'liq ishlaydigan sayt prototipi (bitta fayl, barcha panellar bilan: Super Admin, Viloyat Admin, Tuman Admin, Maktab Admin, Xodim kabineti, Python Kiosk ekranlari). Ochish uchun brauzerda `index.html`ni oching yoki GitHub Pages orqali deploy qiling.
- **`docs/Yagona_Talim_Davomat_Tizimi.pdf`** — loyihaning to'liq arxitektura hujjati: tizim tuzilmasi, Face ID (Python) mexanizmi, API key hayotiy sikli, Google Sheets/Drive integratsiyasi, texnologiyalar va rivojlantirish rejasi.
- **`design/DESIGN.md`** — dizayn tizimi (ranglar, tipografiya, komponentlar).
- **`design/screens/`** — har bir ekranning original dizayn eksporti (alohida `code.html` + `screen.png`).

## Arxitektura (qisqacha)

4 bosqichli ierarxik tizim:

1. **Umumiy kontrol tizimi** (Bosh admin) — Viloyatlarni yaratadi
2. **Viloyat bosh admin tizimi** — Tumanlarni yaratadi
3. **Tuman bosh tizimi** — Maktablarni yaratadi
4. **Maktab bosh tizimi** — O'quvchilarni ro'yxatga oladi, Face ID uchun rasm biriktiradi

Har bir daraja yaratilganda tizim avtomatik **API key** generatsiya qiladi. Bu key:
- Face ID Python ilovasida faqat o'sha key'ga biriktirilgan odamlarni tanish doirasini belgilaydi
- Davomat natijasini to'g'ri Google Sheets joyiga yozish uchun ishlatiladi

Batafsil: `docs/Yagona_Talim_Davomat_Tizimi.pdf`

## Keyingi bosqichlar (TODO)

- [ ] Backend API (Node.js/FastAPI) — autentifikatsiya, API key boshqaruvi, Google Sheets/Drive integratsiyasi
- [ ] Python Face ID xizmati (face_recognition/OpenCV + FastAPI)
- [ ] `index.html`dagi statik prototipni real backend'ga ulash

## Backend (Google Apps Script)

- `backend/Code.gs` — Google Sheets + Drive ustida ishlaydigan backend. Ishlatishdan oldin `SUPER_ADMIN_LOGIN` / `SUPER_ADMIN_PAROL` ni o'zingiz belgilang (repoga haqiqiy parol yozmang).
- `backend/YDT_Google_Sheets_Baza.xlsx` — Sheets varaqlari tuzilmasi namunasi.
- Joriy web-ilova manzili (`/exec`):
  `https://script.google.com/macros/s/AKfycbyi7QaRZME4mtbGInMPu3V-heXzbNm4yMopcwf1HOeWiv_oJ06QNFLxwYvQLBIJdNzu/exec`

## Face ID ilovasi (Python)

`face_id_app/` papkasida: `face_id_app.py`, `requirements.txt`, `.env.example` (`API_BASE_URL` shu yerda oldindan yozilgan).

```bash
cd face_id_app
pip install -r requirements.txt
cp .env.example .env    # keyin FACE_ID_API_KEY ni to'ldiring
python face_id_app.py
```
