/* مولّد QR مدمج — ملف مشترك بين صفحة الكتالوج (app.js) وصفحة طباعة الأكواد (qr.html) */

"use strict";

/* ============================================================
   مولّد QR مدمج (بدون أي مكتبة خارجية أو CDN)
   Byte mode + مستوى تصحيح M + إصدارات 1..6
   ============================================================ */
const QR_M = {
  // version: [مجموع الكلمات, كلمات التصحيح/كتلة, عدد الكتل, بتات الباقي, مواضع المحاذاة]
  1: [26, 10, 1, 0, []],
  2: [44, 16, 1, 7, [6, 18]],
  3: [70, 26, 1, 7, [6, 22]],
  4: [100, 18, 2, 7, [6, 26]],
  5: [134, 24, 2, 7, [6, 30]],
  6: [172, 16, 4, 7, [6, 34]]
};

const GF_EXP = new Array(512).fill(0);
const GF_LOG = new Array(256).fill(0);
(function initGF() {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = x; GF_LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11D;
  }
  for (let i = 255; i < 512; i++) GF_EXP[i] = GF_EXP[i - 255];
})();
function gfMul(a, b) { return a && b ? GF_EXP[GF_LOG[a] + GF_LOG[b]] : 0; }

function rsDivisor(degree) {
  const result = [];
  for (let i = 0; i < degree - 1; i++) result.push(0);
  result.push(1);
  let root = 1;
  for (let i = 0; i < degree; i++) {
    for (let j = 0; j < result.length; j++) {
      result[j] = gfMul(result[j], root);
      if (j + 1 < result.length) result[j] ^= result[j + 1];
    }
    root = gfMul(root, 0x02);
  }
  return result;
}
function rsRemainder(data, divisor) {
  const result = divisor.map(() => 0);
  for (const b of data) {
    const factor = b ^ result.shift();
    result.push(0);
    divisor.forEach((coef, i) => { result[i] ^= gfMul(coef, factor); });
  }
  return result;
}

function utf8Bytes(str) {
  if (typeof TextEncoder !== "undefined") return Array.from(new TextEncoder().encode(str));
  const out = [];
  for (const ch of unescape(encodeURIComponent(str))) out.push(ch.charCodeAt(0));
  return out;
}

/* يعيد { size, modules } حيث modules[y][x] منطقية، أو null عند تجاوز السعة */
function makeQRMatrix(text) {
  const bytes = utf8Bytes(text);
  let version = 0, spec = null;
  for (let v = 1; v <= 6; v++) {
    const s = QR_M[v];
    const dataCw = s[0] - s[1] * s[2];
    if (4 + 8 + bytes.length * 8 <= dataCw * 8) { version = v; spec = s; break; }
  }
  if (!version) return null;
  const [totalCw, eccLen, numBlocks, remBits, alignPos] = spec;
  const dataCwTotal = totalCw - eccLen * numBlocks;

  // بناء تيار البتات
  const bb = [];
  const pushBits = (val, len) => { for (let i = len - 1; i >= 0; i--) bb.push((val >>> i) & 1); };
  pushBits(0b0100, 4);              // byte mode
  pushBits(bytes.length, 8);        // طول البيانات (إصدارات 1..9)
  for (const b of bytes) pushBits(b, 8);
  const capBits = dataCwTotal * 8;
  pushBits(0, Math.min(4, capBits - bb.length));           // terminator
  while (bb.length % 8 !== 0) bb.push(0);                  // محاذاة للبايت
  for (let pad = 0xEC; bb.length < capBits; pad ^= 0xEC ^ 0x11) pushBits(pad, 8);
  const dataBytes = [];
  for (let i = 0; i < bb.length; i += 8) {
    let v = 0; for (let j = 0; j < 8; j++) v = (v << 1) | bb[i + j];
    dataBytes.push(v);
  }

  // تقسيم إلى كتل + حساب ECC + تشابك (interleave)
  const divisor = rsDivisor(eccLen);
  const blockLen = dataCwTotal / numBlocks;
  const blocks = [], eccBlocks = [];
  for (let k = 0; k < numBlocks; k++) {
    const blk = dataBytes.slice(k * blockLen, (k + 1) * blockLen);
    blocks.push(blk);
    eccBlocks.push(rsRemainder(blk, divisor));
  }
  const finalBytes = [];
  for (let i = 0; i < blockLen; i++) for (let k = 0; k < numBlocks; k++) finalBytes.push(blocks[k][i]);
  for (let i = 0; i < eccLen; i++) for (let k = 0; k < numBlocks; k++) finalBytes.push(eccBlocks[k][i]);
  const dataBits = [];
  for (const b of finalBytes) for (let i = 7; i >= 0; i--) dataBits.push((b >>> i) & 1);
  for (let i = 0; i < remBits; i++) dataBits.push(0);

  // إعداد المصفوفة
  const size = version * 4 + 17;
  let modules = [], isFunc = [];
  for (let y = 0; y < size; y++) {
    modules.push(new Array(size).fill(false));
    isFunc.push(new Array(size).fill(false));
  }
  const setFunc = (x, y, dark) => {
    if (0 <= x && x < size && 0 <= y && y < size) { modules[y][x] = dark; isFunc[y][x] = true; }
  };
  const getBit = (x, i) => ((x >>> i) & 1) !== 0;

  function drawFormatBits(mask) {
    const data = mask; // بتات مستوى M هي 00
    let rem = data;
    for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    const bits = ((data << 10) | rem) ^ 0x5412;
    for (let i = 0; i <= 5; i++) setFunc(8, i, getBit(bits, i));
    setFunc(8, 7, getBit(bits, 6));
    setFunc(8, 8, getBit(bits, 7));
    setFunc(7, 8, getBit(bits, 8));
    for (let i = 9; i < 15; i++) setFunc(14 - i, 8, getBit(bits, i));
    for (let i = 0; i < 8; i++) setFunc(size - 1 - i, 8, getBit(bits, i));
    for (let i = 8; i < 15; i++) setFunc(8, size - 15 + i, getBit(bits, i));
    setFunc(8, size - 8, true);
  }

  function drawFunctionModules() {
    for (let i = 0; i < size; i++) {
      setFunc(6, i, i % 2 === 0);
      setFunc(i, 6, i % 2 === 0);
    }
    const finder = (cx, cy) => {
      for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
        const dist = Math.max(Math.abs(dx), Math.abs(dy));
        setFunc(cx + dx, cy + dy, dist !== 2 && dist !== 4);
      }
    };
    finder(3, 3); finder(size - 4, 3); finder(3, size - 4);
    const num = alignPos.length;
    for (let i = 0; i < num; i++) for (let j = 0; j < num; j++) {
      if (!((i === 0 && j === 0) || (i === 0 && j === num - 1) || (i === num - 1 && j === 0))) {
        const cx = alignPos[j], cy = alignPos[i];
        for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
          setFunc(cx + dx, cy + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
        }
      }
    }
    drawFormatBits(0); // حجز أماكن التنسيق بقناع مؤقت
  }

  function drawCodewords() {
    let i = 0;
    for (let right = size - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (let vert = 0; vert < size; vert++) {
        for (let j = 0; j < 2; j++) {
          const x = right - j;
          const upward = ((right + 1) & 2) === 0;
          const y = upward ? size - 1 - vert : vert;
          if (!isFunc[y][x] && i < dataBits.length) {
            modules[y][x] = dataBits[i] === 1;
            i++;
          }
        }
      }
    }
  }

  function applyMask(mask) {
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
      if (isFunc[y][x]) continue;
      let invert = false;
      switch (mask) {
        case 0: invert = (x + y) % 2 === 0; break;
        case 1: invert = y % 2 === 0; break;
        case 2: invert = x % 3 === 0; break;
        case 3: invert = (x + y) % 3 === 0; break;
        case 4: invert = (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0; break;
        case 5: invert = (x * y) % 2 + (x * y) % 3 === 0; break;
        case 6: invert = ((x * y) % 2 + (x * y) % 3) % 2 === 0; break;
        case 7: invert = ((x + y) % 2 + (x * y) % 3) % 2 === 0; break;
      }
      if (invert) modules[y][x] = !modules[y][x];
    }
  }

  function penaltyScore() {
    let result = 0;
    const runHistory = [0, 0, 0, 0, 0, 0, 0];
    const addHistory = (len) => {
      if (runHistory[0] === 0) len += size;
      runHistory.pop(); runHistory.unshift(len);
    };
    const finderCount = () => {
      const n = runHistory[0];
      const core = n > 0 && runHistory[1] === n && runHistory[2] === n * 3 &&
                   runHistory[3] === n && runHistory[4] === n;
      return (core && runHistory[5] >= n * 4 && runHistory[6] >= n ? 1 : 0) +
             (core && runHistory[6] >= n * 4 && runHistory[5] >= n ? 1 : 0);
    };
    const terminateAndCount = (runColor, runLen) => {
      let count = 0;
      if (runColor) { addHistory(runLen); count += finderCount(); }
      addHistory(size);
      count += finderCount();
      return count;
    };
    // صفوف
    for (let y = 0; y < size; y++) {
      let runColor = false, runLen = 0;
      runHistory.fill(0);
      for (let x = 0; x < size; x++) {
        if (modules[y][x] === runColor) {
          runLen++;
          if (runLen === 5) result += 3; else if (runLen > 5) result++;
        } else {
          addHistory(runLen);
          if (!runColor) result += finderCount() * 40;
          runColor = modules[y][x]; runLen = 1;
        }
      }
      result += terminateAndCount(runColor, runLen) * 40;
    }
    // أعمدة
    for (let x = 0; x < size; x++) {
      let runColor = false, runLen = 0;
      runHistory.fill(0);
      for (let y = 0; y < size; y++) {
        if (modules[y][x] === runColor) {
          runLen++;
          if (runLen === 5) result += 3; else if (runLen > 5) result++;
        } else {
          addHistory(runLen);
          if (!runColor) result += finderCount() * 40;
          runColor = modules[y][x]; runLen = 1;
        }
      }
      result += terminateAndCount(runColor, runLen) * 40;
    }
    // مربعات 2×2
    for (let y = 0; y < size - 1; y++) for (let x = 0; x < size - 1; x++) {
      const c = modules[y][x];
      if (c === modules[y][x + 1] && c === modules[y + 1][x] && c === modules[y + 1][x + 1]) result += 3;
    }
    // توازن الغامق/الفاتح
    let dark = 0;
    for (const row of modules) for (const cell of row) if (cell) dark++;
    const total = size * size;
    const k = Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1;
    result += Math.max(0, k) * 10;
    return result;
  }

  drawFunctionModules();
  drawCodewords();

  let best = null, bestPenalty = Infinity, bestModules = null;
  for (let mask = 0; mask < 8; mask++) {
    const snapshot = modules.map(r => r.slice());
    applyMask(mask);
    drawFormatBits(mask);
    const p = penaltyScore();
    if (p < bestPenalty) {
      bestPenalty = p; best = mask;
      bestModules = modules.map(r => r.slice());
    }
    modules = snapshot; // استعادة (أماكن التنسيق ستُعاد كتابتها في الجولة التالية)
  }
  return { size, modules: bestModules, version, mask: best };
}

/* رسم QR كـ SVG (مع هامش أبيض) — يعيد سلسلة SVG أو null */
function qrCodeSvg(text, border) {
  const qr = makeQRMatrix(text);
  if (!qr) return null;
  const b = border == null ? 2 : border;
  const dim = qr.size + b * 2;
  let d = "";
  for (let y = 0; y < qr.size; y++) for (let x = 0; x < qr.size; x++) {
    if (qr.modules[y][x]) d += "M" + (x + b) + " " + (y + b) + "h1v1h-1z";
  }
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + dim + " " + dim +
    '" role="img" aria-label="QR"><rect width="100%" height="100%" fill="#ffffff"/>' +
    '<path d="' + d + '" fill="#000000"/></svg>';
}

// تصدير للاختبار الآلي (Node) — لا يؤثر على المتصفح
if (typeof module !== "undefined" && module.exports) {
  module.exports = { makeQRMatrix, qrCodeSvg };
}
