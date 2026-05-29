(() => {
  'use strict';

    const CONFIG_KEY = 'portfolioBacktesterConfig_v5';
    const API_KEY_STORAGE = 'portfolioBacktesterApiKeys_v1';
    const DATA_CACHE_PREFIX = 'portfolioBacktesterData_v4_';
    const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
    const DEFAULT_DETAIL = symbol => `https://finance.yahoo.com/quote/${encodeURIComponent(symbol)}`;
    const JUSTETF = query => `https://www.justetf.com/en/find-etf.html?query=${encodeURIComponent(query)}`;

    const ETF_US = (label, category, ter, symbol, exchange = 'NYSE', distribution = 'distributing') => ({
      label, category, type: 'api', ter, distribution,
      alphaSymbol: symbol,
      twelveSymbol: symbol,
      twelveExchange: exchange,
      twelveAdjust: distribution === 'distributing' ? 'all' : 'splits',
      detailUrl: DEFAULT_DETAIL(symbol)
    });

    const INSTRUMENTS = {
      TEST_FLAT: { label: 'TEST: konstantní cena 100', category: 'Testovací', type: 'synthetic', ter: 0, synthetic: 'flat', detailUrl: '#' },
      TEST_BOND_4PA: { label: 'TEST: Bondy / konstantní růst 4 % p.a.', category: 'Testovací', type: 'synthetic', ter: 0, synthetic: 'bond4', detailUrl: '#' },
      TEST_GROWTH_1PM: { label: 'TEST: konstantní růst 1 % měsíčně', category: 'Testovací', type: 'synthetic', ter: 0, synthetic: 'growth1pm', detailUrl: '#' },
      TEST_SINE_LOW: { label: 'TEST: sinus kolem 1 % m. – nízká energie', category: 'Testovací', type: 'synthetic', ter: 0, synthetic: 'sineLow', detailUrl: '#' },
      TEST_SINE_HIGH: { label: 'TEST: sinus kolem 1 % m. – vysoká energie', category: 'Testovací', type: 'synthetic', ter: 0, synthetic: 'sineHigh', detailUrl: '#' },
      TEST_NEG_SINE_HIGH: { label: 'TEST: negativní sinus – vysoká energie', category: 'Testovací', type: 'synthetic', ter: 0, synthetic: 'negSineHigh', detailUrl: '#' },
      TEST_PRICE_SINE: { label: 'TEST: cena osciluje kolem 100', category: 'Testovací', type: 'synthetic', ter: 0, synthetic: 'priceSine', detailUrl: '#' },
      TEST_CRASH_RECOVERY: { label: 'TEST: propad a zotavení', category: 'Testovací', type: 'synthetic', ter: 0, synthetic: 'crashRecovery', detailUrl: '#' },

      SPY: ETF_US('SPDR S&P 500 ETF', 'Akcie USA – široký trh', 0.000945, 'SPY', 'NYSE'),
      VOO: ETF_US('Vanguard S&P 500 ETF', 'Akcie USA – široký trh', 0.0003, 'VOO', 'NYSE'),
      IVV: ETF_US('iShares Core S&P 500 ETF', 'Akcie USA – široký trh', 0.0003, 'IVV', 'NYSE'),
      VTI: ETF_US('Vanguard Total Stock Market ETF', 'Akcie USA – široký trh', 0.0003, 'VTI', 'NYSE'),
      DIA: ETF_US('SPDR Dow Jones Industrial Average ETF', 'Akcie USA – blue chips', 0.0016, 'DIA', 'NYSE'),
      QQQ: ETF_US('Invesco QQQ / Nasdaq 100', 'Akcie USA – růst/tech', 0.0020, 'QQQ', 'NASDAQ'),
      QQQM: ETF_US('Invesco NASDAQ 100 ETF', 'Akcie USA – růst/tech', 0.0015, 'QQQM', 'NASDAQ'),
      IWM: ETF_US('iShares Russell 2000 ETF', 'Akcie USA – small caps', 0.0019, 'IWM', 'NYSE'),

      VT: ETF_US('Vanguard Total World Stock ETF', 'Akcie svět', 0.0007, 'VT', 'NYSE'),
      ACWI: ETF_US('iShares MSCI ACWI ETF', 'Akcie svět', 0.0032, 'ACWI', 'NASDAQ'),
      VXUS: ETF_US('Vanguard Total International Stock ETF', 'Akcie mimo USA', 0.0008, 'VXUS', 'NASDAQ'),
      VEA: ETF_US('Vanguard FTSE Developed Markets ETF', 'Akcie rozvinuté trhy mimo USA', 0.0005, 'VEA', 'NYSE'),
      EFA: ETF_US('iShares MSCI EAFE ETF', 'Akcie rozvinuté trhy mimo USA', 0.0033, 'EFA', 'NYSE'),
      VWO: ETF_US('Vanguard Emerging Markets ETF', 'Akcie emerging markets', 0.0008, 'VWO', 'NYSE'),
      EEM: ETF_US('iShares MSCI Emerging Markets ETF', 'Akcie emerging markets', 0.0069, 'EEM', 'NYSE'),

      BIL: ETF_US('SPDR Bloomberg 1-3 Month T-Bill ETF', 'Dluhopisy – hotovostní proxy', 0.00135, 'BIL', 'NYSE'),
      SHY: ETF_US('iShares 1-3 Year Treasury Bond ETF', 'Dluhopisy – krátké státní', 0.0015, 'SHY', 'NASDAQ'),
      IEF: ETF_US('iShares 7-10 Year Treasury Bond ETF', 'Dluhopisy – střední státní', 0.0015, 'IEF', 'NASDAQ'),
      TLT: ETF_US('iShares 20+ Year Treasury Bond ETF', 'Dluhopisy – dlouhé státní', 0.0015, 'TLT', 'NASDAQ'),
      AGG: ETF_US('iShares Core US Aggregate Bond ETF', 'Dluhopisy – agregát', 0.0003, 'AGG', 'NYSE'),
      BND: ETF_US('Vanguard Total Bond Market ETF', 'Dluhopisy – agregát', 0.0003, 'BND', 'NASDAQ'),
      BNDX: ETF_US('Vanguard Total International Bond ETF', 'Dluhopisy – svět mimo USA', 0.0007, 'BNDX', 'NASDAQ'),
      TIP: ETF_US('iShares TIPS Bond ETF', 'Dluhopisy – protiinflační', 0.0019, 'TIP', 'NYSE'),
      LQD: ETF_US('iShares iBoxx Investment Grade Corporate Bond ETF', 'Dluhopisy – korporátní IG', 0.0014, 'LQD', 'NYSE'),
      HYG: ETF_US('iShares iBoxx High Yield Corporate Bond ETF', 'Dluhopisy – high yield', 0.0049, 'HYG', 'NYSE'),

      GLD: ETF_US('SPDR Gold Shares', 'Komodity – zlato', 0.0040, 'GLD', 'NYSE', 'none'),
      IAU: ETF_US('iShares Gold Trust', 'Komodity – zlato', 0.0025, 'IAU', 'NYSE', 'none'),
      SLV: ETF_US('iShares Silver Trust', 'Komodity – stříbro', 0.0050, 'SLV', 'NYSE', 'none'),
      DBC: ETF_US('Invesco DB Commodity Index Tracking Fund', 'Komodity – široký koš', 0.0087, 'DBC', 'NYSE', 'none'),
      USO: ETF_US('United States Oil Fund', 'Komodity – ropa', 0.0060, 'USO', 'NYSE', 'none'),

      VNQ: ETF_US('Vanguard Real Estate ETF', 'REIT / nemovitosti', 0.0013, 'VNQ', 'NYSE'),
      VNQI: ETF_US('Vanguard Global ex-US Real Estate ETF', 'REIT / nemovitosti mimo USA', 0.0012, 'VNQI', 'NASDAQ'),

      SCHD: ETF_US('Schwab US Dividend Equity ETF', 'Faktory – dividendy', 0.0006, 'SCHD', 'NYSE'),
      VIG: ETF_US('Vanguard Dividend Appreciation ETF', 'Faktory – dividendový růst', 0.0006, 'VIG', 'NYSE'),
      USMV: ETF_US('iShares MSCI USA Min Vol Factor ETF', 'Faktory – minimum volatility', 0.0015, 'USMV', 'NYSE'),
      MTUM: ETF_US('iShares MSCI USA Momentum Factor ETF', 'Faktory – momentum', 0.0015, 'MTUM', 'NYSE'),
      QUAL: ETF_US('iShares MSCI USA Quality Factor ETF', 'Faktory – quality', 0.0015, 'QUAL', 'NYSE'),
      VLUE: ETF_US('iShares MSCI USA Value Factor ETF', 'Faktory – value', 0.0015, 'VLUE', 'NYSE'),

      XLK: ETF_US('Technology Select Sector SPDR ETF', 'Sektory USA – technologie', 0.0009, 'XLK', 'NYSE'),
      XLV: ETF_US('Health Care Select Sector SPDR ETF', 'Sektory USA – zdravotnictví', 0.0009, 'XLV', 'NYSE'),
      XLF: ETF_US('Financial Select Sector SPDR ETF', 'Sektory USA – finance', 0.0009, 'XLF', 'NYSE'),
      XLE: ETF_US('Energy Select Sector SPDR ETF', 'Sektory USA – energie', 0.0009, 'XLE', 'NYSE'),
      XLI: ETF_US('Industrial Select Sector SPDR ETF', 'Sektory USA – průmysl', 0.0009, 'XLI', 'NYSE'),
      XLP: ETF_US('Consumer Staples Select Sector SPDR ETF', 'Sektory USA – stabilní spotřeba', 0.0009, 'XLP', 'NYSE'),
      XLY: ETF_US('Consumer Discretionary Select Sector SPDR ETF', 'Sektory USA – cyklická spotřeba', 0.0009, 'XLY', 'NYSE'),
      XLU: ETF_US('Utilities Select Sector SPDR ETF', 'Sektory USA – utility', 0.0009, 'XLU', 'NYSE'),
      XLB: ETF_US('Materials Select Sector SPDR ETF', 'Sektory USA – materiály', 0.0009, 'XLB', 'NYSE'),
      XLRE: ETF_US('Real Estate Select Sector SPDR ETF', 'Sektory USA – reality', 0.0009, 'XLRE', 'NYSE')
    };

    const state = { valueChart: null, navChart: null, allocChartA: null, allocChartB: null, lastResult: null };
    const $ = id => document.getElementById(id);
    const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];

    function formatValue(value, decimals = 0) {
      if (!Number.isFinite(value)) return '—';
      return value.toLocaleString('cs-CZ', { maximumFractionDigits: decimals, minimumFractionDigits: decimals });
    }
    function formatPct(value, decimals = 2) {
      if (value === Infinity) return '+∞ %';
      if (value === -Infinity) return '−∞ %';
      if (!Number.isFinite(value)) return '—';
      return (value * 100).toLocaleString('cs-CZ', { maximumFractionDigits: decimals, minimumFractionDigits: decimals }) + ' %';
    }
    function formatNumber(value, decimals = 2) {
      if (!Number.isFinite(value)) return '—';
      return value.toLocaleString('cs-CZ', { maximumFractionDigits: decimals, minimumFractionDigits: decimals });
    }
    function parseNum(id, fallback = 0) {
      const value = Number($(id).value);
      return Number.isFinite(value) ? value : fallback;
    }
    function monthToDate(month) { return new Date(`${month}-01T00:00:00Z`); }
    function dateToMonth(date) { return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`; }
    function addMonths(date, n) { return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + n, 1)); }
    function monthsBetween(startMonth, endMonth) {
      const start = monthToDate(startMonth); const end = monthToDate(endMonth);
      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) return [];
      const out = [];
      for (let d = start; d <= end; d = addMonths(d, 1)) out.push(dateToMonth(d));
      return out;
    }
    function annualToMonthlyRate(rate) { return (!Number.isFinite(rate) || rate <= 0) ? 0 : Math.pow(1 + rate, 1 / 12) - 1; }
    function showAlert(message, type = 'danger') { const box = $('alertBox'); box.className = `alert alert-${type}`; box.textContent = message; box.classList.remove('d-none'); }
    function hideAlert() { $('alertBox').classList.add('d-none'); }
    function setLoading(isLoading) { $('runSimulationBtn').disabled = isLoading; $('runSpinner').classList.toggle('d-none', !isLoading); }
    function structuredCloneSafe(value) { return JSON.parse(JSON.stringify(value)); }
    function getApiKeys() {
      try {
        const parsed = JSON.parse(localStorage.getItem(API_KEY_STORAGE) || '{}');
        return {
          alphaVantage: String(parsed.alphaVantage || '').trim(),
          twelveData: String(parsed.twelveData || '').trim()
        };
      } catch (_) {
        return { alphaVantage: '', twelveData: '' };
      }
    }
    function saveApiKeys() {
      const keys = {
        alphaVantage: $('alphaVantageKey')?.value.trim() || '',
        twelveData: $('twelveDataKey')?.value.trim() || ''
      };
      localStorage.setItem(API_KEY_STORAGE, JSON.stringify(keys));
      updateApiKeyStatus();
      showAlert('API klíče jsou uložené jen v tomto prohlížeči.', 'success');
    }
    function clearApiKeys() {
      localStorage.removeItem(API_KEY_STORAGE);
      if ($('alphaVantageKey')) $('alphaVantageKey').value = '';
      if ($('twelveDataKey')) $('twelveDataKey').value = '';
      updateApiKeyStatus();
      showAlert('API klíče byly smazány z localStorage.', 'success');
    }
    function updateApiKeyStatus() {
      const status = $('apiKeyStatus');
      if (!status) return;
      const keys = getApiKeys();
      if ($('alphaVantageKey')) $('alphaVantageKey').value = keys.alphaVantage;
      if ($('twelveDataKey')) $('twelveDataKey').value = keys.twelveData;
      const parts = [];
      parts.push(keys.alphaVantage ? 'Alpha Vantage uložený' : 'Alpha Vantage chybí');
      parts.push(keys.twelveData ? 'Twelve Data uložený' : 'Twelve Data chybí');
      status.textContent = `${parts.join(' · ')}. Syntetické testy klíče nepotřebují.`;
    }

    function describeInstrument(symbol) {
      const meta = INSTRUMENTS[symbol];
      if (!meta) return '';
      if (meta.type === 'synthetic') return `${meta.category} · offline · bez TER`;
      const dist = meta.distribution === 'accumulating' ? 'Acc' : meta.distribution === 'distributing' ? 'Dist' : 'bez dividend';
      const primary = meta.alphaSymbol ? 'Alpha Vantage adjusted close' : 'Twelve Data';
      return `${meta.category} · ${dist} · TER ${formatPct(meta.ter, 2)} · ${primary}`;
    }
    function escapeAttr(value) {
      return String(value ?? '').replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
    }
    function sortedInstrumentEntries() {
      return Object.entries(INSTRUMENTS).sort((a, b) => {
        const ca = a[1].category || ''; const cb = b[1].category || '';
        return ca.localeCompare(cb, 'cs') || a[0].localeCompare(b[0], 'cs');
      });
    }
    function populateInstrumentSelect(select, selected = select.value || select.dataset.value || 'TEST_GROWTH_1PM') {
      select.innerHTML = '';
      let currentCategory = null;
      let group = null;
      for (const [symbol, meta] of sortedInstrumentEntries()) {
        if (meta.category !== currentCategory) {
          currentCategory = meta.category;
          group = document.createElement('optgroup');
          group.label = currentCategory || 'Ostatní';
          select.appendChild(group);
        }
        const option = document.createElement('option');
        option.value = symbol;
        option.dataset.tokens = `${symbol} ${meta.label} ${meta.category || ''} ${meta.distribution || ''}`;
        option.textContent = `${symbol} — ${meta.label}`;
        group.appendChild(option);
      }
      const value = selected && INSTRUMENTS[selected] ? selected : 'TEST_GROWTH_1PM';
      select.value = value;
      select.dataset.value = value;
    }
    function initSelectPicker(_select) {}
    function refreshSelectPicker(_select) {}
    function setSelectedTicker(select, ticker) {
      const value = ticker && INSTRUMENTS[ticker] ? ticker : 'TEST_GROWTH_1PM';
      select.value = value;
      select.dataset.value = value;
    }
    function getSelectedTickerFromSelect(select) {
      if (!select) return '';
      const value = select.value || select.dataset.value || select.options[select.selectedIndex]?.value || '';
      if (value && INSTRUMENTS[value]) {
        select.value = value;
        select.dataset.value = value;
        return value;
      }
      return '';
    }
    function getRowTicker(row) {
      return getSelectedTickerFromSelect(row.querySelector('select.asset-ticker'));
    }
    function trashSvg() {
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>`;
    }
    function updateRowDetail(row) {
      const symbol = getRowTicker(row);
      const meta = INSTRUMENTS[symbol];
      row.querySelector('.asset-meta').textContent = describeInstrument(symbol);
      const link = row.querySelector('.asset-detail');
      if (!meta || !meta.detailUrl || meta.detailUrl === '#') {
        link.href = '#';
        link.classList.add('disabled');
        link.setAttribute('aria-disabled', 'true');
      } else {
        link.href = meta.detailUrl;
        link.classList.remove('disabled');
        link.removeAttribute('aria-disabled');
      }
    }
    function addAssetRow(portfolioId, ticker = 'TEST_GROWTH_1PM', weight = 100) {
      const row = document.createElement('div');
      row.className = 'asset-row';
      row.innerHTML = `
        <div class="asset-picker">
          <select class="form-select form-select-sm asset-ticker" aria-label="Instrument"></select>
          <small class="asset-meta"></small>
        </div>
        <input class="form-control form-control-sm asset-weight" type="number" min="0.1" max="100" step="0.1" value="${weight}" aria-label="Váha v procentech">
        <a class="btn btn-outline-info btn-sm asset-detail" href="#" target="_blank" rel="noopener" title="Otevřít detail instrumentu">Detail</a>
        <button type="button" class="btn btn-outline-danger btn-sm remove-asset" title="Odebrat instrument">${trashSvg()}</button>
      `;
      const select = row.querySelector('.asset-ticker');
      populateInstrumentSelect(select, ticker);
      const syncSelection = () => {
        const value = getSelectedTickerFromSelect(select);
        if (value) setSelectedTicker(select, value);
        updateRowDetail(row);
        updateWeightSummary(portfolioId);
      };
      select.addEventListener('change', syncSelection);
      row.querySelector('.asset-weight').addEventListener('input', () => updateWeightSummary(portfolioId));
      row.querySelector('.asset-detail').addEventListener('click', (event) => {
        if (event.currentTarget.classList.contains('disabled')) event.preventDefault();
      });
      row.querySelector('.remove-asset').addEventListener('click', () => {
        row.remove();
        updateWeightSummary(portfolioId);
      });
      $(`assets${portfolioId}`).appendChild(row);
      initSelectPicker(select);
      setSelectedTicker(select, ticker);
      updateRowDetail(row);
      updateWeightSummary(portfolioId);
    }
    function clearAssets(portfolioId) {
      $(`assets${portfolioId}`).innerHTML = '';
      updateWeightSummary(portfolioId);
    }
    function updateWeightSummary(portfolioId) {
      let total = 0; const seen = new Set(); const duplicates = new Set();
      qsa(`#assets${portfolioId} .asset-row`).forEach(row => {
        const ticker = getRowTicker(row); const weight = Number(row.querySelector('.asset-weight').value);
        if (seen.has(ticker)) duplicates.add(ticker); seen.add(ticker);
        if (Number.isFinite(weight) && weight > 0) total += weight;
      });
      const cash = Math.max(0, 100 - total);
      $(`weightSummary${portfolioId}`).textContent = `${formatNumber(total, 1)} % + ${formatNumber(cash, 1)} % CASH`;
      const errors = [];
      if (total > 100 + 1e-9) errors.push('Součet vah nesmí překročit 100 %.');
      if (duplicates.size > 0) errors.push(`Duplicitní instrumenty: ${[...duplicates].join(', ')}.`);
      $(`assetError${portfolioId}`).textContent = errors.join(' ');
    }
    function validatePortfolio(portfolioId) {
      const errors = []; const weights = {}; let total = 0;
      qsa(`#assets${portfolioId} .asset-row`).forEach(row => {
        const ticker = getRowTicker(row); const weightPct = Number(row.querySelector('.asset-weight').value);
        if (!ticker || !(ticker in INSTRUMENTS)) errors.push(`Neznámý instrument v portfoliu ${portfolioId}.`);
        if (!Number.isFinite(weightPct) || weightPct <= 0 || weightPct > 100) errors.push(`Neplatná váha u ${ticker}.`);
        if (weights[ticker]) errors.push(`Duplicitní instrument ${ticker} v portfoliu ${portfolioId}.`);
        weights[ticker] = weightPct / 100; total += weightPct / 100;
      });
      if (total > 1 + 1e-9) errors.push(`Součet vah portfolia ${portfolioId} je přes 100 %.`);
      $(`assetError${portfolioId}`).textContent = errors.join(' ');
      return errors;
    }
    function readPortfolioConfig(id) {
      const errors = validatePortfolio(id); const assets = {}; let weightSum = 0;
      qsa(`#assets${id} .asset-row`).forEach(row => {
        const ticker = getRowTicker(row); const weight = Number(row.querySelector('.asset-weight').value) / 100;
        if (ticker && Number.isFinite(weight) && weight > 0 && !assets[ticker]) { assets[ticker] = weight; weightSum += weight; }
      });
      assets.CASH = Math.max(0, 1 - weightSum);
      const config = { id, initialInvestment: parseNum(`initialInvest${id}`), monthlyInvestment: parseNum(`monthlyInvest${id}`), managerFee: parseNum(`managerFee${id}`) / 100, txCost: parseNum(`txCost${id}`) / 100, tolerance: parseNum(`tolerance${id}`) / 100, rebalMode: $(`rebalMode${id}`).value, assets, ter: {} };
      Object.keys(assets).forEach(ticker => { config.ter[ticker] = ticker === 'CASH' ? 0 : (INSTRUMENTS[ticker]?.ter || 0); });
      ['initialInvestment', 'monthlyInvestment', 'managerFee', 'txCost', 'tolerance'].forEach(key => { if (!Number.isFinite(config[key]) || config[key] < 0) errors.push(`Neplatná hodnota ${key} u portfolia ${id}.`); });
      return { config, errors };
    }
    function readGlobalConfig() {
      const startMonth = $('startDate').value; const endMonth = $('endDate').value; const months = monthsBetween(startMonth, endMonth); const errors = [];
      if (months.length < 2) errors.push('Zvol alespoň dva měsíce simulace.');
      return { startMonth, endMonth, months, riskFreeRate: parseNum('riskFreeRate') / 100, errors };
    }
    function generateSyntheticPrices(ticker, months) {
      const synthetic = INSTRUMENTS[ticker].synthetic; const data = {}; let price = 100;
      for (let i = 0; i < months.length; i++) {
        if (i > 0) {
          const phase = (2 * Math.PI * i) / 12;
          let r = 0;
          if (synthetic === 'bond4') r = Math.pow(1.04, 1 / 12) - 1;
          if (synthetic === 'growth1pm') r = 0.01;
          if (synthetic === 'sineLow') r = 0.01 + 0.03 * Math.sin(phase);
          if (synthetic === 'sineHigh') r = 0.01 + 0.12 * Math.sin(phase);
          if (synthetic === 'negSineHigh') r = 0.01 - 0.12 * Math.sin(phase);
          if (synthetic === 'crashRecovery') r = i === 7 ? -0.35 : 0.018;
          if (synthetic === 'priceSine') { price = 100 * (1 + 0.35 * Math.sin(phase)); data[months[i]] = Math.max(1, price); continue; }
          price = Math.max(0.01, price * (1 + r));
        }
        data[months[i]] = price;
      }
      return data;
    }
    async function fetchAlphaMonthlyAdjusted(symbol) {
      const cacheKey = `${DATA_CACHE_PREFIX}av_${symbol}`; const cached = localStorage.getItem(cacheKey);
      if (cached) { try { const parsed = JSON.parse(cached); if (Date.now() - parsed.timestamp < CACHE_TTL_MS) return parsed.data; } catch (_) {} }
      const keys = getApiKeys();
      if (!keys.alphaVantage) throw new Error(`${symbol}: pro Alpha Vantage zadej vlastní API klíč.`);
      const url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${encodeURIComponent(symbol)}&apikey=${encodeURIComponent(keys.alphaVantage)}`;
      const response = await fetch(url); if (!response.ok) throw new Error(`${symbol}: Alpha Vantage HTTP ${response.status}`);
      const payload = await response.json();
      if (payload['Error Message']) throw new Error(`${symbol}: ${payload['Error Message']}`);
      if (payload['Note']) throw new Error(`${symbol}: Alpha Vantage limit: ${payload['Note']}`);
      const series = payload['Monthly Adjusted Time Series']; if (!series) throw new Error(`${symbol}: chybí Monthly Adjusted Time Series.`);
      const data = {}; Object.entries(series).forEach(([date, item]) => { const price = Number(item['5. adjusted close']); if (Number.isFinite(price) && price > 0) data[date.slice(0, 7)] = price; });
      if (Object.keys(data).length < 2) throw new Error(`${symbol}: nedostatek Alpha Vantage dat.`);
      localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data })); return data;
    }
    async function fetchTwelveMonthly(symbol, exchange, adjust, startMonth) {
      const cacheKey = `${DATA_CACHE_PREFIX}td_${symbol}_${exchange || 'any'}_${adjust}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) { try { const parsed = JSON.parse(cached); if (Date.now() - parsed.timestamp < CACHE_TTL_MS) return parsed.data; } catch (_) {} }

      const attempts = [];
      attempts.push({ symbol, exchange });
      if (exchange) attempts.push({ symbol: `${symbol}:${exchange}`, exchange: null });
      if (exchange === 'XETRA') attempts.push({ symbol: `${symbol}:XETR`, exchange: null }, { symbol: `${symbol}.DE`, exchange: null });

      const errors = [];
      for (const attempt of attempts) {
        const keys = getApiKeys();
      if (!keys.twelveData) throw new Error(`${symbol}: pro Twelve Data fallback zadej vlastní API klíč.`);
      const params = new URLSearchParams({ symbol: attempt.symbol, interval: '1month', apikey: keys.twelveData, outputsize: '5000', adjust, start_date: `${startMonth}-01` });
        if (attempt.exchange) params.set('exchange', attempt.exchange);
        try {
          const response = await fetch(`https://api.twelvedata.com/time_series?${params.toString()}`);
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const payload = await response.json();
          if (payload.status === 'error' || !payload.values) throw new Error(payload.message || payload.code || 'nevrátilo hodnoty');
          const data = {};
          payload.values.forEach(item => { const price = Number(item.close); if (Number.isFinite(price) && price > 0) data[item.datetime.slice(0, 7)] = price; });
          if (Object.keys(data).length < 2) throw new Error('nedostatek dat');
          localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data }));
          return data;
        } catch (err) {
          errors.push(`${attempt.symbol}${attempt.exchange ? '/' + attempt.exchange : ''}: ${err.message || String(err)}`);
        }
      }
      throw new Error(`${symbol}: Twelve Data fallback selhal (${errors.join(' | ')})`);
    }
    async function loadOneTicker(ticker, global) {
      const meta = INSTRUMENTS[ticker];
      if (!meta) throw new Error(`Neznámý instrument ${ticker}.`);
      if (meta.type === 'synthetic') return generateSyntheticPrices(ticker, global.months);
      const errors = [];
      if (meta.alphaSymbol) {
        try { return await fetchAlphaMonthlyAdjusted(meta.alphaSymbol); } catch (err) { errors.push(err.message || String(err)); }
      }
      if (meta.twelveSymbol && meta.twelveAdjust) {
        try { return await fetchTwelveMonthly(meta.twelveSymbol, meta.twelveExchange, meta.twelveAdjust, global.startMonth); } catch (err) { errors.push(err.message || String(err)); }
      }
      throw new Error(`${ticker}: data se nepodařilo načíst. ${errors.join(' | ')}`);
    }
    async function loadPriceData(tickers, global) {
      const data = {};
      await Promise.all(tickers.map(async ticker => { data[ticker] = await loadOneTicker(ticker, global); }));
      return data;
    }
    function findUsableMonths(allData, wantedMonths, tickers) {
      let usable = new Set(wantedMonths);
      tickers.forEach(ticker => { if (ticker === 'CASH') return; const months = new Set(Object.keys(allData[ticker] || {})); usable = new Set([...usable].filter(m => months.has(m))); });
      return [...usable].sort();
    }

    function emptyPortfolio() { return { CASH: { shares: 0, value: 0 } }; }
    function clonePortfolio(portfolio) { return Object.fromEntries(Object.entries(portfolio).map(([k, v]) => [k, { shares: v.shares, value: v.value }])); }
    function totalValue(portfolio) { return Object.values(portfolio).reduce((sum, item) => sum + (Number.isFinite(item.value) ? item.value : 0), 0); }
    function markToMarket(portfolio, month, data) { Object.keys(portfolio).forEach(ticker => { if (ticker === 'CASH') { portfolio[ticker].value = portfolio[ticker].shares; return; } const price = data[ticker]?.[month]; if (!Number.isFinite(price) || price <= 0) throw new Error(`Chybí cena ${ticker} pro ${month}.`); portfolio[ticker].value = portfolio[ticker].shares * price; }); }
    function ensureAsset(portfolio, ticker) { if (!portfolio[ticker]) portfolio[ticker] = { shares: 0, value: 0 }; }
    function buyGrossValue(portfolio, ticker, desiredGrossValue, month, data, txRate) {
      if (ticker === 'CASH' || desiredGrossValue <= 1e-9) return { traded: 0, cost: 0 };
      const price = data[ticker]?.[month]; if (!Number.isFinite(price) || price <= 0) throw new Error(`Nelze koupit ${ticker}: chybí cena pro ${month}.`);
      const availableCash = portfolio.CASH.value; const gross = Math.min(desiredGrossValue, availableCash / (1 + txRate)); if (gross <= 1e-9) return { traded: 0, cost: 0 };
      const cost = gross * txRate; const shares = gross / price; ensureAsset(portfolio, ticker); portfolio[ticker].shares += shares; portfolio[ticker].value += gross; portfolio.CASH.shares -= (gross + cost); portfolio.CASH.value = portfolio.CASH.shares; return { traded: gross, cost };
    }
    function sellGrossValue(portfolio, ticker, desiredGrossValue, month, data, txRate) {
      if (ticker === 'CASH' || !portfolio[ticker] || desiredGrossValue <= 1e-9) return { traded: 0, cost: 0 };
      const price = data[ticker]?.[month]; if (!Number.isFinite(price) || price <= 0) throw new Error(`Nelze prodat ${ticker}: chybí cena pro ${month}.`);
      const gross = Math.min(desiredGrossValue, portfolio[ticker].value); if (gross <= 1e-9) return { traded: 0, cost: 0 };
      const cost = gross * txRate; const shares = gross / price; portfolio[ticker].shares = Math.max(0, portfolio[ticker].shares - shares); portfolio[ticker].value = Math.max(0, portfolio[ticker].value - gross); portfolio.CASH.shares += (gross - cost); portfolio.CASH.value = portfolio.CASH.shares; return { traded: gross, cost };
    }
    function investAmountByTarget(portfolio, cfg, amount, month, data) {
      let tx = 0; const spendable = Math.min(amount, portfolio.CASH.value); if (spendable <= 1e-9) return 0;
      Object.entries(cfg.assets).forEach(([ticker, weight]) => { if (ticker === 'CASH' || weight <= 0) return; const result = buyGrossValue(portfolio, ticker, spendable * weight, month, data, cfg.txCost); tx += result.cost; });
      return tx;
    }
    function needsRebalance(portfolio, cfg) {
      const total = totalValue(portfolio); if (total <= 1e-9) return false;
      const tickers = new Set([...Object.keys(portfolio), ...Object.keys(cfg.assets)]);
      for (const ticker of tickers) { const current = (portfolio[ticker]?.value || 0) / total; const target = cfg.assets[ticker] || 0; if (Math.abs(current - target) > cfg.tolerance + 1e-9) return true; }
      return false;
    }
    function investCashPreferUnderweight(portfolio, cfg, month, data) {
      let tx = 0; let total = totalValue(portfolio); if (total <= 1e-9) return 0;
      const cashTarget = total * (cfg.assets.CASH || 0); let excessCash = Math.max(0, portfolio.CASH.value - cashTarget); if (excessCash <= 1e-9) return 0;
      const gaps = Object.entries(cfg.assets).filter(([ticker, weight]) => ticker !== 'CASH' && weight > 0).map(([ticker, weight]) => ({ ticker, gap: total * weight - (portfolio[ticker]?.value || 0) })).filter(x => x.gap > 1e-9).sort((a, b) => b.gap - a.gap);
      for (const item of gaps) { if (excessCash <= 1e-9) break; const result = buyGrossValue(portfolio, item.ticker, Math.min(item.gap, excessCash / (1 + cfg.txCost)), month, data, cfg.txCost); tx += result.cost; total = totalValue(portfolio); excessCash = Math.max(0, portfolio.CASH.value - total * (cfg.assets.CASH || 0)); }
      if (excessCash > 1e-6) tx += investAmountByTarget(portfolio, cfg, excessCash, month, data);
      return tx;
    }
    function rebalanceFull(portfolio, cfg, month, data) {
      if (!needsRebalance(portfolio, cfg)) return 0; let tx = 0; const beforeTotal = totalValue(portfolio); const tickers = new Set([...Object.keys(portfolio), ...Object.keys(cfg.assets)]);
      const sells = []; tickers.forEach(ticker => { if (ticker === 'CASH') return; const current = portfolio[ticker]?.value || 0; const target = beforeTotal * (cfg.assets[ticker] || 0); if (current > target + 1e-9) sells.push({ ticker, amount: current - target }); });
      sells.forEach(sell => { tx += sellGrossValue(portfolio, sell.ticker, sell.amount, month, data, cfg.txCost).cost; });
      const afterSellsTotal = totalValue(portfolio); const buys = [];
      Object.entries(cfg.assets).forEach(([ticker, weight]) => { if (ticker === 'CASH' || weight <= 0) return; const current = portfolio[ticker]?.value || 0; const target = afterSellsTotal * weight; if (target > current + 1e-9) buys.push({ ticker, amount: target - current }); });
      buys.sort((a, b) => b.amount - a.amount); buys.forEach(buy => { tx += buyGrossValue(portfolio, buy.ticker, buy.amount, month, data, cfg.txCost).cost; });
      return tx;
    }
    function executePolicyAfterCashflow(portfolio, cfg, cashflowAmount, month, data) {
      if (cfg.rebalMode === 'none') return investAmountByTarget(portfolio, cfg, cashflowAmount, month, data);
      if (cfg.rebalMode === 'buy') return investCashPreferUnderweight(portfolio, cfg, month, data);
      if (cfg.rebalMode === 'full') { if (needsRebalance(portfolio, cfg)) return rebalanceFull(portfolio, cfg, month, data); return investAmountByTarget(portfolio, cfg, cashflowAmount, month, data); }
      return 0;
    }
    function applyFees(portfolio, cfg) {
      let terFee = 0; let managerFee = 0;
      Object.keys(portfolio).forEach(ticker => { if (ticker === 'CASH') return; const rate = annualToMonthlyRate(cfg.ter[ticker] || 0); const value = portfolio[ticker].value; const fee = value * rate; if (fee > 0 && value > 0) { const factor = Math.max(0, (value - fee) / value); portfolio[ticker].shares *= factor; portfolio[ticker].value *= factor; terFee += fee; } });
      const total = totalValue(portfolio); const managerRate = annualToMonthlyRate(cfg.managerFee); managerFee = total * managerRate;
      if (managerFee > 0 && total > 1e-9) { const factor = Math.max(0, (total - managerFee) / total); Object.keys(portfolio).forEach(ticker => { portfolio[ticker].shares *= factor; portfolio[ticker].value *= factor; }); }
      Object.keys(portfolio).forEach(ticker => { if (portfolio[ticker].shares < 1e-9) portfolio[ticker].shares = 0; if (portfolio[ticker].value < 1e-9) portfolio[ticker].value = 0; }); portfolio.CASH.value = portfolio.CASH.shares;
      return { terFee, managerFee, totalFee: terFee + managerFee };
    }
    function xirr(cashflows) {
      const valid = cashflows.filter(cf => Number.isFinite(cf.amount) && cf.date instanceof Date && !Number.isNaN(cf.date.getTime())); if (!valid.some(cf => cf.amount < 0) || !valid.some(cf => cf.amount > 0)) return NaN;
      const t0 = valid[0].date.getTime(); const years = cf => (cf.date.getTime() - t0) / (365.25 * 24 * 3600 * 1000); const npv = rate => valid.reduce((sum, cf) => sum + cf.amount / Math.pow(1 + rate, years(cf)), 0);
      let low = -0.9999; let high = 10; let fLow = npv(low); let fHigh = npv(high);
      for (let i = 0; i < 80 && fLow * fHigh > 0; i++) { high *= 2; fHigh = npv(high); if (high > 1e6) return NaN; }
      if (fLow * fHigh > 0) return NaN;
      for (let i = 0; i < 120; i++) { const mid = (low + high) / 2; const fMid = npv(mid); if (Math.abs(fMid) < 1e-7) return mid; if (fLow * fMid <= 0) { high = mid; fHigh = fMid; } else { low = mid; fLow = fMid; } }
      return (low + high) / 2;
    }
    function stddev(values) { if (values.length < 2) return NaN; const mean = values.reduce((a, b) => a + b, 0) / values.length; const variance = values.reduce((s, x) => s + (x - mean) ** 2, 0) / (values.length - 1); return Math.sqrt(variance); }
    function maxDrawdownFromIndex(indexValues) { let peak = -Infinity; let maxDd = 0; indexValues.forEach(v => { peak = Math.max(peak, v); if (peak > 0) maxDd = Math.min(maxDd, v / peak - 1); }); return maxDd; }

    function simulatePortfolio(cfg, global, months, data) {
      const portfolio = emptyPortfolio(); const cashflows = []; const history = []; const monthlyReturns = []; let totalInvested = 0; let totalTxCosts = 0; let totalFees = 0; let totalTerFees = 0; let totalManagerFees = 0; let navIndex = 100; const navSeries = [navIndex]; const firstMonth = months[0];
      function addExternalContribution(amount, month, label) { if (amount <= 0) return 0; portfolio.CASH.shares += amount; portfolio.CASH.value = portfolio.CASH.shares; totalInvested += amount; cashflows.push({ date: monthToDate(month), amount: -amount, label }); return amount; }
      const firstDeposit = addExternalContribution(cfg.initialInvestment, firstMonth, 'Počáteční investice') + addExternalContribution(cfg.monthlyInvestment, firstMonth, 'První měsíční vklad');
      totalTxCosts += executePolicyAfterCashflow(portfolio, cfg, firstDeposit, firstMonth, data); markToMarket(portfolio, firstMonth, data);
      history.push({ month: firstMonth, value: totalValue(portfolio), deposit: firstDeposit, fees: 0, txCosts: totalTxCosts, cumulativeInvested: totalInvested, navIndex, portfolio: clonePortfolio(portfolio) });
      for (let i = 1; i < months.length; i++) {
        const prevMonth = months[i - 1]; const month = months[i]; markToMarket(portfolio, prevMonth, data); let depositThisRecord = 0; let txThisRecord = 0; let feesThisRecord = 0;
        const deposit = addExternalContribution(cfg.monthlyInvestment, prevMonth, 'Měsíční vklad'); depositThisRecord += deposit; txThisRecord += executePolicyAfterCashflow(portfolio, cfg, deposit, prevMonth, data);
        const startValueForReturn = totalValue(portfolio); markToMarket(portfolio, month, data); const fees = applyFees(portfolio, cfg); feesThisRecord += fees.totalFee; totalFees += fees.totalFee; totalTerFees += fees.terFee; totalManagerFees += fees.managerFee;
        const valueAfterMarketAndFees = totalValue(portfolio); const monthlyReturn = startValueForReturn > 1e-9 ? (valueAfterMarketAndFees / startValueForReturn) - 1 : 0;
        if (Number.isFinite(monthlyReturn)) { monthlyReturns.push(monthlyReturn); navIndex *= (1 + monthlyReturn); navSeries.push(navIndex); }
        totalTxCosts += txThisRecord; markToMarket(portfolio, month, data);
        history.push({ month, value: totalValue(portfolio), deposit: depositThisRecord, fees: feesThisRecord, txCosts: txThisRecord, cumulativeInvested: totalInvested, navIndex, portfolio: clonePortfolio(portfolio) });
      }
      const finalValue = totalValue(portfolio); cashflows.push({ date: monthToDate(months[months.length - 1]), amount: finalValue, label: 'Finální hodnota' });
      const product = monthlyReturns.reduce((acc, r) => acc * (1 + r), 1); const twrAnnual = monthlyReturns.length > 0 ? Math.pow(product, 12 / monthlyReturns.length) - 1 : NaN; const volAnnual = stddev(monthlyReturns) * Math.sqrt(12); const sharpe = Number.isFinite(twrAnnual) && Number.isFinite(volAnnual) && volAnnual > 1e-9 ? (twrAnnual - global.riskFreeRate) / volAnnual : NaN; const moneyWeighted = xirr(cashflows); const maxDd = maxDrawdownFromIndex(navSeries); const simpleProfit = finalValue - totalInvested;
      const finalAllocation = {}; const finalTotal = totalValue(portfolio); Object.entries(portfolio).forEach(([ticker, item]) => { if (item.value > 1e-7 && finalTotal > 1e-9) finalAllocation[ticker] = item.value / finalTotal; });
      return { id: cfg.id, history, finalValue, totalInvested, simpleProfit, totalFees, totalTerFees, totalManagerFees, totalTxCosts, monthlyReturns, twrAnnual, xirr: moneyWeighted, volatilityAnnual: volAnnual, sharpe, maxDrawdown: maxDd, finalAllocation, cashflows };
    }

    function collectConfig() {
      const global = readGlobalConfig(); const a = readPortfolioConfig('A'); const b = readPortfolioConfig('B'); const errors = [...global.errors, ...a.errors, ...b.errors]; const tickers = [...new Set([...Object.keys(a.config.assets), ...Object.keys(b.config.assets)])].filter(t => t !== 'CASH'); return { global, portfolioA: a.config, portfolioB: b.config, tickers, errors };
    }
    async function runSimulation() {
      hideAlert(); setLoading(true);
      try { const cfg = collectConfig(); if (cfg.errors.length) throw new Error(cfg.errors.join(' ')); const data = await loadPriceData(cfg.tickers, cfg.global); const months = findUsableMonths(data, cfg.global.months, cfg.tickers); if (months.length < 2) throw new Error('Po průniku dostupných dat nezbyly alespoň dva měsíce.'); const resultA = simulatePortfolio(cfg.portfolioA, cfg.global, months, data); const resultB = simulatePortfolio(cfg.portfolioB, cfg.global, months, data); const result = { cfg, months, data, resultA, resultB }; state.lastResult = result; renderResults(result); } catch (err) { console.error(err); showAlert(err.message || String(err)); } finally { setLoading(false); }
    }
    function metricRow(label, a, b, hint = '') { const title = hint ? ` title="${hint.replaceAll('"', '&quot;')}" data-bs-toggle="tooltip"` : ''; const labelHtml = hint ? `<span class="metric-help"${title}>${label}</span>` : label; return `<tr><td>${labelHtml}</td><td>${a}</td><td>${b}</td></tr>`; }
    function renderResults({ months, resultA, resultB }) {
      $('resultsSection').classList.remove('d-none'); $('periodSummary').textContent = `${months[0]} až ${months[months.length - 1]} · ${months.length - 1} měsíčních intervalů`;
      setDiff('diffFinal', resultA.finalValue - resultB.finalValue, formatValue(resultA.finalValue - resultB.finalValue)); setDiff('diffProfit', resultA.simpleProfit - resultB.simpleProfit, formatValue(resultA.simpleProfit - resultB.simpleProfit)); setDiff('diffXirr', resultA.xirr - resultB.xirr, formatPct(resultA.xirr - resultB.xirr));
      $('metricsBody').innerHTML = [metricRow('Konečná hodnota', formatValue(resultA.finalValue), formatValue(resultB.finalValue)), metricRow('Celkem vloženo', formatValue(resultA.totalInvested), formatValue(resultB.totalInvested)), metricRow('Zisk / ztráta', signedValue(resultA.simpleProfit), signedValue(resultB.simpleProfit)), metricRow('XIRR / money-weighted výnos', formatPct(resultA.xirr), formatPct(resultB.xirr), 'Výnos investora včetně načasování vkladů.'), metricRow('TWR / čistý výnos strategie', formatPct(resultA.twrAnnual), formatPct(resultB.twrAnnual), 'Time-weighted výnos bez zkreslení velikostí vkladů.'), metricRow('Roční volatilita', formatPct(resultA.volatilityAnnual), formatPct(resultB.volatilityAnnual)), metricRow('Maximální propad', formatPct(resultA.maxDrawdown), formatPct(resultB.maxDrawdown), 'Počítáno z unitized NAV, ne z absolutní hodnoty s dalšími vklady.'), metricRow('Sharpe Ratio', formatNumber(resultA.sharpe), formatNumber(resultB.sharpe)), metricRow('Poplatky celkem', formatValue(resultA.totalFees), formatValue(resultB.totalFees)), metricRow('z toho TER', formatValue(resultA.totalTerFees), formatValue(resultB.totalTerFees)), metricRow('z toho správce/platforma', formatValue(resultA.totalManagerFees), formatValue(resultB.totalManagerFees)), metricRow('Transakční náklady', formatValue(resultA.totalTxCosts), formatValue(resultB.totalTxCosts)), metricRow('Finální CASH váha', formatPct(resultA.finalAllocation.CASH || 0), formatPct(resultB.finalAllocation.CASH || 0))].join('');
      drawValueChart(resultA, resultB); drawNavChart(resultA, resultB); drawAllocationChart('A', resultA.finalAllocation); drawAllocationChart('B', resultB.finalAllocation); initTooltips();
    }
    function setDiff(id, value, text) { const el = $(id); el.textContent = text; el.className = `h4 mb-0 ${value > 0 ? 'result-positive' : value < 0 ? 'result-negative' : ''}`; }
    function signedValue(value) { const text = formatValue(value); if (!Number.isFinite(value)) return text; const cls = value > 0 ? 'result-positive' : value < 0 ? 'result-negative' : ''; return `<span class="${cls}">${text}</span>`; }
    function destroyChart(name) { if (state[name]) { state[name].destroy(); state[name] = null; } }
    function drawValueChart(a, b) {
      destroyChart('valueChart'); const axisType = document.querySelector('input[name="axisScale"]:checked')?.value || 'linear';
      state.valueChart = new Chart($('valueChart'), { type: 'line', data: { labels: a.history.map(h => h.month), datasets: [{ label: 'Portfolio A', data: a.history.map(h => h.value), tension: .12, pointRadius: 0, borderWidth: 2 }, { label: 'Portfolio B', data: b.history.map(h => h.value), tension: .12, pointRadius: 0, borderWidth: 2 }, { label: 'Vklady A kumul.', data: a.history.map(h => h.cumulativeInvested), tension: .12, pointRadius: 0, borderDash: [4, 4], borderWidth: 1 }, { label: 'Vklady B kumul.', data: b.history.map(h => h.cumulativeInvested), tension: .12, pointRadius: 0, borderDash: [4, 4], borderWidth: 1 }] }, options: { responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false }, scales: { y: { type: axisType, beginAtZero: axisType === 'linear', ticks: { callback: v => formatValue(Number(v), 0) } }, x: { ticks: { autoSkip: true, maxTicksLimit: 14 } } }, plugins: { tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${formatValue(ctx.parsed.y, 0)}` } } } } });
    }
    function drawNavChart(a, b) {
      destroyChart('navChart'); state.navChart = new Chart($('navChart'), { type: 'line', data: { labels: a.history.map(h => h.month), datasets: [{ label: 'NAV A', data: a.history.map(h => h.navIndex), tension: .12, pointRadius: 0, borderWidth: 2 }, { label: 'NAV B', data: b.history.map(h => h.navIndex), tension: .12, pointRadius: 0, borderWidth: 2 }] }, options: { responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false }, scales: { y: { ticks: { callback: v => formatNumber(Number(v), 0) } }, x: { ticks: { autoSkip: true, maxTicksLimit: 14 } } } } });
    }
    function drawAllocationChart(id, allocation) { const name = id === 'A' ? 'allocChartA' : 'allocChartB'; destroyChart(name); state[name] = new Chart($(`allocChart${id}`), { type: 'doughnut', data: { labels: Object.keys(allocation), datasets: [{ data: Object.values(allocation) }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { tooltip: { callbacks: { label: ctx => `${ctx.label}: ${formatPct(ctx.parsed)}` } } } } }); }

    function runSanityTests() {
      const baseGlobal = { startMonth: '2020-01', endMonth: '2021-01', months: monthsBetween('2020-01', '2021-01'), riskFreeRate: 0 };
      const baseCfg = { id: 'T', initialInvestment: 100, monthlyInvestment: 0, managerFee: 0, txCost: 0, tolerance: 0.05, rebalMode: 'none', assets: { TEST_FLAT: 1, CASH: 0 }, ter: { TEST_FLAT: 0, CASH: 0 } };
      const tests = []; const test = (name, fn) => { try { const result = fn(); tests.push({ name, pass: result.pass, detail: result.detail }); } catch (err) { tests.push({ name, pass: false, detail: err.message || String(err) }); } }; const close = (a, e, eps = 1e-6) => Math.abs(a - e) <= eps;
      test('Konstantní cena bez poplatků: final = investice', () => { const data = { TEST_FLAT: generateSyntheticPrices('TEST_FLAT', baseGlobal.months) }; const res = simulatePortfolio(structuredCloneSafe(baseCfg), baseGlobal, baseGlobal.months, data); return { pass: close(res.finalValue, 100), detail: `${formatValue(res.finalValue, 6)} vs 100` }; });
      test('+1 % měsíčně po 12 intervalů: 100 × 1.01^12', () => { const cfg = structuredCloneSafe(baseCfg); cfg.assets = { TEST_GROWTH_1PM: 1, CASH: 0 }; cfg.ter = { TEST_GROWTH_1PM: 0, CASH: 0 }; const data = { TEST_GROWTH_1PM: generateSyntheticPrices('TEST_GROWTH_1PM', baseGlobal.months) }; const res = simulatePortfolio(cfg, baseGlobal, baseGlobal.months, data); const expected = 100 * Math.pow(1.01, 12); return { pass: close(res.finalValue, expected, 1e-6), detail: `${formatValue(res.finalValue, 6)} vs ${formatValue(expected, 6)}` }; });
      test('Konstantní cena + měsíční vklady: final = celkem vloženo', () => { const cfg = structuredCloneSafe(baseCfg); cfg.initialInvestment = 0; cfg.monthlyInvestment = 100; const data = { TEST_FLAT: generateSyntheticPrices('TEST_FLAT', baseGlobal.months) }; const res = simulatePortfolio(cfg, baseGlobal, baseGlobal.months, data); return { pass: close(res.finalValue, res.totalInvested, 1e-6), detail: `final ${formatValue(res.finalValue, 6)}, vloženo ${formatValue(res.totalInvested, 6)}` }; });
      test('Buy-only při 100% alokaci nenechá vklad v cashi', () => { const cfg = structuredCloneSafe(baseCfg); cfg.initialInvestment = 0; cfg.monthlyInvestment = 100; cfg.rebalMode = 'buy'; const data = { TEST_FLAT: generateSyntheticPrices('TEST_FLAT', baseGlobal.months) }; const res = simulatePortfolio(cfg, baseGlobal, baseGlobal.months, data); const cash = res.finalAllocation.CASH || 0; return { pass: cash < 1e-9, detail: `CASH váha ${formatPct(cash, 8)}` }; });
      $('testsSection').classList.remove('d-none'); $('testsOutput').innerHTML = `<div class="table-responsive"><table class="table table-sm mb-0"><thead><tr><th>Test</th><th>Stav</th><th>Detail</th></tr></thead><tbody>${tests.map(t => `<tr><td>${t.name}</td><td class="${t.pass ? 'test-pass' : 'test-fail'}">${t.pass ? 'PASS' : 'FAIL'}</td><td>${t.detail}</td></tr>`).join('')}</tbody></table></div>`;
    }

    function getUiConfig() {
      const assetRows = id => qsa(`#assets${id} .asset-row`).map(row => ({ ticker: getRowTicker(row), weight: Number(row.querySelector('.asset-weight').value) }));
      return { startDate: $('startDate').value, endDate: $('endDate').value, riskFreeRate: $('riskFreeRate').value, A: { initialInvest: $('initialInvestA').value, monthlyInvest: $('monthlyInvestA').value, managerFee: $('managerFeeA').value, txCost: $('txCostA').value, tolerance: $('toleranceA').value, rebalMode: $('rebalModeA').value, assets: assetRows('A') }, B: { initialInvest: $('initialInvestB').value, monthlyInvest: $('monthlyInvestB').value, managerFee: $('managerFeeB').value, txCost: $('txCostB').value, tolerance: $('toleranceB').value, rebalMode: $('rebalModeB').value, assets: assetRows('B') } };
    }
    function applyUiConfig(config) {
      $('startDate').value = config.startDate || '2020-01'; $('endDate').value = config.endDate || '2025-12'; $('riskFreeRate').value = config.riskFreeRate ?? 2;
      ['A', 'B'].forEach(id => { const c = config[id] || {}; $(`initialInvest${id}`).value = c.initialInvest ?? 100000; $(`monthlyInvest${id}`).value = c.monthlyInvest ?? 10000; $(`managerFee${id}`).value = c.managerFee ?? 0; $(`txCost${id}`).value = c.txCost ?? 0; $(`tolerance${id}`).value = c.tolerance ?? 5; $(`rebalMode${id}`).value = c.rebalMode || 'none'; clearAssets(id); (c.assets || []).forEach(a => addAssetRow(id, a.ticker, a.weight)); updateWeightSummary(id); }); updateAllRebalUi();
    }
    function saveConfig() { localStorage.setItem(CONFIG_KEY, JSON.stringify(getUiConfig())); showAlert('Konfigurace uložena do localStorage.', 'success'); }
    function loadConfig() { const raw = localStorage.getItem(CONFIG_KEY); if (!raw) { showAlert('Žádná uložená konfigurace zatím neexistuje.', 'warning'); return; } try { applyUiConfig(JSON.parse(raw)); showAlert('Konfigurace načtena.', 'success'); } catch (err) { showAlert('Konfiguraci se nepodařilo načíst: ' + (err.message || String(err))); } }
    function exportConfig() { $('exportText').value = JSON.stringify(getUiConfig(), null, 2); new bootstrap.Modal($('exportModal')).show(); }
    function clearDataCache() { Object.keys(localStorage).filter(key => key.startsWith(DATA_CACHE_PREFIX)).forEach(key => localStorage.removeItem(key)); showAlert('Cache cenových dat byla vymazána.', 'success'); }
    function updateRebalUi(id) {
      const mode = $(`rebalMode${id}`).value;
      const tolerance = $(`tolerance${id}`);
      const disabled = mode === 'none';
      tolerance.disabled = disabled;
      tolerance.title = disabled ? 'Tolerance se používá jen u dokupování podvážených aktiv a plného rebalancování.' : '';
    }
    function updateAllRebalUi() { updateRebalUi('A'); updateRebalUi('B'); }
    function applySyntheticPreset() { $('startDate').value = '2020-01'; $('endDate').value = '2025-12'; $('riskFreeRate').value = 0; clearAssets('A'); clearAssets('B'); addAssetRow('A', 'TEST_SINE_HIGH', 50); addAssetRow('A', 'TEST_NEG_SINE_HIGH', 50); addAssetRow('B', 'TEST_SINE_HIGH', 50); addAssetRow('B', 'TEST_NEG_SINE_HIGH', 50); $('initialInvestA').value = 100000; $('initialInvestB').value = 100000; $('monthlyInvestA').value = 10000; $('monthlyInvestB').value = 10000; $('managerFeeA').value = 0; $('managerFeeB').value = 0; $('txCostA').value = 0; $('txCostB').value = 0; $('rebalModeA').value = 'full'; $('rebalModeB').value = 'none'; updateWeightSummary('A'); updateWeightSummary('B'); updateAllRebalUi(); }
    function applyEtfPreset() { clearAssets('A'); clearAssets('B'); addAssetRow('A', 'VTI', 55); addAssetRow('A', 'VXUS', 25); addAssetRow('A', 'BND', 15); addAssetRow('A', 'GLD', 5); addAssetRow('B', 'QQQ', 70); addAssetRow('B', 'TLT', 20); addAssetRow('B', 'IAU', 10); $('managerFeeA').value = 0.3; $('managerFeeB').value = 0.3; $('txCostA').value = 0.05; $('txCostB').value = 0.05; $('rebalModeA').value = 'full'; $('rebalModeB').value = 'none'; updateWeightSummary('A'); updateWeightSummary('B'); updateAllRebalUi(); }
    function initTooltips() { qsa('[data-bs-toggle="tooltip"]').forEach(el => { const old = bootstrap.Tooltip.getInstance(el); if (old) old.dispose(); new bootstrap.Tooltip(el); }); }
    function init() {
      qsa('.add-asset').forEach(btn => btn.addEventListener('click', () => addAssetRow(btn.dataset.portfolio)));
      ['A', 'B'].forEach(id => $(`rebalMode${id}`).addEventListener('change', () => updateRebalUi(id)));
      $('runSimulationBtn').addEventListener('click', runSimulation); $('runTestsBtn').addEventListener('click', runSanityTests); $('saveConfigBtn').addEventListener('click', saveConfig); $('loadConfigBtn').addEventListener('click', loadConfig); $('exportConfigBtn').addEventListener('click', exportConfig); $('clearCacheBtn').addEventListener('click', clearDataCache); $('syntheticPresetBtn').addEventListener('click', applySyntheticPreset); $('etfPresetBtn').addEventListener('click', applyEtfPreset); $('saveApiKeysBtn').addEventListener('click', saveApiKeys); $('clearApiKeysBtn').addEventListener('click', clearApiKeys); updateApiKeyStatus();
      qsa('input[name="axisScale"]').forEach(el => el.addEventListener('change', () => { if (state.lastResult) drawValueChart(state.lastResult.resultA, state.lastResult.resultB); }));
      addAssetRow('A', 'TEST_SINE_HIGH', 50); addAssetRow('A', 'TEST_NEG_SINE_HIGH', 50); addAssetRow('B', 'TEST_SINE_HIGH', 50); addAssetRow('B', 'TEST_NEG_SINE_HIGH', 50); updateAllRebalUi(); initTooltips();
    }
    window.PortfolioBacktesterCore = {
      monthsBetween,
      generateSyntheticPrices,
      simulatePortfolio,
      annualToMonthlyRate,
      xirr,
      findUsableMonths
    };

    if (document.getElementById('portfolioBacktester')) {
      init();
    }

})();
