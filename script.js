/**
 * FreshRoute - Intelligent Perishable Produce Distribution Platform
 * Interactive Application Logic & Simulation Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initSimulator();
  initComparisonChart();
  initXAIExplorer();
  initROICalculator();
  initFAQ();
  initModal();
  initMobileMenu();
});

/* ===================================================================
   Sticky Header & Scroll Effects
   =================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ===================================================================
   Interactive Simulation Engine
   =================================================================== */
const scenarioPresets = {
  heatwave: {
    temp: 34,
    delay: 3.5,
    fuel: 2.4,
    desc: 'Severe heatwave with transit delays. Shelf-life decays 40% faster; instant dynamic discounts triggered.'
  },
  standard: {
    temp: 24,
    delay: 1.0,
    fuel: 1.8,
    desc: 'Nominal distribution conditions with typical highway flow and steady terminal demand.'
  },
  peak_demand: {
    temp: 26,
    delay: 1.5,
    fuel: 2.1,
    desc: 'High festive retail demand surge. Premium supermarkets willing to pay 18% spot premium.'
  },
  congestion: {
    temp: 28,
    delay: 5.0,
    fuel: 2.6,
    desc: 'Critical interstate route disruption. FreshRoute re-routes ultra-perishables to local dark stores.'
  }
};

const produceInventory = [
  {
    id: 'FR-809',
    name: 'Haas Avocados',
    emoji: '🥑',
    category: 'Subtropical',
    qty: 3200,
    baseLifeHours: 28,
    initialQuality: 82,
    dest: 'Metro Premium Mart',
    destClass: 'supermarket',
    transitTime: 3.2,
    baselineAction: 'FIFO dispatch to distant regional terminal (12h transit)',
    baselineResult: '38% spoilage ($4,100 loss)',
    optAction: 'Priority #1 rerouted to Metro Premium Mart (3.2h transit)',
    discount: null,
    savedLoss: '$3,850'
  },
  {
    id: 'FR-814',
    name: 'Organic Strawberries',
    emoji: '🍓',
    category: 'Berries / Ultra-Perishable',
    qty: 1800,
    baseLifeHours: 19,
    initialQuality: 88,
    dest: 'Quick-Commerce Hubs',
    destClass: 'quickcommerce',
    transitTime: 1.4,
    baselineAction: 'Hold for standard weekend supermarket orders at full price',
    baselineResult: 'Expired on shelf, 65% unsold write-off ($5,200 loss)',
    optAction: 'Flash 15% markdown allocated to 15-min delivery dark stores',
    discount: '15% Markdown Active',
    savedLoss: '$4,600'
  },
  {
    id: 'FR-802',
    name: 'Roma Field Tomatoes',
    emoji: '🍅',
    category: 'Solanaceae',
    qty: 5400,
    baseLifeHours: 42,
    initialQuality: 91,
    dest: 'Wholesale Mandi Terminal',
    destClass: 'wholesale',
    transitTime: 4.5,
    baselineAction: 'Dispatched in unsegregated truck causing ethylene damage to greens',
    baselineResult: 'Degraded quality tier, price penalized 30%',
    optAction: 'Compartmentalized Reefer Zone 2; guaranteed Tier A arrival',
    discount: null,
    savedLoss: '$2,900'
  },
  {
    id: 'FR-791',
    name: 'Crisp Bell Peppers',
    emoji: '🫑',
    category: 'Vegetables',
    qty: 2600,
    baseLifeHours: 56,
    initialQuality: 95,
    dest: 'Regional Processing & Retail',
    destClass: 'processing',
    transitTime: 5.0,
    baselineAction: 'Rushed delivery causing half-empty truck haul (48% capacity)',
    baselineResult: '$1,200 excess deadhead transport expense',
    optAction: 'Consolidated with Batch #FR-802 for 96% payload efficiency',
    discount: null,
    savedLoss: '$1,750'
  }
];

function initSimulator() {
  const scenarioSelect = document.getElementById('simScenarioSelect');
  const tempSlider = document.getElementById('simTempSlider');
  const delaySlider = document.getElementById('simDelaySlider');
  const fuelSlider = document.getElementById('simFuelSlider');

  const tempVal = document.getElementById('simTempVal');
  const delayVal = document.getElementById('simDelayVal');
  const fuelVal = document.getElementById('simFuelVal');
  const runSimBtn = document.getElementById('runSimBtn');

  if (!tempSlider) return;

  function updateSliderDisplays() {
    tempVal.textContent = `${tempSlider.value}°C`;
    delayVal.textContent = `${delaySlider.value} hrs`;
    fuelVal.textContent = `$${parseFloat(fuelSlider.value).toFixed(2)}/km`;
  }

  tempSlider.addEventListener('input', () => {
    updateSliderDisplays();
    calculateSimulation();
  });

  delaySlider.addEventListener('input', () => {
    updateSliderDisplays();
    calculateSimulation();
  });

  fuelSlider.addEventListener('input', () => {
    updateSliderDisplays();
    calculateSimulation();
  });

  if (scenarioSelect) {
    scenarioSelect.addEventListener('change', (e) => {
      const preset = scenarioPresets[e.target.value] || scenarioPresets.standard;
      tempSlider.value = preset.temp;
      delaySlider.value = preset.delay;
      fuelSlider.value = preset.fuel;
      updateSliderDisplays();
      calculateSimulation(true);
      showToast(`Applied preset: ${e.target.options[e.target.selectedIndex].text}`);
    });
  }

  if (runSimBtn) {
    runSimBtn.addEventListener('click', () => {
      runSimBtn.innerHTML = `
        <svg class="spin-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg> Recomputing AI Allocations...`;
      runSimBtn.disabled = true;

      setTimeout(() => {
        calculateSimulation(true);
        runSimBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 4 23 10 17 10"></polyline>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
          </svg> Re-Optimize Dispatch Plan`;
        runSimBtn.disabled = false;
        showToast('FreshRoute Optimization Completed: Spoilage dropped to 2.1%');
      }, 700);
    });
  }

  // Initial calculation
  calculateSimulation();
}

function calculateSimulation(animate = false) {
  const temp = parseFloat(document.getElementById('simTempSlider')?.value || 24);
  const delay = parseFloat(document.getElementById('simDelaySlider')?.value || 1.0);
  const fuel = parseFloat(document.getElementById('simFuelSlider')?.value || 1.8);

  // Environmental stress index
  const stressMultiplier = 1 + (Math.max(0, temp - 20) * 0.05) + (delay * 0.08);

  const container = document.getElementById('simResultsContainer');
  if (!container) return;

  let totalQty = 0;
  let estimatedSpoilageSaved = 0;
  let netMarginTotal = 0;

  const html = produceInventory.map(batch => {
    totalQty += batch.qty;
    const adjustedLife = Math.max(4, Math.round(batch.baseLifeHours / (1 + (temp - 20) * 0.04) - delay));
    const isCritical = adjustedLife <= 18;
    const isWarning = adjustedLife > 18 && adjustedLife <= 30;

    let dynamicDiscount = null;
    if (adjustedLife < 16) {
      dynamicDiscount = 'Flash 20% Markdown';
      estimatedSpoilageSaved += 4800;
      netMarginTotal += batch.qty * 2.1;
    } else if (adjustedLife < 24) {
      dynamicDiscount = 'Dynamic 10% Discount';
      estimatedSpoilageSaved += 3200;
      netMarginTotal += batch.qty * 2.5;
    } else {
      estimatedSpoilageSaved += 2400;
      netMarginTotal += batch.qty * 2.85;
    }

    const meterClass = isCritical ? 'critical' : isWarning ? 'warning' : 'safe';
    const fillPercent = Math.min(100, Math.max(10, Math.round((adjustedLife / 60) * 100)));

    return `
      <div class="dispatch-card ${isCritical ? 'urgent' : 'optimized'}">
        <div class="dispatch-card-header">
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <span style="font-size:1.4rem;">${batch.emoji}</span>
            <div>
              <div style="font-weight:700; font-size:0.95rem; color:var(--text-main);">${batch.name}</div>
              <span style="font-size:0.75rem; color:var(--text-muted); font-family:var(--font-mono);">${batch.id} • ${batch.qty.toLocaleString()} kg</span>
            </div>
          </div>
          <span class="dispatch-dest-tag ${batch.destClass}">
            ➔ ${batch.dest}
          </span>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin:0.5rem 0;">
          <div style="font-size:0.75rem; color:var(--text-muted);">Adjusted Safe Window:</div>
          <div style="font-size:0.85rem; font-weight:800;" class="meter-val ${meterClass}">
            ${adjustedLife} Hours Remaining
          </div>
        </div>

        <div class="meter-bar" style="width:100%; height:7px; background:#E2E8F0; border-radius:4px; overflow:hidden; margin-bottom:0.75rem;">
          <div class="meter-fill ${meterClass}" style="width: ${fillPercent}%;"></div>
        </div>

        <div class="dispatch-metrics-row">
          <div class="dispatch-m-item">
            <span>Transit Time</span>
            <strong>${(batch.transitTime + delay * 0.4).toFixed(1)}h</strong>
          </div>
          <div class="dispatch-m-item">
            <span>Fulfillment</span>
            <strong style="color:var(--fresh-green-dark);">100%</strong>
          </div>
          <div class="dispatch-m-item">
            <span>Avoided Loss</span>
            <strong style="color:var(--primary);">${batch.savedLoss}</strong>
          </div>
        </div>

        <div class="ai-reasoning-snippet">
          <strong>Decision:</strong> ${batch.optAction}.
        </div>

        ${dynamicDiscount ? `
          <div class="discount-pill">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
            ${dynamicDiscount} to guarantee zero spoilage
          </div>
        ` : ''}
      </div>
    `;
  }).join('');

  container.innerHTML = html;

  // Update summary stats
  const statLossSaved = document.getElementById('simLossSaved');
  const statFulfillment = document.getElementById('simFulfillmentRate');
  const statNetRevenue = document.getElementById('simNetRevenue');

  if (statLossSaved) statLossSaved.textContent = `$${estimatedSpoilageSaved.toLocaleString()}`;
  if (statFulfillment) statFulfillment.textContent = '98.4%';
  if (statNetRevenue) statNetRevenue.textContent = `$${Math.round(netMarginTotal).toLocaleString()}`;
}

/* ===================================================================
   Head-to-Head Comparison Chart & Interactive Switcher
   =================================================================== */
let comparisonChartInstance = null;

function initComparisonChart() {
  const chartCanvas = document.getElementById('comparisonChart');
  if (!chartCanvas) return;

  const ctx = chartCanvas.getContext('2d');
  const chartData = {
    labels: ['Spoilage Rate (%)', 'Demand Fulfillment (%)', 'Transport Cost ($k)', 'Net Revenue ($k)'],
    datasets: [
      {
        label: 'Traditional Baseline (FIFO / Static)',
        backgroundColor: '#94A3B8',
        borderColor: '#64748B',
        borderWidth: 1.5,
        borderRadius: 6,
        data: [18.2, 76.5, 21.4, 148.2]
      },
      {
        label: 'FreshRoute AI-Optimized',
        backgroundColor: '#10B981',
        borderColor: '#059669',
        borderWidth: 1.5,
        borderRadius: 6,
        data: [2.4, 97.2, 15.1, 192.8]
      }
    ]
  };

  const chartConfig = {
    type: 'bar',
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              family: "'Plus Jakarta Sans', sans-serif",
              size: 12,
              weight: 'bold'
            },
            color: '#334155'
          }
        },
        tooltip: {
          backgroundColor: '#0B1E14',
          titleFont: { size: 13, weight: 'bold' },
          bodyFont: { size: 12 },
          padding: 12,
          cornerRadius: 8
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: '#E2E8F0'
          },
          ticks: {
            font: {
              family: "'Plus Jakarta Sans', sans-serif"
            },
            color: '#64748B'
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: {
              family: "'Plus Jakarta Sans', sans-serif",
              weight: 'bold'
            },
            color: '#334155'
          }
        }
      }
    }
  };

  // Check if Chart.js is available
  if (typeof Chart !== 'undefined') {
    comparisonChartInstance = new Chart(ctx, chartConfig);
  } else {
    // Graceful fallback if CDN is slow or blocked
    chartCanvas.parentElement.innerHTML = `
      <div style="padding:2rem; text-align:center; background:#F8FAFC; border-radius:12px; border:1px solid #E2E8F0;">
        <h4 style="color:#0D5C3A; margin-bottom:0.5rem; font-weight:800;">Baseline vs FreshRoute Metric Matrix</h4>
        <p style="color:#64748B; font-size:0.9rem;">FreshRoute reduces spoilage from 18.2% to 2.4%, lifts fulfillment to 97.2%, cuts transport cost by 29.4%, and generates +$44,600 net revenue per cycle.</p>
      </div>
    `;
  }

  // Filter tabs for the comparison section
  const toggleBtns = document.querySelectorAll('.comparison-toggle-btn');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      toggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const view = btn.dataset.view;
      updateComparisonFocus(view);
    });
  });
}

function updateComparisonFocus(view) {
  const cards = document.querySelectorAll('.comp-metric-card');
  cards.forEach(card => {
    if (view === 'all' || card.dataset.category === view) {
      card.style.opacity = '1';
      card.style.transform = 'scale(1)';
    } else {
      card.style.opacity = '0.35';
      card.style.transform = 'scale(0.97)';
    }
  });
}

/* ===================================================================
   Explainable AI (XAI) Recommendation Explorer
   =================================================================== */
const xaiData = {
  'FR-809': {
    crop: 'Haas Avocados',
    batchId: 'FR-809',
    confidence: '98.7% Optimal',
    factors: [
      { label: 'Remaining Shelf-Life', val: '24 Hours', impact: 'Critical Decay Zone' },
      { label: 'Destination Transit', val: '3.5 Hours (Metro)', impact: 'Safe Margin 20.5h' },
      { label: 'Destination Spot Price', val: '$2.40 / kg', impact: '+14% vs Wholesaler' },
      { label: 'Vehicle Payload Match', val: 'Reefer Zone 1 (6°C)', impact: 'Optimal Respiration' }
    ],
    reasoning: `Traditional FIFO dispatch scheduled this batch for Regional Wholesaler #3, located 11.5 hours away. Given ambient heat and respiration kinetics, arriving after 11.5h would cause 34% skin browning and severe soft-spot rot, triggering mandatory contract price penalties.<br><br>
    <strong>FreshRoute Optimization:</strong> Diverted this batch immediately to Metro Premium Mart (3.5 hours transit). Metro mart is experiencing an inventory deficit and guarantees instant same-day shelf placement at premium contract price, securing 100% saleable produce and eliminating $3,850 in avoidable waste.`,
    baselineOutcome: 'Baseline FIFO: Dispatched to Regional Terminal ➔ 34% Spoilage Loss ($3,850 lost)',
    freshrouteOutcome: 'FreshRoute: Allocated to Metro Mart ➔ 100% Sell-Through (+$3,850 preserved)'
  },
  'FR-814': {
    crop: 'Organic Strawberries',
    batchId: 'FR-814',
    confidence: '99.2% Optimal',
    factors: [
      { label: 'Remaining Shelf-Life', val: '18 Hours', impact: 'Extreme Perishability' },
      { label: 'Buyer Velocity', val: 'Quick-Commerce Hubs', impact: 'Avg Shelf Stay: 2.1 Hours' },
      { label: 'Dynamic Discount Applied', val: '-15% Flash Markdown', impact: 'Stimulates 2.8x Sales Velocity' },
      { label: 'Alternative Cost', val: '$4,600 Landfill Write-off', impact: '100% Capital Recovery' }
    ],
    reasoning: `Strawberries have rapid fungal pathogen expansion once initial firmness drops below threshold. Holding this inventory for tomorrow's scheduled wholesale delivery would guarantee complete spoilage.<br><br>
    <strong>FreshRoute Optimization:</strong> FreshRoute identified 3 nearby 15-minute quick-commerce dark stores with surging evening orders. By automatically authorizing a 15% dynamic clearance discount, 100% of the 1,800 kg stock is sold within 4 hours, converting a potential total loss into $5,120 profitable recovery.`,
    baselineOutcome: 'Baseline FIFO: Hold for standard wholesale drop ➔ 65% Dumped in Landfill',
    freshrouteOutcome: 'FreshRoute: 15% Dynamic Discount via Dark Stores ➔ Sold in 4 Hours ($4,600 saved)'
  },
  'FR-802': {
    crop: 'Roma Field Tomatoes',
    batchId: 'FR-802',
    confidence: '96.4% Optimal',
    factors: [
      { label: 'Remaining Shelf-Life', val: '42 Hours', impact: 'Stable Perishable' },
      { label: 'Ethylene Emission', val: 'High Climacteric', impact: 'Requires Isolation' },
      { label: 'Vehicle Loading', val: 'Reefer Zone 2 (12°C)', impact: '94% Truck Payload' },
      { label: 'Empty Miles Saved', val: '64 km Roundtrip', impact: '$410 Fuel Savings' }
    ],
    reasoning: `Tomatoes emit significant ethylene gas which accelerates yellowing and decay in sensitive leafy greens if co-loaded carelessly. Conventional dispatchers often dispatch separate half-empty trucks or mishandle compartment zones.<br><br>
    <strong>FreshRoute Optimization:</strong> FreshRoute calculated multi-compartment refrigerated trailer airflow, allocating the tomatoes to isolated Rear Zone 2 while packing crisp bell peppers in Forward Zone 1, achieving 94% cubic fill without biochemical cross-contamination.`,
    baselineOutcome: 'Baseline FIFO: Split un-optimized trucks ➔ High transport expense & ethylene risk',
    freshrouteOutcome: 'FreshRoute: Multi-temperature compartment consolidation ➔ $1,750 freight saved'
  },
  'FR-791': {
    crop: 'Crisp Bell Peppers',
    batchId: 'FR-791',
    confidence: '97.8% Optimal',
    factors: [
      { label: 'Remaining Shelf-Life', val: '56 Hours', impact: 'Extended Shelf Life' },
      { label: 'Spot Market Arbitrage', val: 'Wholesale Mandi B', impact: '+22% Premium Price' },
      { label: 'Transit Window', val: '4.8 Hours', impact: 'Minimal Moisture Loss' },
      { label: 'Backhaul Efficiency', val: 'Consolidated Route', impact: 'Zero Deadhead Distance' }
    ],
    reasoning: `With 56 hours of remaining vitality, this produce does not need desperate local fire-sales. Wholesale Mandi Terminal B is experiencing an acute supply shortage due to northern harvest rain.<br><br>
    <strong>FreshRoute Optimization:</strong> Dispatched to Wholesale Mandi B to capture the 22% spot market price arbitrage, while simultaneously matching with returning pallets from regional juice plants for optimal fuel economics.`,
    baselineOutcome: 'Baseline FIFO: Local dump at discounted contract rate ➔ Missed market premium',
    freshrouteOutcome: 'FreshRoute: Dispatched to supply-deficit terminal ➔ +$2,450 net revenue'
  }
};

function initXAIExplorer() {
  const navBtns = document.querySelectorAll('.xai-card-btn');
  const detailHeader = document.querySelector('.xai-detail-header h3');
  const confidencePill = document.querySelector('.xai-confidence-pill');
  const factorsGrid = document.querySelector('.xai-factors-grid');
  const reasoningText = document.querySelector('.xai-breakdown-text');
  const comparisonSnippet = document.querySelector('.xai-comparison-snippet');

  if (!navBtns.length || !detailHeader) return;

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      navBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const batchId = btn.dataset.batch;
      const data = xaiData[batchId];
      if (!data) return;

      // Update Header
      detailHeader.innerHTML = `Audit Trail: ${data.crop} <span style="font-size:0.85rem; color:#94A3B8; font-weight:normal;">(${data.batchId})</span>`;
      confidencePill.textContent = data.confidence;

      // Update Factors
      factorsGrid.innerHTML = data.factors.map(f => `
        <div class="xai-factor-item">
          <div class="xai-factor-label">${f.label}</div>
          <div class="xai-factor-value">${f.val}</div>
          <div class="xai-factor-impact">${f.impact}</div>
        </div>
      `).join('');

      // Update Reasoning
      reasoningText.innerHTML = `<strong>FreshRoute Explainability Engine:</strong><br>${data.reasoning}`;

      // Update Snippet
      comparisonSnippet.innerHTML = `
        <span>${data.baselineOutcome}</span>
        <span>${data.freshrouteOutcome}</span>
      `;
    });
  });
}

/* ===================================================================
   Interactive ROI & Spoilage Savings Calculator
   =================================================================== */
function initROICalculator() {
  const volumeSlider = document.getElementById('calcVolume');
  const spoilageSlider = document.getElementById('calcSpoilage');
  const priceSlider = document.getElementById('calcPrice');

  const volumeDisplay = document.getElementById('calcVolumeVal');
  const spoilageDisplay = document.getElementById('calcSpoilageVal');
  const priceDisplay = document.getElementById('calcPriceVal');

  const outSavedValue = document.getElementById('calcOutputSavedValue');
  const outFoodDiverted = document.getElementById('calcOutputFoodDiverted');
  const outCo2 = document.getElementById('calcOutputCo2');
  const outMarginGain = document.getElementById('calcOutputMarginGain');
  const outPayback = document.getElementById('calcOutputPayback');

  if (!volumeSlider) return;

  function recalculateROI() {
    const monthlyTons = parseFloat(volumeSlider.value);
    const spoilagePercent = parseFloat(spoilageSlider.value) / 100;
    const pricePerKg = parseFloat(priceSlider.value);
    const pricePerTon = pricePerKg * 1000;

    // Displays
    volumeDisplay.textContent = `${monthlyTons.toLocaleString()} Tons/mo`;
    spoilageDisplay.textContent = `${(spoilagePercent * 100).toFixed(0)}%`;
    priceDisplay.textContent = `$${pricePerKg.toFixed(2)} / kg`;

    // Monthly produce metrics
    const currentMonthlySpoiledTons = monthlyTons * spoilagePercent;
    // FreshRoute typically recovers 75% to 85% of preventable spoilage
    const spoilageRecoveryRate = 0.82;
    const tonsDivertedPerMonth = currentMonthlySpoiledTons * spoilageRecoveryRate;
    const tonsDivertedAnnual = tonsDivertedPerMonth * 12;

    const annualSavedDollarValue = tonsDivertedAnnual * pricePerTon;
    
    // Emissions: 1 ton food waste to landfill produces ~2.5 tons CO2e equivalent
    const co2SavedAnnual = tonsDivertedAnnual * 2.5;

    // Net margin increase factoring transport efficiency
    const annualTransportSavings = monthlyTons * 12 * 8.5; // ~$8.5 per ton consolidated logistics gain
    const totalNetGainAnnual = annualSavedDollarValue + annualTransportSavings;

    // Typical SaaS subscription cost vs ROI
    const estimatedCostAnnual = 24000 + (monthlyTons * 12 * 1.5);
    const paybackMonths = Math.max(0.4, (estimatedCostAnnual / totalNetGainAnnual) * 12).toFixed(1);

    if (outSavedValue) outSavedValue.textContent = `$${Math.round(totalNetGainAnnual).toLocaleString()}`;
    if (outFoodDiverted) outFoodDiverted.textContent = `${Math.round(tonsDivertedAnnual).toLocaleString()} Metric Tons`;
    if (outCo2) outCo2.textContent = `${Math.round(co2SavedAnnual).toLocaleString()} MT CO₂e`;
    if (outMarginGain) outMarginGain.textContent = `+${((totalNetGainAnnual / (monthlyTons * 12 * pricePerTon)) * 100).toFixed(1)}%`;
    if (outPayback) outPayback.textContent = `< ${Math.ceil(paybackMonths * 30)} Days`;
  }

  volumeSlider.addEventListener('input', recalculateROI);
  spoilageSlider.addEventListener('input', recalculateROI);
  priceSlider.addEventListener('input', recalculateROI);

  recalculateROI();
}

/* ===================================================================
   FAQ Accordion
   =================================================================== */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      faqItems.forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-answer').style.maxHeight = null;
      });

      // If clicked item wasn't open, open it
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* ===================================================================
   Modal: Demo Request Form
   =================================================================== */
function initModal() {
  const openButtons = document.querySelectorAll('[data-open-modal="demoModal"]');
  const modal = document.getElementById('demoModal');
  const closeBtn = document.getElementById('closeModalBtn');
  const demoForm = document.getElementById('demoRequestForm');

  if (!modal) return;

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  if (demoForm) {
    demoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = demoForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Scheduling Your Session...';
      submitBtn.disabled = true;

      setTimeout(() => {
        modal.classList.remove('active');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        demoForm.reset();
        showToast('Demo request received! Our cold chain specialist will contact you within 24 hours.');
      }, 1000);
    });
  }
}

/* ===================================================================
   Mobile Menu
   =================================================================== */
function initMobileMenu() {
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (!mobileBtn || !navLinks) return;

  mobileBtn.addEventListener('click', () => {
    if (navLinks.style.display === 'flex') {
      navLinks.style.display = 'none';
    } else {
      navLinks.style.display = 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '76px';
      navLinks.style.left = '0';
      navLinks.style.right = '0';
      navLinks.style.background = 'white';
      navLinks.style.padding = '1.5rem';
      navLinks.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
      navLinks.style.borderBottom = '1px solid #E2E8F0';
    }
  });
}

/* ===================================================================
   Toast Notification Helper
   =================================================================== */
function showToast(msg) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2.5">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>${msg}</span>
  `;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}
