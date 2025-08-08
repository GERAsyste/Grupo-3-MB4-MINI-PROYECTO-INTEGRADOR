// script.js
// La calculadora implementa factorial y combinatoria usando BigInt.
// Límite práctico para evitar bloqueo: maxN = 500.
// Si el usuario necesita valores mayores, deberá usar procesamiento en servidor o ajustar el límite.

(function () {
  const MAX_N = 500; // límite práctico para evitar bloqueo del navegador

  // Helpers de UI
  const $ = sel => document.querySelector(sel);
  const factN = $('#fact-n');
  const factBtn = $('#btn-factorial');
  const factClear = $('#btn-clear-fact');
  const factError = $('#fact-error');
  const factResult = $('#fact-result');

  const combN = $('#comb-n');
  const combK = $('#comb-k');
  const combBtn = $('#btn-comb');
  const combClear = $('#btn-clear-comb');
  const combError = $('#comb-error');
  const combResult = $('#comb-result');

  // Validaciones comunes
  function isInteger(value) {
    if (typeof value === 'number') return Number.isInteger(value);
    // allow numeric strings
    return /^-?\d+$/.test(String(value));
  }

  function parseAndValidateInt(str) {
    if (str === '' || str === null || str === undefined) {
      throw new Error('El campo está vacío.');
    }
    if (!isInteger(str)) {
      throw new Error('Se requiere un número entero.');
    }
    const n = Number(str);
    if (!Number.isFinite(n)) throw new Error('Número inválido.');
    return n;
  }

  // Cálculo factorial usando BigInt
  function factorialBigInt(n) {
    // n es un número entero >= 0
    if (n === 0 || n === 1) return 1n;
    let res = 1n;
    for (let i = 2; i <= n; i++) {
      res *= BigInt(i);
    }
    return res;
  }

  // Cálculo de combinatoria nCk usando multiplicativo y BigInt:
  // nCk = product_{i=1..k} (n - k + i) / i
  function combinationBigInt(n, k) {
    if (k < 0 || n < 0) throw new Error('n y k deben ser no negativos.');
    if (k > n) return 0n;
    if (k === 0 || k === n) return 1n;
    k = Math.min(k, n - k); // aprovechar simetría
    let numer = 1n;
    let denom = 1n;
    for (let i = 1; i <= k; i++) {
      numer *= BigInt(n - k + i);
      denom *= BigInt(i);
      // Reducir fracción periódicamente para mantener números pequeños (opcional)
      const gcdVal = gcdBigInt(numer, denom);
      if (gcdVal > 1n) {
        numer /= gcdVal;
        denom /= gcdVal;
      }
    }
    // denom debería ser 1 ahora
    return numer / denom;
  }

  // Euclides para BigInt
  function gcdBigInt(a, b) {
    a = a < 0n ? -a : a;
    b = b < 0n ? -b : b;
    while (b !== 0n) {
      const t = a % b;
      a = b;
      b = t;
    }
    return a;
  }

  // Manejo factorial - evento
  factBtn.addEventListener('click', () => {
    factError.textContent = '';
    factResult.textContent = '';
    try {
      const raw = factN.value;
      const n = parseAndValidateInt(raw);
      if (n < 0) throw new Error('n debe ser un entero >= 0.');
      if (n > MAX_N) throw new Error(`Valor fuera de rango. n no puede ser mayor que ${MAX_N}.`);
      // Calcular factorial
      const res = factorialBigInt(n);
      factResult.textContent = `${n}! = ${res.toString()}`;
    } catch (err) {
      factError.textContent = `Error: ${err.message}`;
    }
  });

  factClear.addEventListener('click', () => {
    factN.value = '';
    factError.textContent = '';
    factResult.textContent = '';
  });

  // Manejo combinatoria - evento
  combBtn.addEventListener('click', () => {
    combError.textContent = '';
    combResult.textContent = '';
    try {
      const rawN = combN.value;
      const rawK = combK.value;
      const n = parseAndValidateInt(rawN);
      const k = parseAndValidateInt(rawK);
      if (n < 0 || k < 0) throw new Error('n y k deben ser enteros ≥ 0.');
      if (k > n) throw new Error('k no puede ser mayor que n.');
      if (n > MAX_N) throw new Error(`Valor fuera de rango. n no puede ser mayor que ${MAX_N}.`);
      // Calcular combinatoria
      const res = combinationBigInt(n, k);
      combResult.textContent = `C(${n}, ${k}) = ${res.toString()}`;
    } catch (err) {
      combError.textContent = `Error: ${err.message}`;
    }
  });

  combClear.addEventListener('click', () => {
    combN.value = '';
    combK.value = '';
    combError.textContent = '';
    combResult.textContent = '';
  });

  // Accesibilidad: permitir Enter en inputs para calcular
  [factN].forEach(el => {
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') factBtn.click();
    });
  });

  [combN, combK].forEach(el => {
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') combBtn.click();
    });
  });

})();
