# Tuman Ta'lim Boshqarmasi — Davomat Tizimi

Faqat **Tuman** darajasida ishlaydigan soddalashtirilgan davomat va nazorat tizimi. Tuman admin — yagona yuqori boshqaruvchi: u Maktablarni va Xodimlarni to'g'ridan-to'g'ri yaratadi va kuzatadi. Har bir maktab o'z o'quvchilari va Face ID davomatini boshqaradi.

## Tarkib

- **`index.html`** — to'liq ishlaydigan sayt (Tuman Admin paneli, Maktablar boshqaruvi, Maktab Admin paneli, Face ID Kiosklari). Google Apps Script orqali xizmat qiladi.
- **`backend/Code.gs`** — Google Sheets + Drive ustida ishlaydigan backend. Ishlatishdan oldin `TUMAN_ADMIN_LOGIN` / `TUMAN_ADMIN_PAROL` / `TUMAN_NOMI`ni o'zingiz belgilang.
- **`backend/TDT_Google_Sheets_Baza.xlsx`** — Sheets varaqlari tuzilmasi namunasi (Maktablar, Oquvchilar, Xodimlar, ApiKeys, Davomat, XodimDavomat).
- **`docs/`** — loyihaning to'liq arxitektura hujjati (PDF).
- **`design/`** — original Stitch dizayn eksportlari (ikkala versiya: ko'p bosqichli va tuman-darajasi).
- **`face_id_app/`** — Python Face ID ilovasi (DeepFace asosida, qo'shimcha tizim kutubxonalarisiz o'rnatiladi).

## O'rnatish

1. Yangi Google Sheets fayl yarating.
2. Extensions → Apps Script → `backend/Code.gs` mazmunini joylashtiring.
3. Fayl → Yangi → HTML → nomini **`index`** deb qo'ying → `index.html` mazmunini joylashtiring.
4. `Code.gs` boshidagi `TUMAN_NOMI`, `TUMAN_ADMIN_LOGIN`, `TUMAN_ADMIN_PAROL`ni to'ldiring.
5. `setup()` funksiyasini bir marta ishga tushiring.
6. Deploy → New deployment → Web app (Execute as: Me, Who has access: Anyone).
7. Chiqqan `/exec` havolani oching — sayt to'g'ridan-to'g'ri shu yerda ishlaydi.

## Arxitektura (qisqacha)

```
Tuman Admin
 ├── Maktablar yaratadi (har biri o'z login/parol/API key bilan)
 │     └── Maktab Admin → O'quvchilar qo'shadi → Face ID orqali davomat
 └── Xodimlar yaratadi (har biri o'z API key bilan kelish/ketishni belgilaydi)
```

Har bir yaratilgan bo'g'in uchun tizim avtomatik **API key** generatsiya qiladi: bu key Face ID ilovasida "kimni tanish mumkin"ligini belgilaydi va davomat natijasini to'g'ri Google Sheets joyiga yozadi.
