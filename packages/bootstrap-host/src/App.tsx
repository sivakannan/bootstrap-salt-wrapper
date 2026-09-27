import React, { Suspense, useState } from 'react';

// Dynamically loaded remote micro-frontend from Port 3001 via Module Federation
const RemoteSaltWidget = React.lazy(() => import('salt_mfe/SaltWidget'));

export const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [accentColor, setAccentColor] = useState<string>('#0d6efd');

  // Side-by-side tab synchronization
  const [activeTab, setActiveTab] = useState<'forms' | 'table' | 'overlays' | 'metrics'>('forms');
  const [syncTabs, setSyncTabs] = useState<boolean>(true);

  // Host Form State (matches Salt MFE state)
  const [inputValue, setInputValue] = useState<string>('TXN-8842-EMEA');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [notes, setNotes] = useState<string>('Automated clearing instruction for institutional portfolio balance.');
  const [sliderValue, setSliderValue] = useState<number>(75);
  const [ratingValue, setRatingValue] = useState<number>(4);
  const [accountType, setAccountType] = useState<string>('corporate');
  const [isAgree, setIsAgree] = useState<boolean>(true);
  const [isLiveSync, setIsLiveSync] = useState<boolean>(true);
  const [submittedInfo, setSubmittedInfo] = useState<string>('');

  // Host Table State
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Host Modal & Accordion State
  const [bsModalOpen, setBsModalOpen] = useState<boolean>(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>('sec1');

  const currencies = [
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - British Pound' },
    { value: 'JPY', label: 'JPY - Japanese Yen' },
    { value: 'CHF', label: 'CHF - Swiss Franc' },
  ];

  const transactions = [
    { id: 'TX-9012', entity: 'JPMorgan Prime Custody', amount: '$1,450,000.00', ccy: 'USD', status: 'Settled', badgeClass: 'bg-success', risk: 'Tier 1' },
    { id: 'TX-9013', entity: 'Barclays Capital Liquidity', amount: '€820,000.00', ccy: 'EUR', status: 'Pending', badgeClass: 'bg-info text-dark', risk: 'Tier 2' },
    { id: 'TX-9014', entity: 'Nomura Securities Tokyo', amount: '¥340,000,000', ccy: 'JPY', status: 'Settled', badgeClass: 'bg-success', risk: 'Tier 1' },
    { id: 'TX-9015', entity: 'UBS Global Wealth Asset', amount: 'CHF 610,000.00', ccy: 'CHF', status: 'Review', badgeClass: 'bg-warning text-dark', risk: 'Tier 3' },
    { id: 'TX-9016', entity: 'Santander Commercial UK', amount: '£495,000.00', ccy: 'GBP', status: 'On Hold', badgeClass: 'bg-danger', risk: 'Flagged' },
  ];

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-bs-theme', nextTheme);
  };

  const handleAccentChange = (color: string) => {
    setAccentColor(color);
    document.documentElement.style.setProperty('--bs-primary', color);
    document.documentElement.style.setProperty('--bs-btn-bg', color);
  };

  return (
    <div className="min-vh-100 bg-body text-body pb-5">
      {/* Host App Navigation */}
      <nav className="navbar navbar-expand-lg border-bottom bg-body-tertiary mb-4 px-4 py-3 shadow-sm">
        <div className="container-fluid">
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-primary p-2 fs-6">Bootstrap Host (Port 3000)</span>
            <span className="navbar-brand fw-bold mb-0">Host App + Remote Salt DS MFE</span>
          </div>

          <div className="d-flex align-items-center gap-3 flex-wrap">
            {/* Sync Tabs Switch */}
            <div className="form-check form-switch me-2 mb-0">
              <input
                className="form-check-input"
                type="checkbox"
                id="syncTabsCheck"
                checked={syncTabs}
                onChange={(e) => setSyncTabs(e.target.checked)}
              />
              <label className="form-check-label small fw-semibold" htmlFor="syncTabsCheck">
                🔗 Sync Side-by-Side Tabs
              </label>
            </div>

            {/* Theme Color Selector */}
            <div className="d-flex align-items-center gap-2">
              <label className="small text-secondary mb-0">Theme Color:</label>
              <div className="btn-group btn-group-sm">
                <button
                  type="button"
                  className={`btn ${accentColor === '#0d6efd' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handleAccentChange('#0d6efd')}
                >
                  Blue
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  style={{
                    borderColor: '#6f42c1',
                    color: accentColor === '#6f42c1' ? '#fff' : '#6f42c1',
                    backgroundColor: accentColor === '#6f42c1' ? '#6f42c1' : 'transparent',
                  }}
                  onClick={() => handleAccentChange('#6f42c1')}
                >
                  Purple
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  style={{
                    borderColor: '#fd7e14',
                    color: accentColor === '#fd7e14' ? '#fff' : '#fd7e14',
                    backgroundColor: accentColor === '#fd7e14' ? '#fd7e14' : 'transparent',
                  }}
                  onClick={() => handleAccentChange('#fd7e14')}
                >
                  Orange
                </button>
              </div>
            </div>

            {/* Light / Dark Mode Toggle */}
            <button
              className="btn btn-outline-secondary d-flex align-items-center gap-2"
              onClick={toggleTheme}
            >
              <span>{theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="container-fluid px-4">
        {/* Architecture Notice */}
        <div className="alert alert-info border shadow-sm mb-4">
          <h5 className="alert-heading fw-bold mb-1">Side-by-Side Visual Parity Comparison</h5>
          <p className="mb-0">
            Compare <strong>🅰️ Native Bootstrap 5 components</strong> on the left directly against <strong>🅱️ Remote Salt DS Microfrontend components</strong> on the right.
            Both columns expose the exact same 4 sections: <em>Forms, Data Table, Dialog &amp; Accordion, and Metrics</em>.
          </p>
        </div>

        {/* 1. Host Native Elements vs Remote MFE Controls */}
        <div className="row g-4 mb-4">
          {/* =========================================================================
              LEFT COLUMN: 🅰️ Host Application (Native Bootstrap 5)
             ========================================================================= */}
          <div className="col-lg-6">
            <div className="card h-100 shadow-sm border">
              <div className="card-header bg-body-tertiary fw-bold d-flex justify-content-between align-items-center">
                <span>🅰️ Host Application (Native Bootstrap 5)</span>
                <span className="badge bg-secondary">Host Scope</span>
              </div>
              <div className="card-body p-3">
                {/* Header matching Salt DS MFE */}
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--bs-primary, #0d6efd)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      }}
                    >
                      BS
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0">Native Bootstrap Portal</h6>
                      <small className="text-secondary">Rendered with pure Bootstrap 5.3.3 utilities</small>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-light text-dark border">v5.3.3</span>
                    <span className="badge bg-primary">Host Native</span>
                    <span className="badge bg-secondary">Zero Salt</span>
                    <div className="form-check form-switch mb-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="bsLiveSync"
                        checked={isLiveSync}
                        onChange={(e) => setIsLiveSync(e.target.checked)}
                      />
                      <label className="form-check-label small" htmlFor="bsLiveSync">Live Sync</label>
                    </div>
                  </div>
                </div>

                {/* Banner */}
                <div className="alert alert-info py-2 px-3 small d-flex align-items-center gap-2 mb-3">
                  <span>ℹ️</span>
                  <span>
                    Showcasing native Bootstrap 5 components: <strong>Navs, Tables, Modals, Range Sliders, Forms, Accordions &amp; Progress</strong>.
                  </span>
                </div>

                {/* Section Navigation using Bootstrap Buttons */}
                <div className="btn-group w-100 mb-3" role="group">
                  <button
                    type="button"
                    className={`btn btn-sm ${activeTab === 'forms' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setActiveTab('forms')}
                  >
                    1. Forms &amp; Inputs
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${activeTab === 'table' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setActiveTab('table')}
                  >
                    2. Data Grid &amp; Table
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${activeTab === 'overlays' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setActiveTab('overlays')}
                  >
                    3. Dialog &amp; Accordion
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${activeTab === 'metrics' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setActiveTab('metrics')}
                  >
                    4. Metrics &amp; Health
                  </button>
                </div>

                {/* -------------------------------------------------------------
                    TAB 1: FORMS & INPUTS (BOOTSTRAP)
                   ------------------------------------------------------------- */}
                {activeTab === 'forms' && (
                  <div className="card p-3 border">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="fw-bold mb-0">Interactive Settlement Form</h6>
                      <small className="text-secondary">Native Bootstrap Form Controls</small>
                    </div>

                    {/* Inputs Row */}
                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Reference Code</label>
                        <input
                          type="text"
                          className="form-control"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder="e.g. TXN-1029"
                        />
                        <div className="form-text small">Unique alphanumeric transaction code</div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Settlement Currency</label>
                        <select
                          className="form-select"
                          value={selectedCurrency}
                          onChange={(e) => setSelectedCurrency(e.target.value)}
                        >
                          {currencies.map(c => (
                            <option key={c.value} value={c.value}>{c.label}</option>
                          ))}
                        </select>
                        <div className="form-text small">Select asset settlement denomination</div>
                      </div>
                    </div>

                    {/* Textarea */}
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Audit &amp; Compliance Remarks</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Enter compliance memos or settlement directives..."
                      />
                      <div className="form-text small">Native Bootstrap textarea with padding and border glow</div>
                    </div>

                    {/* Range Slider & Rating */}
                    <div className="row g-3 mb-3 align-items-center">
                      <div className="col-md-6">
                        <div className="d-flex justify-content-between small fw-semibold mb-1">
                          <span>Allocation Limit</span>
                          <span className="text-secondary">${sliderValue * 10},000 USD</span>
                        </div>
                        <input
                          type="range"
                          className="form-range"
                          min={10}
                          max={100}
                          step={5}
                          value={sliderValue}
                          onChange={(e) => setSliderValue(Number(e.target.value))}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-semibold mb-1">Priority / Urgency Rating</label>
                        <div className="d-flex align-items-center gap-2">
                          <span style={{ fontSize: '1.25rem', color: '#ffc107', letterSpacing: '2px', cursor: 'pointer' }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                onClick={() => setRatingValue(star)}
                                style={{ opacity: star <= ratingValue ? 1 : 0.3 }}
                              >
                                ★
                              </span>
                            ))}
                          </span>
                          <small className="text-secondary">({ratingValue} of 5 Stars)</small>
                        </div>
                      </div>
                    </div>

                    <hr className="my-3 opacity-25" />

                    {/* Radio & Checkbox */}
                    <div className="d-flex flex-wrap gap-4 mb-3">
                      <div>
                        <div className="small fw-semibold mb-1">Account Custody Type</div>
                        <div className="d-flex flex-wrap gap-3">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="bsCustody"
                              id="bsCustody1"
                              checked={accountType === 'corporate'}
                              onChange={() => setAccountType('corporate')}
                            />
                            <label className="form-check-label small" htmlFor="bsCustody1">Corporate</label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="bsCustody"
                              id="bsCustody2"
                              checked={accountType === 'institutional'}
                              onChange={() => setAccountType('institutional')}
                            />
                            <label className="form-check-label small" htmlFor="bsCustody2">Institutional</label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="bsCustody"
                              id="bsCustody3"
                              checked={accountType === 'custodial'}
                              onChange={() => setAccountType('custodial')}
                            />
                            <label className="form-check-label small" htmlFor="bsCustody3">Custodial Escrow</label>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="small fw-semibold mb-1">Legal Compliance</div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="bsAgree"
                            checked={isAgree}
                            onChange={(e) => setIsAgree(e.target.checked)}
                          />
                          <label className="form-check-label small" htmlFor="bsAgree">
                            Confirm FINRA &amp; MiFID II transaction validation
                          </label>
                        </div>
                      </div>
                    </div>

                    <hr className="my-3 opacity-25" />

                    {/* Action Buttons */}
                    <div className="d-flex flex-wrap gap-2">
                      <button
                        className="btn btn-primary"
                        onClick={() => setSubmittedInfo(`Executed: ${inputValue} (${selectedCurrency}) for $${sliderValue * 10},000 via ${accountType} channel`)}
                      >
                        ✓ Submit Settlement
                      </button>
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => {
                          setInputValue('TXN-' + Math.floor(1000 + Math.random() * 9000));
                          setNotes('');
                          setSubmittedInfo('');
                        }}
                      >
                        ↻ Reset Form
                      </button>
                      <button
                        className="btn btn-success"
                        onClick={() => setBsModalOpen(true)}
                      >
                        🏦 Wire Modal Verification
                      </button>
                    </div>

                    {submittedInfo && (
                      <div className="alert alert-success d-flex align-items-center gap-2 mt-3 py-2 px-3 small mb-0">
                        <span>✓</span>
                        <span><strong>Success:</strong> {submittedInfo}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* -------------------------------------------------------------
                    TAB 2: DATA GRID & TABLE (BOOTSTRAP)
                   ------------------------------------------------------------- */}
                {activeTab === 'table' && (
                  <div className="card p-3 border">
                    {/* Breadcrumbs */}
                    <nav aria-label="breadcrumb">
                      <ol className="breadcrumb small mb-3">
                        <li className="breadcrumb-item"><a href="#breadcrumb">Global Treasury</a></li>
                        <li className="breadcrumb-item"><a href="#breadcrumb">Settlement Batches</a></li>
                        <li className="breadcrumb-item active" aria-current="page">EMEA Ledger-2026</li>
                      </ol>
                    </nav>

                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                      {/* Segmented Filter Buttons */}
                      <div className="btn-group btn-group-sm" role="group">
                        <button
                          type="button"
                          className={`btn ${filterCategory === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => setFilterCategory('all')}
                        >
                          All Records (5)
                        </button>
                        <button
                          type="button"
                          className={`btn ${filterCategory === 'settled' ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => setFilterCategory('settled')}
                        >
                          Settled (2)
                        </button>
                        <button
                          type="button"
                          className={`btn ${filterCategory === 'pending' ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => setFilterCategory('pending')}
                        >
                          Active / Review (3)
                        </button>
                      </div>

                      {/* Search Filter */}
                      <div className="d-flex gap-2 align-items-center flex-wrap">
                        <div style={{ minWidth: '200px' }}>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Filter counterparty..."
                          />
                        </div>
                        <button className="btn btn-outline-secondary btn-sm">⬇ Export</button>
                        <button className="btn btn-outline-secondary btn-sm">⚙ Filter</button>
                      </div>
                    </div>

                    {/* Bootstrap Table */}
                    <div className="table-responsive border rounded">
                      <table className="table table-hover align-middle mb-0 small">
                        <thead className="table-light">
                          <tr>
                            <th>TX Code</th>
                            <th>Counterparty Entity</th>
                            <th>Gross Amount</th>
                            <th>CCY</th>
                            <th>Status</th>
                            <th>Risk Tier</th>
                            <th className="text-end">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactions
                            .filter(tx => {
                              if (filterCategory === 'settled' && tx.status !== 'Settled') return false;
                              if (filterCategory === 'pending' && tx.status === 'Settled') return false;
                              if (searchQuery.trim()) {
                                const q = searchQuery.toLowerCase();
                                return tx.entity.toLowerCase().includes(q) || tx.id.toLowerCase().includes(q);
                              }
                              return true;
                            })
                            .map(tx => (
                              <tr key={tx.id}>
                                <td><strong>{tx.id}</strong></td>
                                <td>{tx.entity}</td>
                                <td className="font-monospace fw-semibold">{tx.amount}</td>
                                <td>{tx.ccy}</td>
                                <td>
                                  <span className={`badge ${tx.badgeClass}`}>
                                    {tx.status}
                                  </span>
                                </td>
                                <td>
                                  <span className="badge bg-light text-dark border">{tx.risk}</span>
                                </td>
                                <td className="text-end">
                                  <button
                                    className="btn btn-outline-secondary btn-sm py-0 px-2"
                                    onClick={() => setSubmittedInfo(`Selected ${tx.id} (${tx.entity})`)}
                                  >
                                    Details
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="d-flex justify-content-between small text-secondary mt-2">
                      <span>Showing 5 of 5 entries</span>
                      <span>Clearing Window: RTGS-T0</span>
                    </div>
                  </div>
                )}

                {/* -------------------------------------------------------------
                    TAB 3: DIALOG & ACCORDIONS (BOOTSTRAP)
                   ------------------------------------------------------------- */}
                {activeTab === 'overlays' && (
                  <div className="d-flex flex-column gap-3">
                    {/* Modal Trigger Card */}
                    <div className="card p-3 border">
                      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <div>
                          <h6 className="fw-bold mb-0">Interactive Bootstrap Modal Component</h6>
                          <small className="text-secondary">
                            Launches an accessible floating overlay adopting Bootstrap modal geometry and backdrop
                          </small>
                        </div>
                        <button
                          className="btn btn-primary"
                          onClick={() => setBsModalOpen(true)}
                        >
                          Launch Settlement Dialog
                        </button>
                      </div>
                    </div>

                    {/* Bootstrap Accordions */}
                    <div className="accordion" id="bsAccordionExample">
                      {/* Accordion 1 */}
                      <div className="accordion-item">
                        <h2 className="accordion-header">
                          <button
                            className={`accordion-button ${openAccordion === 'sec1' ? '' : 'collapsed'}`}
                            type="button"
                            onClick={() => setOpenAccordion(openAccordion === 'sec1' ? null : 'sec1')}
                          >
                            Real-Time Gross Settlement (RTGS) SLA
                          </button>
                        </h2>
                        {openAccordion === 'sec1' && (
                          <div className="accordion-body small text-secondary">
                            Transactions dispatched through this portal utilize Fedwire and TARGET2 clearing channels. Finality is guaranteed under Rule 15c3-3 within 120 seconds of authorization.
                          </div>
                        )}
                      </div>

                      {/* Accordion 2 */}
                      <div className="accordion-item">
                        <h2 className="accordion-header">
                          <button
                            className={`accordion-button ${openAccordion === 'sec2' ? '' : 'collapsed'}`}
                            type="button"
                            onClick={() => setOpenAccordion(openAccordion === 'sec2' ? null : 'sec2')}
                          >
                            Anti-Money Laundering (AML) &amp; Sanctions Screening
                          </button>
                        </h2>
                        {openAccordion === 'sec2' && (
                          <div className="accordion-body small text-secondary">
                            Each wire is cross-referenced against OFAC, EU Consolidated Financial Sanctions, and UN lists using heuristic entity resolution before commitment to ledger.
                          </div>
                        )}
                      </div>

                      {/* Accordion 3 */}
                      <div className="accordion-item">
                        <h2 className="accordion-header">
                          <button
                            className={`accordion-button ${openAccordion === 'sec3' ? '' : 'collapsed'}`}
                            type="button"
                            onClick={() => setOpenAccordion(openAccordion === 'sec3' ? null : 'sec3')}
                          >
                            Cryptographic Signature Verification
                          </button>
                        </h2>
                        {openAccordion === 'sec3' && (
                          <div className="accordion-body small text-secondary">
                            Microfrontend transactions are secured with ECDSA secp256k1 key pairs. The host application provides HMAC authentication headers via shared memory.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* -------------------------------------------------------------
                    TAB 4: METRICS & HEALTH (BOOTSTRAP)
                   ------------------------------------------------------------- */}
                {activeTab === 'metrics' && (
                  <div className="card p-3 border">
                    <h6 className="fw-bold mb-3">System Health &amp; Pipeline Utilization</h6>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="d-flex justify-content-between small fw-semibold mb-1">
                        <span>Daily Clearing Limit Consumption ($38.5M / $50.0M)</span>
                        <span className="text-primary fw-bold">77%</span>
                      </div>
                      <div className="progress" style={{ height: '0.75rem' }}>
                        <div
                          className="progress-bar bg-primary"
                          role="progressbar"
                          style={{ width: '77%' }}
                        ></div>
                      </div>
                    </div>

                    {/* Spinners & Utilization Row */}
                    <div className="d-flex align-items-center gap-4 flex-wrap py-2 mb-3">
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="border border-3 border-primary rounded-circle d-flex align-items-center justify-content-center fw-bold"
                          style={{ width: '56px', height: '56px', fontSize: '0.85rem' }}
                        >
                          84%
                        </div>
                        <div>
                          <div className="fw-semibold small">84% Capacity</div>
                          <div className="text-secondary small">Worker Pool Utilization</div>
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        <div className="spinner-border text-secondary" role="status" style={{ width: '2rem', height: '2rem' }}>
                          <span className="visually-hidden">Syncing...</span>
                        </div>
                        <div>
                          <div className="fw-semibold small">Background Sync</div>
                          <div className="text-secondary small">Polling remote ledger</div>
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        <div className="spinner-grow text-primary" role="status" style={{ width: '1.75rem', height: '1.75rem' }}>
                          <span className="visually-hidden">Heartbeat...</span>
                        </div>
                        <div>
                          <div className="fw-semibold small">Active Heartbeat</div>
                          <div className="text-secondary small">WebSocket ping 24ms</div>
                        </div>
                      </div>
                    </div>

                    <hr className="my-2 opacity-25" />

                    {/* Status Grid */}
                    <div className="row g-2 pt-2">
                      <div className="col-sm-6 col-md-3">
                        <div className="p-2 border rounded d-flex align-items-center gap-2">
                          <span className="badge bg-success rounded-circle p-1">●</span>
                          <span className="small fw-semibold text-success">Connected</span>
                        </div>
                      </div>
                      <div className="col-sm-6 col-md-3">
                        <div className="p-2 border rounded d-flex align-items-center gap-2">
                          <span className="badge bg-info text-dark rounded-circle p-1">●</span>
                          <span className="small fw-semibold text-info">Syncing (12 tx/s)</span>
                        </div>
                      </div>
                      <div className="col-sm-6 col-md-3">
                        <div className="p-2 border rounded d-flex align-items-center gap-2">
                          <span className="badge bg-warning text-dark rounded-circle p-1">●</span>
                          <span className="small fw-semibold text-warning">High Load</span>
                        </div>
                      </div>
                      <div className="col-sm-6 col-md-3">
                        <div className="p-2 border rounded d-flex align-items-center gap-2">
                          <span className="badge bg-danger rounded-circle p-1">●</span>
                          <span className="small fw-semibold text-danger">Gateway Down</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* =========================================================================
              RIGHT COLUMN: 🅱️ Remote Salt MFE (Fed from :3001)
             ========================================================================= */}
          <div className="col-lg-6">
            <div className="card h-100 shadow-sm border border-primary border-opacity-50">
              <div className="card-header bg-body-tertiary fw-bold d-flex justify-content-between align-items-center">
                <span>🅱️ Remote Salt MFE (Fed from :3001)</span>
                <span className="badge bg-success">Live Remote Entry</span>
              </div>
              <div className="card-body p-0">
                <Suspense
                  fallback={
                    <div className="p-4 text-center">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading Remote Salt MFE...</span>
                      </div>
                      <p className="mt-2 text-secondary small">Fetching remote bundle from http://localhost:3001...</p>
                    </div>
                  }
                >
                  <RemoteSaltWidget
                    colorMode="auto"
                    density="medium"
                    activeTab={syncTabs ? activeTab : undefined}
                    onTabChange={(t: string) => {
                      if (syncTabs) {
                        setActiveTab(t as any);
                      }
                    }}
                  />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Host Native Bootstrap Modal */}
      {bsModalOpen && (
        <div
          className="modal show d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Confirm Settlement Authorization</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setBsModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  You are about to authorize an outbound wire transfer for reference <strong>{inputValue}</strong> in the amount of <strong>${sliderValue * 10},000 {selectedCurrency}</strong>.
                </p>
                <div className="alert alert-info py-2 px-3 small mb-0">
                  ℹ️ <strong>Note:</strong> Clearing will execute immediately through the {accountType.toUpperCase()} custodial pipeline.
                </div>
              </div>
              <div className="modal-footer border-top">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setBsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setBsModalOpen(false);
                    setSubmittedInfo(`Wire ${inputValue} authorized for $${sliderValue * 10},000 ${selectedCurrency}`);
                  }}
                >
                  Authorize Transfer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
