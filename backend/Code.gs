/**
 * ============================================================
 * YAGONA TA'LIM DAVOMAT VA NAZORAT TIZIMI — BACKEND (Google Apps Script)
 * ============================================================
 *
 * O'RNATISH:
 * 1) Yangi Google Sheets fayl yarating (masalan "YDT_Baza").
 * 2) Extensions -> Apps Script -> shu faylni Code.gs sifatida joylashtiring.
 * 3) setup() funksiyasini BIR MARTA ishga tushiring (yuqoridagi ▶ tugma,
 *    funksiya nomini "setup" qilib tanlang) — bu barcha kerakli varaqlarni
 *    (Viloyatlar, Tumanlar, ... ) sarlavhalari bilan avtomatik yaratadi
 *    va rasm fayllari uchun Google Drive papkasini tayyorlaydi.
 * 4) Deploy -> New deployment -> Web app:
 *      Execute as: Me
 *      Who has access: Anyone
 *    "Deploy" tugmasini bosing, chiqqan URL manzilni nusxalang.
 * 5) Shu URL manzilni Python ilovadagi API_BASE_URL sifatida ishlating.
 *
 * MUHIM: Apps Script web-ilovalari kiruvchi so'rovda "Authorization"
 * headerini o'qiy olmaydi (bu Google'ning platforma cheklovi). Shuning
 * uchun API key har doim so'rov TANASIDA (POST/JSON) yoki QUERY
 * PARAMETRIDA (GET) yuboriladi — header orqali emas.
 * ============================================================
 */

// ---------------------------------------------------------------
// SOZLAMALAR
// ---------------------------------------------------------------

const SHEET_NAMES = {
  VILOYATLAR: "Viloyatlar",
  TUMANLAR: "Tumanlar",
  MAKTABLAR: "Maktablar",
  OQUVCHILAR: "Oquvchilar",
  XODIMLAR: "Xodimlar",
  API_KEYS: "ApiKeys",
  DAVOMAT: "Davomat",
};

const HEADERS = {
  VILOYATLAR: ["ID", "Nomi", "Admin_Login", "Admin_Parol_Hash", "API_Key", "Masul_Xodim", "Yaratilgan_Sana"],
  TUMANLAR: ["ID", "Viloyat_ID", "Nomi", "Admin_Login", "Admin_Parol_Hash", "API_Key", "Masul_Xodim", "Yaratilgan_Sana"],
  MAKTABLAR: ["ID", "Tuman_ID", "Nomi", "Maktab_Raqami", "Direktor", "Admin_Login", "Admin_Parol_Hash", "API_Key", "Yaratilgan_Sana"],
  OQUVCHILAR: ["ID", "Maktab_ID", "Ism", "Familiya", "Sinf", "Rasm_URL", "Face_Encoding", "Yaratilgan_Sana"],
  XODIMLAR: ["ID", "Bogliq_Turi", "Bogliq_ID", "Ism_Familiya", "Ish_Sohasi", "Rasm_URL", "API_Key", "Yaratilgan_Sana"],
  API_KEYS: ["API_Key", "Turi", "Bogliq_ID", "Nomi", "Yaratilgan_Sana", "Holat"],
  DAVOMAT: ["ID", "Oquvchi_ID", "Maktab_ID", "Ism_Familiya", "Sana", "Vaqt", "Holat", "Manba"],
};

const DRIVE_FOLDER_PROP_KEY = "PHOTOS_FOLDER_ID"; // ichki xususiyat nomi (o'zgartirmang)

// Rasmlar saqlanadigan Google Drive papkasi ID'si (papka havolasidagi /folders/ dan keyingi qism)
const DRIVE_FOLDER_ID = ""; // bo'sh bo'lsa setup() yangi papka yaratadi

// ★ BOSH ADMIN (Super Admin) LOGIN VA PAROLI ★
const SUPER_ADMIN_LOGIN = "SHU_YERGA_LOGIN_YOZING";
const SUPER_ADMIN_PAROL = "SHU_YERGA_PAROL_YOZING";

// ★ GOOGLE SHEETS ID SHU YERGA QO'YILADI ★
// Agar skriptni Sheets ichidan (Extensions -> Apps Script) ochgan bo'lsangiz —
// BO'SH QOLDIRING (avtomatik shu jadvalga ulanadi).
// Agar script.google.com'dan alohida (standalone) ochgan bo'lsangiz — ID ni yozing.
// ID — jadval havolasidagi /d/ va /edit orasidagi uzun matn:
//   https://docs.google.com/spreadsheets/d/  1AbC...xyz  /edit
const SPREADSHEET_ID = ""; // Sheets ichidan ochilgan bo'lsa bo'sh qoldiring

function getSpreadsheet_() {
  return SPREADSHEET_ID
    ? SpreadsheetApp.openById(SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();
}

// ---------------------------------------------------------------
// BIR MARTALIK O'RNATISH
// ---------------------------------------------------------------

function setup() {
  const ss = getSpreadsheet_();

  Object.keys(SHEET_NAMES).forEach(function (key) {
    const name = SHEET_NAMES[key];
    let sheet = ss.getSheetByName(name);
    if (!sheet) sheet = ss.insertSheet(name);
    const headers = HEADERS[key];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#16325c").setFontColor("#ffffff");
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, headers.length);
  });

  // standart "Sheet1" bo'lsa o'chiramiz
  const def = ss.getSheetByName("Sheet1");
  if (def) ss.deleteSheet(def);

  // Google Drive'da rasm fayllari uchun papka
  const props = PropertiesService.getScriptProperties();
  if (!DRIVE_FOLDER_ID && !props.getProperty(DRIVE_FOLDER_PROP_KEY)) {
    const folder = DriveApp.createFolder("YDT_Rasmlar");
    props.setProperty(DRIVE_FOLDER_PROP_KEY, folder.getId());
  }

  try {
    SpreadsheetApp.getUi().alert("✅ Baza tayyor! Endi Deploy -> New deployment orqali web-ilovani joylashtiring.");
  } catch (e) {
    Logger.log("✅ Baza tayyor! Endi Deploy -> New deployment orqali web-ilovani joylashtiring.");
  }
}

function getPhotoFolder_() {
  if (DRIVE_FOLDER_ID) return DriveApp.getFolderById(DRIVE_FOLDER_ID);
  const props = PropertiesService.getScriptProperties();
  let id = props.getProperty(DRIVE_FOLDER_PROP_KEY);
  if (!id) {
    const folder = DriveApp.createFolder("YDT_Rasmlar");
    id = folder.getId();
    props.setProperty(DRIVE_FOLDER_PROP_KEY, id);
  }
  return DriveApp.getFolderById(id);
}

// ---------------------------------------------------------------
// YORDAMCHI FUNKSIYALAR
// ---------------------------------------------------------------

function getSheet_(name) {
  const sheet = getSpreadsheet_().getSheetByName(name);
  if (!sheet) throw new Error("Varaq topilmadi: " + name);
  return sheet;
}

function sheetToObjects_(sheet) {
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);
  return rows
    .filter(function (row) { return row.some(function (c) { return c !== "" && c !== null; }); })
    .map(function (row) {
      const obj = {};
      headers.forEach(function (h, i) { obj[h] = row[i]; });
      return obj;
    });
}

function generateId_(prefix) {
  return prefix + "_" + Utilities.getUuid().split("-")[0];
}

function generateApiKey_(prefix) {
  const raw = Utilities.getUuid().replace(/-/g, "");
  return prefix + "_" + raw;
}

function hashPassword_(plain) {
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, plain);
  return digest.map(function (b) { return (b < 0 ? b + 256 : b).toString(16).padStart(2, "0"); }).join("");
}

function jsonResponse_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function errorResponse_(message, code) {
  return jsonResponse_({ error: true, message: message, code: code || 400 });
}

/** ApiKeys jadvalidan key'ni topadi. Topilmasa yoki bekor qilingan bo'lsa null. */
function lookupApiKey_(apiKey) {
  if (!apiKey) return null;
  const rows = sheetToObjects_(getSheet_(SHEET_NAMES.API_KEYS));
  const found = rows.find(function (r) { return r.API_Key === apiKey && r.Holat === "faol"; });
  return found || null;
}

function registerApiKey_(apiKey, turi, bogliqId, nomi) {
  const sheet = getSheet_(SHEET_NAMES.API_KEYS);
  sheet.appendRow([apiKey, turi, bogliqId, nomi, new Date(), "faol"]);
}

function appendRowFromHeaders_(sheetKey, valuesObj) {
  const sheet = getSheet_(SHEET_NAMES[sheetKey]);
  const headers = HEADERS[sheetKey];
  const row = headers.map(function (h) { return valuesObj[h] !== undefined ? valuesObj[h] : ""; });
  sheet.appendRow(row);
  return row;
}

// ---------------------------------------------------------------
// KIRISH (LOGIN) VA SESSIYA
// ---------------------------------------------------------------

/**
 * So'rovni kim yuborayotganini aniqlaydi:
 *  - body.token bo'lsa  -> login orqali olingan sessiya (admin panel)
 *  - aks holda body.api_key -> ApiKeys jadvalidan
 * Natija: { Turi, Bogliq_ID, Nomi } yoki null
 */
function resolveCaller_(body) {
  if (body.token) {
    const raw = CacheService.getScriptCache().get("sess_" + body.token);
    if (!raw) return null;
    const s = JSON.parse(raw);
    return { Turi: s.turi, Bogliq_ID: s.bogliq_id, Nomi: s.nomi };
  }
  return lookupApiKey_(body.api_key);
}

function actionLogin_(body) {
  const login = String(body.login || "").trim();
  const parol = String(body.parol || "");
  if (!login || !parol) return errorResponse_("Login va parolni kiriting", 400);

  const hash = hashPassword_(parol);
  let session = null;

  if (login === SUPER_ADMIN_LOGIN && hash === hashPassword_(SUPER_ADMIN_PAROL)) {
    session = { turi: "superadmin", bogliq_id: "root", nomi: "Bosh Administrator" };
  } else {
    const tables = [["VILOYATLAR", "viloyat"], ["TUMANLAR", "tuman"], ["MAKTABLAR", "maktab"]];
    for (let i = 0; i < tables.length && !session; i++) {
      const rows = sheetToObjects_(getSheet_(SHEET_NAMES[tables[i][0]]));
      const f = rows.find(function (r) { return r.Admin_Login === login && r.Admin_Parol_Hash === hash; });
      if (f) session = { turi: tables[i][1], bogliq_id: f.ID, nomi: f.Nomi };
    }
  }

  if (!session) return errorResponse_("Login yoki parol noto'g'ri", 401);

  const token = Utilities.getUuid().replace(/-/g, "");
  CacheService.getScriptCache().put("sess_" + token, JSON.stringify(session), 21600); // 6 soat
  return jsonResponse_({ ok: true, token: token, turi: session.turi, id: session.bogliq_id, nomi: session.nomi });
}

// ---------------------------------------------------------------
// ROUTER — doGet / doPost
// ---------------------------------------------------------------

function doGet(e) {
  try {
    const action = e.parameter.action;
    if (action === "people-by-key") return actionPeopleByKey_(e.parameter.api_key);
    if (action === "verify-key") return actionVerifyKey_(e.parameter.api_key);
    return errorResponse_("Noma'lum action: " + action, 404);
  } catch (err) {
    return errorResponse_(err.message, 500);
  }
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || "{}");
    const action = body.action;

    switch (action) {
      case "login": return actionLogin_(body);
      case "verify-key": return actionVerifyKey_(body.api_key);
      case "people-by-key": return actionPeopleByKey_(body.api_key);
      case "attendance": return actionAttendance_(body);
      case "create-viloyat": return actionCreateViloyat_(body);
      case "create-tuman": return actionCreateTuman_(body);
      case "create-maktab": return actionCreateMaktab_(body);
      case "create-oquvchi": return actionCreateOquvchi_(body);
      case "upload-photo": return actionUploadPhoto_(body);
      case "save-encoding": return actionSaveEncoding_(body);
      default: return errorResponse_("Noma'lum action: " + action, 404);
    }
  } catch (err) {
    return errorResponse_(err.message, 500);
  }
}

// ---------------------------------------------------------------
// ACTION: verify-key
// ---------------------------------------------------------------

function actionVerifyKey_(apiKey) {
  const found = lookupApiKey_(apiKey);
  if (!found) return errorResponse_("API key noto'g'ri yoki bekor qilingan", 401);

  return jsonResponse_({
    id: found.Bogliq_ID,
    turi: found.Turi,
    nomi: found.Nomi,
  });
}

// ---------------------------------------------------------------
// ACTION: people-by-key  (faqat shu maktabga tegishli o'quvchilar)
// ---------------------------------------------------------------

function actionPeopleByKey_(apiKey) {
  const found = lookupApiKey_(apiKey);
  if (!found) return errorResponse_("API key noto'g'ri yoki bekor qilingan", 401);
  if (found.Turi !== "maktab") return errorResponse_("Bu key maktabga tegishli emas", 403);

  const oquvchilar = sheetToObjects_(getSheet_(SHEET_NAMES.OQUVCHILAR))
    .filter(function (o) { return o.Maktab_ID === found.Bogliq_ID; })
    .filter(function (o) { return o.Face_Encoding; }) // faqat encoding mavjud bo'lganlar
    .map(function (o) {
      let encoding;
      try { encoding = JSON.parse(o.Face_Encoding); } catch (e2) { encoding = null; }
      return {
        id: o.ID,
        ism_familiya: o.Ism + " " + o.Familiya,
        sinf: o.Sinf,
        encoding: encoding,
      };
    })
    .filter(function (o) { return o.encoding; });

  return jsonResponse_(oquvchilar);
}

// ---------------------------------------------------------------
// ACTION: attendance  (davomatni yozish)
// ---------------------------------------------------------------

function actionAttendance_(body) {
  const found = lookupApiKey_(body.api_key);
  if (!found) return errorResponse_("API key noto'g'ri yoki bekor qilingan", 401);
  if (found.Turi !== "maktab") return errorResponse_("Bu key maktabga tegishli emas", 403);

  const oquvchilar = sheetToObjects_(getSheet_(SHEET_NAMES.OQUVCHILAR));
  const student = oquvchilar.find(function (o) { return o.ID === body.person_id; });
  if (!student) return errorResponse_("O'quvchi topilmadi", 404);

  const now = new Date();
  const sana = Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyy-MM-dd");
  const vaqt = Utilities.formatDate(now, Session.getScriptTimeZone(), "HH:mm:ss");

  // bir kunda bitta o'quvchi uchun bitta yozuv (takror bo'lsa yangilanadi)
  const davomatSheet = getSheet_(SHEET_NAMES.DAVOMAT);
  const rows = davomatSheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][1] === body.person_id && rows[i][4] === sana) {
      return jsonResponse_({ ok: true, message: "Bugun allaqachon belgilangan", takrorlangan: true });
    }
  }

  appendRowFromHeaders_("DAVOMAT", {
    ID: generateId_("dav"),
    Oquvchi_ID: student.ID,
    Maktab_ID: student.Maktab_ID,
    Ism_Familiya: student.Ism + " " + student.Familiya,
    Sana: sana,
    Vaqt: vaqt,
    Holat: body.status || "keldi",
    Manba: "face_id",
  });

  return jsonResponse_({ ok: true, message: "Davomat yozildi" });
}

// ---------------------------------------------------------------
// ACTION: create-viloyat / create-tuman / create-maktab / create-oquvchi
// ---------------------------------------------------------------

function actionCreateViloyat_(body) {
  const caller = resolveCaller_(body); // faqat Bosh Admin sessiyasi
  if (!caller || caller.Turi !== "superadmin") return errorResponse_("Ruxsat yo'q: Bosh Admin sifatida kiring", 403);

  const id = generateId_("vil");
  const apiKey = generateApiKey_("vil");
  const parolHash = hashPassword_(body.admin_parol || Utilities.getUuid().slice(0, 8));

  appendRowFromHeaders_("VILOYATLAR", {
    ID: id,
    Nomi: body.nomi,
    Admin_Login: body.admin_login,
    Admin_Parol_Hash: parolHash,
    API_Key: apiKey,
    Masul_Xodim: body.masul_xodim || "",
    Yaratilgan_Sana: new Date(),
  });
  registerApiKey_(apiKey, "viloyat", id, body.nomi);

  return jsonResponse_({ ok: true, id: id, nomi: body.nomi, api_key: apiKey });
}

function actionCreateTuman_(body) {
  const parent = resolveCaller_(body); // viloyat admin (token yoki API key)
  if (!parent || parent.Turi !== "viloyat") return errorResponse_("Ruxsat yo'q: viloyat API key kerak", 403);

  const id = generateId_("tmn");
  const apiKey = generateApiKey_("tmn");
  const parolHash = hashPassword_(body.admin_parol || Utilities.getUuid().slice(0, 8));

  appendRowFromHeaders_("TUMANLAR", {
    ID: id,
    Viloyat_ID: parent.Bogliq_ID,
    Nomi: body.nomi,
    Admin_Login: body.admin_login,
    Admin_Parol_Hash: parolHash,
    API_Key: apiKey,
    Masul_Xodim: body.masul_xodim || "",
    Yaratilgan_Sana: new Date(),
  });
  registerApiKey_(apiKey, "tuman", id, body.nomi);

  return jsonResponse_({ ok: true, id: id, nomi: body.nomi, api_key: apiKey });
}

function actionCreateMaktab_(body) {
  const parent = resolveCaller_(body); // tuman admin (token yoki API key)
  if (!parent || parent.Turi !== "tuman") return errorResponse_("Ruxsat yo'q: tuman API key kerak", 403);

  const id = generateId_("mkt");
  const apiKey = generateApiKey_("mkt");
  const parolHash = hashPassword_(body.admin_parol || Utilities.getUuid().slice(0, 8));

  appendRowFromHeaders_("MAKTABLAR", {
    ID: id,
    Tuman_ID: parent.Bogliq_ID,
    Nomi: body.nomi,
    Maktab_Raqami: body.maktab_raqami || "",
    Direktor: body.direktor || "",
    Admin_Login: body.admin_login,
    Admin_Parol_Hash: parolHash,
    API_Key: apiKey,
    Yaratilgan_Sana: new Date(),
  });
  registerApiKey_(apiKey, "maktab", id, body.nomi);

  return jsonResponse_({ ok: true, id: id, nomi: body.nomi, api_key: apiKey });
}

function actionCreateOquvchi_(body) {
  const parent = resolveCaller_(body); // maktab admin (token yoki API key)
  if (!parent || parent.Turi !== "maktab") return errorResponse_("Ruxsat yo'q: maktab API key kerak", 403);

  const id = generateId_("oqv");

  appendRowFromHeaders_("OQUVCHILAR", {
    ID: id,
    Maktab_ID: parent.Bogliq_ID,
    Ism: body.ism,
    Familiya: body.familiya,
    Sinf: body.sinf || "",
    Rasm_URL: body.rasm_url || "",
    Face_Encoding: "", // enroll.py orqali keyinroq to'ldiriladi (save-encoding)
    Yaratilgan_Sana: new Date(),
  });

  return jsonResponse_({ ok: true, id: id, ism_familiya: body.ism + " " + body.familiya });
}

// ---------------------------------------------------------------
// ACTION: upload-photo  (Google Drive'ga saqlash)
// ---------------------------------------------------------------

function actionUploadPhoto_(body) {
  const found = resolveCaller_(body);
  if (!found) return errorResponse_("API key noto'g'ri yoki bekor qilingan", 401);

  const bytes = Utilities.base64Decode(body.photo_base64);
  const blob = Utilities.newBlob(bytes, body.mime_type || "image/jpeg", (body.file_name || "rasm") + ".jpg");

  const folder = getPhotoFolder_();
  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  const url = "https://drive.google.com/uc?id=" + file.getId();
  return jsonResponse_({ ok: true, rasm_url: url, file_id: file.getId() });
}

// ---------------------------------------------------------------
// ACTION: save-encoding  (Python enroll skripti yuz-vektorni shu yerga yozadi)
// ---------------------------------------------------------------

function actionSaveEncoding_(body) {
  const found = lookupApiKey_(body.api_key);
  if (!found || found.Turi !== "maktab") return errorResponse_("Ruxsat yo'q", 403);

  const sheet = getSheet_(SHEET_NAMES.OQUVCHILAR);
  const data = sheet.getDataRange().getValues();
  const idCol = HEADERS.OQUVCHILAR.indexOf("ID");
  const encCol = HEADERS.OQUVCHILAR.indexOf("Face_Encoding");

  for (let i = 1; i < data.length; i++) {
    if (data[i][idCol] === body.person_id) {
      sheet.getRange(i + 1, encCol + 1).setValue(JSON.stringify(body.encoding));
      return jsonResponse_({ ok: true });
    }
  }
  return errorResponse_("O'quvchi topilmadi", 404);
}
