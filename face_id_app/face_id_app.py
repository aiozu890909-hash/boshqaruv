"""
face_id_app.py
===============
Yagona Ta'lim Davomat Tizimi — Face ID (Python, bitta fayl).

Bu versiya "DeepFace" kutubxonasidan foydalanadi — dlib/CMake/Visual Studio
Build Tools kabi tizim darajasidagi o'rnatishlar SHART EMAS. Faqat
"pip install" orqali o'rnatiladi (TensorFlow tayyor paket sifatida keladi).

ISHLASH TARTIBI (qat'iy ketma-ketlik):
  1) API key .env'dan o'qiladi          -> bo'lmasa dastur TO'XTAYDI
  2) Key serverda tekshiriladi           -> noto'g'ri bo'lsa TO'XTAYDI
  3) Faqat shu key'ga biriktirilgan odamlar yuklanadi
  4) Shundan keyingina kamera ochiladi va yuzni aniqlash boshlanadi
  5) Aniqlangan odam — shu key orqali to'g'ri Google Sheets joyiga yoziladi

O'rnatish (faqat shu pip paketlar, boshqa hech narsa kerak emas):
    pip install "deepface[tensorflow]" tf-keras opencv-python numpy requests python-dotenv

    Birinchi ishga tushirishda DeepFace kerakli modelni (Facenet, ~90MB)
    internetdan avtomatik yuklab oladi — bu ham kutubxonaning o'zi bajaradi,
    qo'lda hech narsa o'rnatish shart emas.

Sozlash:
    Shu fayl bilan bir joyda ".env" fayl yarating:
        FACE_ID_API_KEY=mkt_sizning_api_keyingiz
        API_BASE_URL=https://script.google.com/macros/s/.../exec
        FACE_MATCH_TOLERANCE=0.30
        CAMERA_INDEX=0

    API_BASE_URL — bu Google Apps Script backend joylashtirilgan (Deploy)
    web-ilovaning "/exec" havolasi. Bitta URL — barcha amallar shu bitta
    manzilga POST qilinadi, "action" maydoni orqali farqlanadi.

Ishga tushirish:
    python face_id_app.py
"""

import os
import sys
import time
from datetime import date

import cv2
import numpy as np
import requests
from dotenv import load_dotenv
from deepface import DeepFace


# ============================================================
# 1-QISM: SOZLAMALAR VA API KEY TEKSHIRUVI
# ============================================================

def _fail(message: str):
    print(f"\n❌ XATOLIK: {message}")
    print("   Dastur to'xtatildi. API key bo'lmasa yoki noto'g'ri bo'lsa Face ID ishlay olmaydi.\n")
    sys.exit(1)


def load_config() -> dict:
    load_dotenv()

    api_key = os.getenv("FACE_ID_API_KEY", "").strip()
    api_base = os.getenv("API_BASE_URL", "").strip()

    # API key umuman berilmagan bo'lsa — darhol to'xtaymiz.
    # Kamera hali ochilmagan, hech qanday so'rov hali yuborilmagan.
    if not api_key:
        _fail(
            "API key topilmadi.\n"
            "   .env faylida FACE_ID_API_KEY=... qiymatini kiriting."
        )

    if len(api_key) < 10:
        _fail("API key noto'g'ri formatda ko'rinadi (juda qisqa).")

    if not api_base:
        _fail(
            "API_BASE_URL topilmadi.\n"
            "   .env faylida API_BASE_URL=https://sizning-backendingiz.uz/api qiymatini kiriting."
        )

    return {
        "api_key": api_key,
        "api_base": api_base.rstrip("/"),
        # DeepFace uchun kichikroq qiymat = qattiqroq moslik (cosine distance)
        "tolerance": float(os.getenv("FACE_MATCH_TOLERANCE", "0.30")),
        "camera_index": int(os.getenv("CAMERA_INDEX", "0")),
    }


# ============================================================
# 2-QISM: BACKEND BILAN ALOQA (API KEY ORQALI)
# ============================================================

class ApiClient:
    """
    MUHIM: Backend Google Apps Script'da yozilgan. GAS kiruvchi so'rovda
    "Authorization" headerini o'qiy olmaydi, shuning uchun api_key har doim
    JSON TANASIDA yuboriladi — bitta URL, "action" maydoni orqali yo'naltiriladi.
    """

    def __init__(self, api_base: str, api_key: str):
        self.api_base = api_base  # GAS web-ilova /exec havolasi (bitta URL)
        self.api_key = api_key
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})

    def _call(self, action: str, extra: dict = None) -> dict:
        payload = {"action": action, "api_key": self.api_key}
        if extra:
            payload.update(extra)
        try:
            resp = self.session.post(self.api_base, json=payload, timeout=15)
        except requests.RequestException as e:
            _fail(f"Serverga ulanib bo'lmadi: {e}")

        try:
            data = resp.json()
        except ValueError:
            _fail(f"Serverdan noto'g'ri javob keldi: {resp.text[:200]}")

        if isinstance(data, dict) and data.get("error"):
            code = data.get("code", 400)
            if code in (401, 403):
                _fail(f"API key noto'g'ri yoki bekor qilingan: {data.get('message')}")
            _fail(f"Server xatosi: {data.get('message')}")

        return data

    def verify_key(self) -> dict:
        """Key haqiqiyligini serverdan so'raydi. Noto'g'ri bo'lsa dastur to'xtaydi."""
        data = self._call("verify-key")
        nomi = data.get("nomi", "Noma'lum bo'g'in")
        print(f"✅ Tasdiqlandi: {nomi}")
        return data

    def fetch_people(self) -> list:
        """Faqat shu API key'ga biriktirilgan odamlarning ro'yxatini oladi."""
        people = self._call("people-by-key")
        if not people:
            print("⚠️  Bu API key'ga hech qanday odam biriktirilmagan (yoki hali encoding yo'q).")
        return people

    def mark_attendance(self, person_id: str, status: str = "keldi") -> bool:
        """
        Davomatni yuboradi — server shu key orqali to'g'ri Sheets joyiga yozadi.
        Fatal emas: tarmoq muammosi bo'lsa dastur to'xtamaydi, faqat ogohlantiradi
        (chunki kamera davom etib turishi kerak).
        """
        payload = {"action": "attendance", "api_key": self.api_key,
                   "person_id": person_id, "status": status}
        try:
            resp = self.session.post(self.api_base, json=payload, timeout=10)
            data = resp.json()
        except (requests.RequestException, ValueError) as e:
            print(f"⚠️  Davomat yuborilmadi (tarmoq xatosi): {e}")
            return False

        if isinstance(data, dict) and data.get("error"):
            print(f"⚠️  Davomat yuborilmadi: {data.get('message')}")
            return False

        return True


# ============================================================
# 3-QISM: YUZNI ANIQLASH DVIGATELI (DeepFace, faqat yuklangan odamlar ichida)
# ============================================================

class FaceEngine:
    # "opencv" detektori — qo'shimcha yuklab olishsiz, eng tez ishlaydigan variant
    MODEL_NAME = "Facenet"
    DETECTOR_BACKEND = "opencv"

    def __init__(self, people: list, tolerance: float = 0.30):
        self.tolerance = tolerance
        self.known_encodings = []
        self.known_ids = []
        self.known_names = []

        for person in people:
            encoding = person.get("encoding")
            if not encoding:
                continue
            vec = np.array(encoding, dtype=np.float64)
            self.known_encodings.append(vec / np.linalg.norm(vec))
            self.known_ids.append(person["id"])
            self.known_names.append(person.get("ism_familiya", "Noma'lum"))

        print(f"👥 {len(self.known_ids)} ta odam yuklandi (shu API key doirasida)")

    @staticmethod
    def _cosine_distance(a: np.ndarray, b_normalized: np.ndarray) -> float:
        a_normalized = a / np.linalg.norm(a)
        return 1.0 - float(np.dot(a_normalized, b_normalized))

    def recognize_frame(self, frame) -> list:
        """Bitta kadrni tahlil qiladi va topilgan odamlar ro'yxatini qaytaradi."""
        if not self.known_encodings:
            return []

        try:
            reps = DeepFace.represent(
                img_path=frame,
                model_name=self.MODEL_NAME,
                detector_backend=self.DETECTOR_BACKEND,
                enforce_detection=False,
            )
        except Exception:
            return []

        results = []
        for rep in reps:
            region = rep.get("facial_area", {}) or {}
            # DeepFace yuz topa olmasa ham bo'sh natija qaytarishi mumkin — shuni tekshiramiz
            if region.get("w", 0) < 20 or region.get("h", 0) < 20:
                continue

            embedding = np.array(rep["embedding"], dtype=np.float64)
            distances = [self._cosine_distance(embedding, k) for k in self.known_encodings]
            best_idx = int(np.argmin(distances))

            if distances[best_idx] < self.tolerance:
                x, y = region.get("x", 0), region.get("y", 0)
                w, h = region.get("w", 0), region.get("h", 0)
                results.append({
                    "id": self.known_ids[best_idx],
                    "ism_familiya": self.known_names[best_idx],
                    "location": (y, x + w, y + h, x),  # (top, right, bottom, left)
                    "distance": distances[best_idx],
                })
        return results


# ============================================================
# 4-QISM: ASOSIY DASTUR (kamera sikli)
# ============================================================

def main():
    print("=" * 55)
    print("  YAGONA TA'LIM DAVOMAT TIZIMI — Face ID (Python)")
    print("=" * 55)

    # --- 1-2) API key majburiy: yo'q yoki noto'g'ri bo'lsa to'xtaydi ---
    cfg = load_config()
    client = ApiClient(api_base=cfg["api_base"], api_key=cfg["api_key"])
    school_info = client.verify_key()

    # --- 3) Faqat shu key'ga tegishli odamlar yuklanadi ---
    people = client.fetch_people()
    engine = FaceEngine(people, tolerance=cfg["tolerance"])

    if not engine.known_ids:
        _fail("Tanish uchun hech kim yo'q.")

    # --- 4) Kamera faqat shu nuqtadan keyin ochiladi ---
    cam = cv2.VideoCapture(cfg["camera_index"])
    if not cam.isOpened():
        _fail("Kamera ochilmadi. Ulanishni tekshiring.")

    print("\n📷 Kamera ishga tushdi. Chiqish uchun 'q' tugmasini bosing.\n")

    marked_today = set()
    today = date.today().isoformat()
    last_scan = 0
    scan_interval = 1.0  # sekundiga 1 marta tahlil (CPU tejash)

    try:
        while True:
            ok, frame = cam.read()
            if not ok:
                print("⚠️  Kameradan kadr olinmadi.")
                break

            now = time.time()
            if now - last_scan >= scan_interval:
                last_scan = now

                if date.today().isoformat() != today:
                    today = date.today().isoformat()
                    marked_today.clear()

                matches = engine.recognize_frame(frame)
                for m in matches:
                    top, right, bottom, left = m["location"]
                    label = m["ism_familiya"]

                    if m["id"] not in marked_today:
                        # --- 5) Davomatni yuboramiz (API key orqali to'g'ri joyga) ---
                        sent = client.mark_attendance(m["id"], status="keldi")
                        if sent:
                            marked_today.add(m["id"])
                            print(f"✅ {label} — davomatga yozildi ({time.strftime('%H:%M:%S')})")
                            label = f"{label} ✓"
                    else:
                        label = f"{label} (belgilangan)"

                    cv2.rectangle(frame, (left, top), (right, bottom), (0, 200, 0), 2)
                    cv2.putText(frame, label, (left, top - 10),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 200, 0), 2)

            cv2.imshow(f"Face ID — {school_info.get('nomi', '')}", frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
    finally:
        cam.release()
        cv2.destroyAllWindows()
        print("\n👋 Dastur to'xtatildi.")


if __name__ == "__main__":
    main()
