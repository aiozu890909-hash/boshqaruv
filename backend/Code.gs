/**
 * ============================================================
 * TUMAN TA'LIM BOSHQARMASI — DAVOMAT VA NAZORAT TIZIMI
 * (faqat Tuman darajasi: Tuman -> Maktablar + Xodimlar)
 * ============================================================
 *
 * Ushbu versiya soddalashtirilgan: Viloyat va Bosh Admin darajalari
 * OLIB TASHLANDI. Yagona yuqori boshqaruvchi — TUMAN ADMIN. U:
 *   - Maktablar yaratadi (har biri o'z o'quvchilari va Face ID
 *     davomatini boshqaradi)
 *   - Xodimlar yaratadi va ularning ish vaqtini (kelish/ketish)
 *     kuzatadi
 *
 * O'RNATISH:
 * 1) Yangi Google Sheets fayl yarating.
 * 2) Extensions -> Apps Script -> shu kodni joylashtiring.
 * 3) Fayl -> Yangi -> HTML -> nomini "index" qiling -> sayt kodini joylashtiring.
 * 4) SPREADSHEET_ID, DRIVE_FOLDER_ID, TUMAN_ADMIN_LOGIN/PAROL ni to'ldiring.
 * 5) setup() funksiyasini BIR MARTA ishga tushiring.
 * 6) Deploy -> New deployment -> Web app (Execute as: Me, Who has access: Anyone).
 *
 * MUHIM: Apps Script kiruvchi so'rovda "Authorization" headerini o'qiy
 * olmaydi. Shuning uchun api_key/token har doim so'rov TANASIDA yuboriladi.
 * ============================================================
 */

// ---------------------------------------------------------------
// SOZLAMALAR — shu yerni to'ldiring
// ---------------------------------------------------------------

const SPREADSHEET_ID = ""; // Sheets ichidan ochilgan bo'lsa bo'sh qoldiring
const DRIVE_FOLDER_ID = ""; // bo'sh = setup() ishga tushganda yangi "TDT_Rasmlar" papkasi avtomatik yaratiladi

const TUMAN_NOMI = "Kattaqo'rg'on tumani";
const TUMAN_ADMIN_LOGIN = "SHU_YERGA_LOGIN_YOZING";
const TUMAN_ADMIN_PAROL = "SHU_YERGA_PAROL_YOZING";

// ---------------------------------------------------------------
// JADVAL TUZILMASI
// ---------------------------------------------------------------

const SHEET_NAMES = {
  MAKTABLAR: "Maktablar",
  OQUVCHILAR: "Oquvchilar",
  XODIMLAR: "Xodimlar",
  API_KEYS: "ApiKeys",
  DAVOMAT: "Davomat",          // o'quvchilar — Face ID orqali
  XODIM_DAVOMAT: "XodimDavomat", // xodimlar — kelish/ketish
};

const HEADERS = {
  MAKTABLAR: ["ID", "Nomi", "Maktab_Raqami", "Direktor", "Admin_Login", "Admin_Parol_Hash", "API_Key", "Yaratilgan_Sana"],
  OQUVCHILAR: ["ID", "Maktab_ID", "Ism", "Familiya", "Otasi_Ismi", "Sinf", "Telefon", "Rasm_URL", "Face_Encoding", "Yaratilgan_Sana"],
  XODIMLAR: ["ID", "Ism_Familiya", "Lavozimi", "Rasm_URL", "API_Key", "Yaratilgan_Sana"],
  API_KEYS: ["API_Key", "Turi", "Bogliq_ID", "Nomi", "Yaratilgan_Sana", "Holat"],
  DAVOMAT: ["ID", "Oquvchi_ID", "Maktab_ID", "Ism_Familiya", "Sana", "Vaqt", "Holat", "Manba"],
  XODIM_DAVOMAT: ["ID", "Xodim_ID", "Ism_Familiya", "Sana", "Kelish_Vaqti", "Ketish_Vaqti", "Ish_Soati", "Holat"],
};

const DRIVE_FOLDER_PROP_KEY = "PHOTOS_FOLDER_ID"; // ichki xususiyat nomi, o'zgartirmang

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

  const def = ss.getSheetByName("Sheet1");
  if (def) ss.deleteSheet(def);

  if (!DRIVE_FOLDER_ID) {
    const props = PropertiesService.getScriptProperties();
    if (!props.getProperty(DRIVE_FOLDER_PROP_KEY)) {
      const folder = DriveApp.createFolder("TDT_Rasmlar");
      props.setProperty(DRIVE_FOLDER_PROP_KEY, folder.getId());
    }
  }

  try {
    SpreadsheetApp.getUi().alert("✅ Baza tayyor! Endi Deploy -> New deployment orqali web-ilovani joylashtiring.");
  } catch (e) {
    Logger.log("Baza tayyor.");
  }
}

function getSpreadsheet_() {
  return SPREADSHEET_ID ? SpreadsheetApp.openById(SPREADSHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
}

function getPhotoFolder_() {
  if (DRIVE_FOLDER_ID) return DriveApp.getFolderById(DRIVE_FOLDER_ID);
  const props = PropertiesService.getScriptProperties();
  let id = props.getProperty(DRIVE_FOLDER_PROP_KEY);
  if (!id) {
    const folder = DriveApp.createFolder("TDT_Rasmlar");
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
  return data.slice(1)
    .filter(function (row) { return row.some(function (c) { return c !== "" && c !== null; }); })
    .map(function (row) {
      const obj = {};
      headers.forEach(function (h, i) { obj[h] = row[i]; });
      return obj;
    });
}

function generateId_(prefix) { return prefix + "_" + Utilities.getUuid().split("-")[0]; }
function generateApiKey_(prefix) { return prefix + "_" + Utilities.getUuid().replace(/-/g, ""); }

function hashPassword_(plain) {
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, plain);
  return digest.map(function (b) { return (b < 0 ? b + 256 : b).toString(16).padStart(2, "0"); }).join("");
}

function jsonResponse_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
function errorResponse_(message, code) {
  return jsonResponse_({ error: true, message: message, code: code || 400 });
}
function dStr_(v, fmt) {
  return (v instanceof Date) ? Utilities.formatDate(v, Session.getScriptTimeZone(), fmt) : String(v == null ? "" : v);
}

function lookupApiKey_(apiKey) {
  if (!apiKey) return null;
  const rows = sheetToObjects_(getSheet_(SHEET_NAMES.API_KEYS));
  const found = rows.find(function (r) { return r.API_Key === apiKey && r.Holat === "faol"; });
  return found || null;
}
function registerApiKey_(apiKey, turi, bogliqId, nomi) {
  getSheet_(SHEET_NAMES.API_KEYS).appendRow([apiKey, turi, bogliqId, nomi, new Date(), "faol"]);
}
function appendRowFromHeaders_(sheetKey, valuesObj) {
  const sheet = getSheet_(SHEET_NAMES[sheetKey]);
  const headers = HEADERS[sheetKey];
  const row = headers.map(function (h) { return valuesObj[h] !== undefined ? valuesObj[h] : ""; });
  sheet.appendRow(row);
  return row;
}

/** Sessiya (login orqali token) yoki API key orqali "kim so'rayapti"ni aniqlaydi. */
function resolveCaller_(body) {
  if (body.token) {
    const raw = CacheService.getScriptCache().get("sess_" + body.token);
    if (!raw) return null;
    const s = JSON.parse(raw);
    return { Turi: s.turi, Bogliq_ID: s.bogliq_id, Nomi: s.nomi };
  }
  return lookupApiKey_(body.api_key);
}

function savePhoto_(base64, mime, name) {
  const bytes = Utilities.base64Decode(base64);
  const blob = Utilities.newBlob(bytes, mime || "image/jpeg", name + ".jpg");
  const file = getPhotoFolder_().createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return "https://drive.google.com/uc?id=" + file.getId();
}

// ---------------------------------------------------------------
// LOGIN
// ---------------------------------------------------------------

function actionLogin_(body) {
  const login = String(body.login || "").trim();
  const parol = String(body.parol || "");
  if (!login || !parol) return errorResponse_("Login va parolni kiriting", 400);

  const hash = hashPassword_(parol);
  let session = null;

  if (login === TUMAN_ADMIN_LOGIN && hash === hashPassword_(TUMAN_ADMIN_PAROL)) {
    session = { turi: "tuman", bogliq_id: "root", nomi: TUMAN_NOMI };
  } else {
    const rows = sheetToObjects_(getSheet_(SHEET_NAMES.MAKTABLAR));
    const f = rows.find(function (r) { return r.Admin_Login === login && r.Admin_Parol_Hash === hash; });
    if (f) session = { turi: "maktab", bogliq_id: f.ID, nomi: f.Nomi };
  }

  if (!session) return errorResponse_("Login yoki parol noto'g'ri", 401);

  const token = Utilities.getUuid().replace(/-/g, "");
  CacheService.getScriptCache().put("sess_" + token, JSON.stringify(session), 21600); // 6 soat
  return jsonResponse_({ ok: true, token: token, turi: session.turi, id: session.bogliq_id, nomi: session.nomi });
}

// ---------------------------------------------------------------
// MAKTAB YARATISH (faqat tuman admin)
// ---------------------------------------------------------------

function loginTaken_(login) {
  if (login === TUMAN_ADMIN_LOGIN) return true;
  return sheetToObjects_(getSheet_(SHEET_NAMES.MAKTABLAR)).some(function (r) { return r.Admin_Login === login; });
}

function actionCreateMaktab_(body) {
  const caller = resolveCaller_(body);
  if (!caller || caller.Turi !== "tuman") return errorResponse_("Ruxsat yo'q: Tuman Admin sifatida kiring", 403);
  if (!body.nomi || !String(body.nomi).trim()) return errorResponse_("Maktab nomi kiritilmagan", 400);
  if (!body.admin_login || String(body.admin_login).trim().length < 3) return errorResponse_("Admin login kamida 3 belgi bo'lsin", 400);
  if (!body.admin_parol || String(body.admin_parol).length < 6) return errorResponse_("Parol kamida 6 belgi bo'lsin", 400);
  if (loginTaken_(String(body.admin_login).trim())) return errorResponse_("Bu login band, boshqasini tanlang", 400);

  const id = generateId_("mkt");
  const apiKey = generateApiKey_("mkt");

  appendRowFromHeaders_("MAKTABLAR", {
    ID: id,
    Nomi: String(body.nomi).trim(),
    Maktab_Raqami: body.maktab_raqami || "",
    Direktor: body.direktor || "",
    Admin_Login: String(body.admin_login).trim(),
    Admin_Parol_Hash: hashPassword_(String(body.admin_parol)),
    API_Key: apiKey,
    Yaratilgan_Sana: new Date(),
  });
  registerApiKey_(apiKey, "maktab", id, body.nomi);

  return jsonResponse_({ ok: true, id: id, nomi: body.nomi, api_key: apiKey });
}

// ---------------------------------------------------------------
// XODIM YARATISH (faqat tuman admin) — Face ID kelish/ketish uchun API key
// ---------------------------------------------------------------

function actionCreateXodim_(body) {
  const caller = resolveCaller_(body);
  if (!caller || caller.Turi !== "tuman") return errorResponse_("Ruxsat yo'q: Tuman Admin sifatida kiring", 403);
  if (!body.ism_familiya || !String(body.ism_familiya).trim()) return errorResponse_("Ism-familiya kiritilmagan", 400);

  const id = generateId_("xdm");
  const apiKey = generateApiKey_("xdm");
  let rasm = body.rasm_url || "";
  if (body.photo_base64) rasm = savePhoto_(body.photo_base64, body.mime_type, id);

  appendRowFromHeaders_("XODIMLAR", {
    ID: id,
    Ism_Familiya: String(body.ism_familiya).trim(),
    Lavozimi: body.lavozimi || "",
    Rasm_URL: rasm,
    API_Key: apiKey,
    Yaratilgan_Sana: new Date(),
  });
  registerApiKey_(apiKey, "xodim", id, body.ism_familiya);

  return jsonResponse_({ ok: true, id: id, nomi: body.ism_familiya, api_key: apiKey });
}

// ---------------------------------------------------------------
// O'QUVCHI YARATISH (faqat maktab admin)
// ---------------------------------------------------------------

function actionCreateOquvchi_(body) {
  const caller = resolveCaller_(body);
  if (!caller || caller.Turi !== "maktab") return errorResponse_("Ruxsat yo'q: Maktab Admin sifatida kiring", 403);
  if (!body.ism || !String(body.ism).trim() || !body.familiya || !String(body.familiya).trim())
    return errorResponse_("Ism va familiya kiritilishi shart", 400);

  const id = generateId_("oqv");
  let rasm = body.rasm_url || "";
  if (body.photo_base64) rasm = savePhoto_(body.photo_base64, body.mime_type, id);

  appendRowFromHeaders_("OQUVCHILAR", {
    ID: id,
    Maktab_ID: caller.Bogliq_ID,
    Ism: String(body.ism).trim(),
    Familiya: String(body.familiya).trim(),
    Otasi_Ismi: body.otasi_ismi || "",
    Sinf: body.sinf || "",
    Telefon: body.telefon || "",
    Rasm_URL: rasm,
    Face_Encoding: "", // Python Face ID ilovasi avtomatik to'ldiradi
    Yaratilgan_Sana: new Date(),
  });
  return jsonResponse_({ ok: true, id: id, ism_familiya: body.ism + " " + body.familiya, rasm_url: rasm });
}

// ---------------------------------------------------------------
// FACE ID (O'QUVCHI) — verify-key / people-by-key / attendance
// ---------------------------------------------------------------

function actionVerifyKey_(apiKey) {
  const found = lookupApiKey_(apiKey);
  if (!found) return errorResponse_("API key noto'g'ri yoki bekor qilingan", 401);
  return jsonResponse_({ id: found.Bogliq_ID, turi: found.Turi, nomi: found.Nomi });
}

function actionPeopleByKey_(apiKey) {
  const found = lookupApiKey_(apiKey);
  if (!found) return errorResponse_("API key noto'g'ri yoki bekor qilingan", 401);
  if (found.Turi !== "maktab") return errorResponse_("Bu key maktabga tegishli emas", 403);

  const people = sheetToObjects_(getSheet_(SHEET_NAMES.OQUVCHILAR))
    .filter(function (o) { return o.Maktab_ID === found.Bogliq_ID && o.Face_Encoding; })
    .map(function (o) {
      let encoding;
      try { encoding = JSON.parse(o.Face_Encoding); } catch (e) { encoding = null; }
      return { id: o.ID, ism_familiya: o.Ism + " " + o.Familiya, sinf: o.Sinf, encoding: encoding };
    })
    .filter(function (o) { return o.encoding; });

  return jsonResponse_(people);
}

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

function actionPendingEnroll_(body) {
  const found = lookupApiKey_(body.api_key);
  if (!found || found.Turi !== "maktab") return errorResponse_("Ruxsat yo'q", 403);
  const skip = body.skip || [];
  const rows = sheetToObjects_(getSheet_(SHEET_NAMES.OQUVCHILAR)).filter(function (o) {
    return o.Maktab_ID === found.Bogliq_ID && o.Rasm_URL && !o.Face_Encoding && skip.indexOf(o.ID) < 0;
  }).slice(0, 5);

  const out = [];
  rows.forEach(function (o) {
    const m = /[?&]id=([^&]+)/.exec(o.Rasm_URL);
    if (!m) return;
    try {
      const bytes = DriveApp.getFileById(m[1]).getBlob().getBytes();
      out.push({ id: o.ID, ism_familiya: o.Ism + " " + o.Familiya, photo_base64: Utilities.base64Encode(bytes) });
    } catch (e) { /* fayl topilmadi */ }
  });
  return jsonResponse_(out);
}

function actionAttendance_(body) {
  const found = lookupApiKey_(body.api_key);
  if (!found || found.Turi !== "maktab") return errorResponse_("Bu key maktabga tegishli emas", 403);

  const student = sheetToObjects_(getSheet_(SHEET_NAMES.OQUVCHILAR)).find(function (o) { return o.ID === body.person_id; });
  if (!student) return errorResponse_("O'quvchi topilmadi", 404);

  const tz = Session.getScriptTimeZone();
  const now = new Date();
  const sana = Utilities.formatDate(now, tz, "yyyy-MM-dd");
  const vaqt = Utilities.formatDate(now, tz, "HH:mm:ss");

  const sheet = getSheet_(SHEET_NAMES.DAVOMAT);
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    const cell = rows[i][4];
    const cellSana = (cell instanceof Date) ? Utilities.formatDate(cell, tz, "yyyy-MM-dd") : String(cell);
    if (rows[i][1] === body.person_id && cellSana === sana) {
      return jsonResponse_({ ok: true, message: "Bugun allaqachon belgilangan", takrorlangan: true });
    }
  }

  sheet.getRange(sheet.getLastRow() + 1, 5, 1, 2).setNumberFormat("@");
  appendRowFromHeaders_("DAVOMAT", {
    ID: generateId_("dav"),
    Oquvchi_ID: student.ID,
    Maktab_ID: student.Maktab_ID,
    Ism_Familiya: student.Ism + " " + student.Familiya,
    Sana: sana,
    Vaqt: vaqt,
    Holat: ["keldi", "kelmadi", "kechikdi"].indexOf(body.status) >= 0 ? body.status : "keldi",
    Manba: "face_id",
  });
  return jsonResponse_({ ok: true, message: "Davomat yozildi" });
}

// ---------------------------------------------------------------
// XODIM DAVOMATI — kelish/ketish (o'z API key'i bilan, Face ID yoki tugma orqali)
// ---------------------------------------------------------------

function actionXodimCheckin_(body) {
  const found = lookupApiKey_(body.api_key);
  if (!found || found.Turi !== "xodim") return errorResponse_("API key noto'g'ri yoki xodimga tegishli emas", 401);

  const tz = Session.getScriptTimeZone();
  const now = new Date();
  const sana = Utilities.formatDate(now, tz, "yyyy-MM-dd");
  const vaqt = Utilities.formatDate(now, tz, "HH:mm:ss");

  const sheet = getSheet_(SHEET_NAMES.XODIM_DAVOMAT);
  const data = sheet.getDataRange().getValues();
  const idCol = HEADERS.XODIM_DAVOMAT.indexOf("Xodim_ID");
  const sanaCol = HEADERS.XODIM_DAVOMAT.indexOf("Sana");
  const ketishCol = HEADERS.XODIM_DAVOMAT.indexOf("Ketish_Vaqti");
  const soatCol = HEADERS.XODIM_DAVOMAT.indexOf("Ish_Soati");
  const kelishCol = HEADERS.XODIM_DAVOMAT.indexOf("Kelish_Vaqti");

  for (let i = 1; i < data.length; i++) {
    const cellSana = (data[i][sanaCol] instanceof Date) ? Utilities.formatDate(data[i][sanaCol], tz, "yyyy-MM-dd") : String(data[i][sanaCol]);
    if (data[i][idCol] === found.Bogliq_ID && cellSana === sana) {
      if (!data[i][ketishCol]) {
        // birinchi safar — ketish vaqtini yozamiz va ish soatini hisoblaymiz
        const kelish = String(data[i][kelishCol]);
        const soat = hoursBetween_(kelish, vaqt);
        sheet.getRange(i + 1, ketishCol + 1).setValue(vaqt).setNumberFormat("@");
        sheet.getRange(i + 1, soatCol + 1).setValue(soat);
        return jsonResponse_({ ok: true, holat: "ketdi", ish_soati: soat });
      }
      return jsonResponse_({ ok: true, message: "Bugun allaqachon to'liq belgilangan", takrorlangan: true });
    }
  }

  // bugungi birinchi yozuv — kelish
  sheet.getRange(sheet.getLastRow() + 1, sanaCol + 1, 1, 2).setNumberFormat("@");
  appendRowFromHeaders_("XODIM_DAVOMAT", {
    ID: generateId_("xdav"),
    Xodim_ID: found.Bogliq_ID,
    Ism_Familiya: found.Nomi,
    Sana: sana,
    Kelish_Vaqti: vaqt,
    Ketish_Vaqti: "",
    Ish_Soati: "",
    Holat: "keldi",
  });
  return jsonResponse_({ ok: true, holat: "keldi" });
}

function hoursBetween_(t1, t2) {
  const toMin = function (t) { const p = t.split(":"); return (+p[0]) * 60 + (+p[1]); };
  const diff = Math.max(0, toMin(t2) - toMin(t1));
  return Math.round((diff / 60) * 100) / 100; // soatlarda, 2 xonali
}

/** Xodimning shu oydagi ish soatlari yig'indisi (o'z kabineti uchun). */
function actionXodimSummary_(body) {
  const found = lookupApiKey_(body.api_key);
  if (!found || found.Turi !== "xodim") return errorResponse_("Ruxsat yo'q", 401);

  const tz = Session.getScriptTimeZone();
  const oy = body.oy || Utilities.formatDate(new Date(), tz, "yyyy-MM");
  const rows = sheetToObjects_(getSheet_(SHEET_NAMES.XODIM_DAVOMAT))
    .filter(function (r) { return r.Xodim_ID === found.Bogliq_ID; })
    .map(function (r) { r.Sana = dStr_(r.Sana, "yyyy-MM-dd"); return r; })
    .filter(function (r) { return r.Sana.indexOf(oy) === 0; });

  const jamiSoat = rows.reduce(function (sum, r) { return sum + (Number(r.Ish_Soati) || 0); }, 0);
  return jsonResponse_({ ok: true, kunlar: rows.length, jami_soat: Math.round(jamiSoat * 100) / 100, rows: rows });
}

// ---------------------------------------------------------------
// RO'YXATLAR (sayt uchun — kalit/parol hech qachon qaytmaydi)
// ---------------------------------------------------------------

function actionList_(body) {
  const c = resolveCaller_(body);
  if (!c) return errorResponse_("Sessiya tugagan, qayta kiring", 401);
  const drop = ["Admin_Parol_Hash", "API_Key", "Face_Encoding"];
  const clean = function (o) {
    const r = {};
    Object.keys(o).forEach(function (k) {
      if (drop.indexOf(k) >= 0) return;
      r[k] = (k === "Yaratilgan_Sana") ? dStr_(o[k], "yyyy-MM-dd HH:mm") : o[k];
    });
    return r;
  };
  const read = function (key) { return sheetToObjects_(getSheet_(SHEET_NAMES[key])); };
  const what = body.what;
  let rows, sana;

  if (what === "maktablar") {
    if (c.Turi !== "tuman") return errorResponse_("Ruxsat yo'q", 403);
    rows = read("MAKTABLAR").map(clean);
  } else if (what === "xodimlar") {
    if (c.Turi !== "tuman") return errorResponse_("Ruxsat yo'q", 403);
    rows = read("XODIMLAR").map(clean);
  } else if (what === "oquvchilar") {
    if (c.Turi !== "maktab") return errorResponse_("Ruxsat yo'q", 403);
    rows = read("OQUVCHILAR").filter(function (o) { return o.Maktab_ID === c.Bogliq_ID; }).map(function (o) {
      const r = clean(o); r.Face = !!o.Face_Encoding; return r;
    });
  } else if (what === "davomat") {
    sana = body.sana || Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd");
    let list = read("DAVOMAT");
    if (c.Turi === "maktab") list = list.filter(function (r) { return r.Maktab_ID === c.Bogliq_ID; });
    rows = list.map(function (r) { r.Sana = dStr_(r.Sana, "yyyy-MM-dd"); r.Vaqt = dStr_(r.Vaqt, "HH:mm:ss"); return r; })
      .filter(function (r) { return r.Sana === sana; })
      .sort(function (a, b) { return a.Vaqt < b.Vaqt ? 1 : -1; }).slice(0, 1000);
  } else if (what === "xodim-davomat") {
    if (c.Turi !== "tuman") return errorResponse_("Ruxsat yo'q", 403);
    sana = body.sana || Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd");
    rows = read("XODIM_DAVOMAT")
      .map(function (r) { r.Sana = dStr_(r.Sana, "yyyy-MM-dd"); return r; })
      .filter(function (r) { return r.Sana === sana; })
      .sort(function (a, b) { return a.Kelish_Vaqti < b.Kelish_Vaqti ? 1 : -1; });
  } else {
    return errorResponse_("Noma'lum ro'yxat: " + what, 400);
  }
  return jsonResponse_({ ok: true, rows: rows, sana: sana });
}

// ---------------------------------------------------------------
// ROUTER — sayt (UI) + API
// ---------------------------------------------------------------

const WRITE_ACTIONS = ["attendance", "xodim-checkin", "create-maktab", "create-xodim",
                       "create-oquvchi", "save-encoding"];

function dispatch_(body) {
  const action = body.action;
  const write = WRITE_ACTIONS.indexOf(action) >= 0;
  const lock = write ? LockService.getScriptLock() : null;
  if (lock) lock.waitLock(20000);
  try {
    switch (action) {
      case "login": return actionLogin_(body);
      case "verify-key": return actionVerifyKey_(body.api_key);
      case "people-by-key": return actionPeopleByKey_(body.api_key);
      case "pending-enroll": return actionPendingEnroll_(body);
      case "list": return actionList_(body);
      case "attendance": return actionAttendance_(body);
      case "xodim-checkin": return actionXodimCheckin_(body);
      case "xodim-summary": return actionXodimSummary_(body);
      case "create-maktab": return actionCreateMaktab_(body);
      case "create-xodim": return actionCreateXodim_(body);
      case "create-oquvchi": return actionCreateOquvchi_(body);
      case "save-encoding": return actionSaveEncoding_(body);
      default: return errorResponse_("Noma'lum action: " + action, 404);
    }
  } finally {
    if (lock) lock.releaseLock();
  }
}

/** Sayt (index.html) shu funksiyani google.script.run orqali chaqiradi. */
function api(payload) {
  try {
    return JSON.parse(dispatch_(payload || {}).getContent());
  } catch (err) {
    return { error: true, message: err.message, code: 500 };
  }
}

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (!p.action) {
    return HtmlService.createHtmlOutputFromFile("index")
      .setTitle(TUMAN_NOMI + " — Davomat Tizimi")
      .addMetaTag("viewport", "width=device-width, initial-scale=1")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
  try {
    return dispatch_({ action: p.action, api_key: p.api_key });
  } catch (err) {
    return errorResponse_(err.message, 500);
  }
}

function doPost(e) {
  try {
    return dispatch_(JSON.parse(e.postData.contents || "{}"));
  } catch (err) {
    return errorResponse_(err.message, 500);
  }
}
