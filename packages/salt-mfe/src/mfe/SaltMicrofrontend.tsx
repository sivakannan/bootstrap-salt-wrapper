import React, { useState } from 'react';
import {
  Button,
  Input,
  Card,
  Banner,
  BannerContent,
  StatusIndicator,
  Badge,
  StackLayout,
  FlexLayout,
  FormField,
  FormFieldLabel,
  FormFieldHelperText,
  Text,
  Checkbox,
  RadioButton,
  Switch,
  Dropdown,
  Option,
  Accordion,
  AccordionHeader,
  AccordionPanel,
  Pill,
  CircularProgress,
  LinearProgress,
  Spinner,
  Link,
  Table,
  TableContainer,
  THead,
  TBody,
  TR,
  TH,
  TD,
  Dialog,
  DialogHeader,
  DialogContent,
  DialogActions,
  DialogCloseButton,
  MultilineInput,
  Breadcrumbs,
  Breadcrumb,
  SegmentedButtonGroup,
  Divider,
  Tag,
  Tooltip,
  Rating,
  Slider,
} from '@salt-ds/core';
import {
  BankIcon,
  SearchIcon,
  RefreshIcon,
  DownloadIcon,
  CheckmarkIcon,
  FilterIcon,
} from '@salt-ds/icons';

export interface SaltMicrofrontendProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  compatMode?: boolean;
}

export const SaltMicrofrontend: React.FC<SaltMicrofrontendProps> = ({
  activeTab: controlledTab,
  onTabChange,
  compatMode = true,
}) => {
  // Form State
  const [inputValue, setInputValue] = useState('TXN-8842-EMEA');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [notes, setNotes] = useState('Automated clearing instruction for institutional portfolio balance.');
  const [isAgree, setIsAgree] = useState<boolean>(true);
  const [accountType, setAccountType] = useState<string>('corporate');
  const [sliderValue, setSliderValue] = useState<number>(75);
  const [ratingValue, setRatingValue] = useState<number>(4);

  // UI Navigation State
  const [internalTab, setInternalTab] = useState<string>('forms');
  const activeTab = controlledTab !== undefined ? controlledTab : internalTab;
  const handleTabChange = (tab: string) => {
    setInternalTab(tab);
    onTabChange?.(tab);
  };
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLiveSync, setIsLiveSync] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [submittedInfo, setSubmittedInfo] = useState<string>('');

  const currencies = [
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - British Pound' },
    { value: 'JPY', label: 'JPY - Japanese Yen' },
    { value: 'CHF', label: 'CHF - Swiss Franc' },
  ];

  const transactions = [
    { id: 'TX-9012', entity: 'JPMorgan Prime Custody', amount: '$1,450,000.00', ccy: 'USD', status: 'Settled', statusType: 'success' as const, risk: 'Tier 1' },
    { id: 'TX-9013', entity: 'Barclays Capital Liquidity', amount: '€820,000.00', ccy: 'EUR', status: 'Pending', statusType: 'info' as const, risk: 'Tier 2' },
    { id: 'TX-9014', entity: 'Nomura Securities Tokyo', amount: '¥340,000,000', ccy: 'JPY', status: 'Settled', statusType: 'success' as const, risk: 'Tier 1' },
    { id: 'TX-9015', entity: 'UBS Global Wealth Asset', amount: 'CHF 610,000.00', ccy: 'CHF', status: 'Review', statusType: 'warning' as const, risk: 'Tier 3' },
    { id: 'TX-9016', entity: 'Santander Commercial UK', amount: '£495,000.00', ccy: 'GBP', status: 'On Hold', statusType: 'error' as const, risk: 'Flagged' },
  ];

  return (
    <div style={{ padding: '1.25rem', boxSizing: 'border-box' }}>
      <StackLayout gap={2}>
        {/* Header with Avatar, Title, Badge, Pill and Live Switch */}
        <FlexLayout justify="space-between" align="center" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <FlexLayout gap={1.5} align="center">
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
                flexShrink: 0,
              }}
            >
              SD
            </div>
            <div>
              <Text style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0, display: 'block' }}>
                Enterprise Microfrontend Portal
              </Text>
              <Text style={{ fontSize: '0.85rem', opacity: 0.7, margin: 0 }}>
                Powered by @salt-ds/core &amp; @salt-ds/icons (Salt DS v1.71)
              </Text>
            </div>
          </FlexLayout>

          <FlexLayout gap={1} align="center">
            <Pill>v1.71.0</Pill>
            <Badge value="Live MFE" />
            <Tag variant="primary">Bridge Ready</Tag>
            <Switch
              label="Live Sync"
              checked={isLiveSync}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIsLiveSync(e.target.checked)}
            />
          </FlexLayout>
        </FlexLayout>

        {/* Informational Banner */}
        <Banner status="info">
          <BannerContent>
            <span>
              Showcasing Salt DS core components: <strong>Tabs, Tables, Dialogs, Sliders, Ratings, Dropdowns, Inputs, Accordions &amp; Progress</strong>.{' '}
              <Link href="https://www.saltdesignsystem.com" target="_blank" rel="noreferrer">
                Salt DS Docs
              </Link>
            </span>
          </BannerContent>
        </Banner>

        {/* Section Navigation using Salt SegmentedButtonGroup */}
        <div style={{ width: '100%', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          <SegmentedButtonGroup style={{ display: 'flex', width: '100%' }}>
            <Button
              style={{ flex: 1 }}
              variant={activeTab === 'forms' ? 'primary' : 'secondary'}
              onClick={() => handleTabChange('forms')}
            >
              1. Forms &amp; Inputs
            </Button>
            <Button
              style={{ flex: 1 }}
              variant={activeTab === 'table' ? 'primary' : 'secondary'}
              onClick={() => handleTabChange('table')}
            >
              2. Data Grid &amp; Table
            </Button>
            <Button
              style={{ flex: 1 }}
              variant={activeTab === 'overlays' ? 'primary' : 'secondary'}
              onClick={() => handleTabChange('overlays')}
            >
              3. Dialog &amp; Accordion
            </Button>
            <Button
              style={{ flex: 1 }}
              variant={activeTab === 'metrics' ? 'primary' : 'secondary'}
              onClick={() => handleTabChange('metrics')}
            >
              4. Metrics &amp; Health
            </Button>
          </SegmentedButtonGroup>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            TAB 1: FORMS & INPUTS
           ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'forms' && (
            <Card>
              <StackLayout gap={2}>
                <FlexLayout justify="space-between" align="center" style={{ flexWrap: 'wrap' }}>
                  <Text style={{ fontWeight: 600, fontSize: '1rem' }}>
                    Interactive Settlement Form
                  </Text>
                  <Text style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                    Adapts to Host Bootstrap Input &amp; Button styles
                  </Text>
                </FlexLayout>

                {/* Two Column Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                  {/* Salt Input */}
                  <FormField>
                    <FormFieldLabel>Reference Code</FormFieldLabel>
                    <Input
                      value={inputValue}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
                      placeholder="e.g. TXN-1029"
                    />
                    <FormFieldHelperText>Unique alphanumeric transaction code</FormFieldHelperText>
                  </FormField>

                  {/* Salt Dropdown */}
                  <FormField>
                    <FormFieldLabel>Settlement Currency</FormFieldLabel>
                    <Dropdown
                      value={selectedCurrency}
                      onSelectionChange={(_e, item) => setSelectedCurrency(item ? String(item) : 'USD')}
                    >
                      {currencies.map(c => (
                        <Option key={c.value} value={c.value}>
                          {c.label}
                        </Option>
                      ))}
                    </Dropdown>
                    <FormFieldHelperText>Select asset settlement denomination</FormFieldHelperText>
                  </FormField>
                </div>

                {/* MultilineInput (Textarea) */}
                <FormField>
                  <FormFieldLabel>Audit &amp; Compliance Remarks</FormFieldLabel>
                  <MultilineInput
                    rows={3}
                    value={notes}
                    onChange={(e: any) => setNotes(e.target.value)}
                    placeholder="Enter compliance memos or settlement directives..."
                  />
                  <FormFieldHelperText>Salt MultilineInput inherits host form-control textarea styling</FormFieldHelperText>
                </FormField>

                {/* Slider & Rating */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', padding: '0.5rem 0' }}>
                  <StackLayout gap={1}>
                    <FlexLayout justify="space-between">
                      <Text style={{ fontSize: '0.875rem', fontWeight: 600 }}>Allocation Limit</Text>
                      <Text style={{ fontSize: '0.875rem', opacity: 0.8 }}>${sliderValue * 10},000 USD</Text>
                    </FlexLayout>
                    <Slider
                      value={sliderValue}
                      min={10}
                      max={100}
                      step={5}
                      onChange={(_e, val) => setSliderValue(Number(val))}
                    />
                  </StackLayout>

                  <StackLayout gap={1}>
                    <Text style={{ fontSize: '0.875rem', fontWeight: 600 }}>Priority / Urgency Rating</Text>
                    <FlexLayout gap={1} align="center">
                      <Rating
                        value={ratingValue}
                        onChange={(_e, val) => setRatingValue(val)}
                      />
                      <Text style={{ fontSize: '0.85rem', opacity: 0.75 }}>({ratingValue} of 5 Stars)</Text>
                    </FlexLayout>
                  </StackLayout>
                </div>

                <Divider />

                {/* Selection Controls (Checkbox & Radio Buttons) */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
                  <StackLayout gap={1}>
                    <Text style={{ fontSize: '0.875rem', fontWeight: 600 }}>Account Custody Type</Text>
                    <FlexLayout gap={2} style={{ flexWrap: 'wrap' }}>
                      <RadioButton
                        label="Corporate"
                        value="corporate"
                        checked={accountType === 'corporate'}
                        onChange={() => setAccountType('corporate')}
                      />
                      <RadioButton
                        label="Institutional"
                        value="institutional"
                        checked={accountType === 'institutional'}
                        onChange={() => setAccountType('institutional')}
                      />
                      <RadioButton
                        label="Custodial Escrow"
                        value="custodial"
                        checked={accountType === 'custodial'}
                        onChange={() => setAccountType('custodial')}
                      />
                    </FlexLayout>
                  </StackLayout>

                  <StackLayout gap={1}>
                    <Text style={{ fontSize: '0.875rem', fontWeight: 600 }}>Legal Compliance</Text>
                    <Checkbox
                      label="Confirm FINRA &amp; MiFID II transaction validation"
                      checked={isAgree}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIsAgree(e.target.checked)}
                    />
                  </StackLayout>
                </div>

                <Divider />

                {/* Action Buttons with Icons */}
                <FlexLayout gap={1} align="center" style={{ flexWrap: 'wrap' }}>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setSubmittedInfo(`Executed: ${inputValue} (${selectedCurrency}) for $${sliderValue * 10},000 via ${accountType} channel`);
                    }}
                  >
                    <CheckmarkIcon style={{ marginRight: '0.4rem' }} />
                    Submit Settlement
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={() => {
                      setInputValue('TXN-' + Math.floor(1000 + Math.random() * 9000));
                      setNotes('');
                      setSubmittedInfo('');
                    }}
                  >
                    <RefreshIcon style={{ marginRight: '0.4rem' }} />
                    Reset Form
                  </Button>

                  <Button
                    variant="cta"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <BankIcon style={{ marginRight: '0.4rem' }} />
                    Wire Modal Verification
                  </Button>
                </FlexLayout>

                {submittedInfo && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(25, 135, 84, 0.12)',
                      border: '1px solid rgba(25, 135, 84, 0.3)',
                    }}
                  >
                    <StatusIndicator status="success" />
                    <Text style={{ fontSize: '0.9rem' }}>
                      <strong>Success:</strong> {submittedInfo}
                    </Text>
                  </div>
                )}
              </StackLayout>
            </Card>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            TAB 2: DATA GRID & TABLE
           ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'table' && (
            <Card>
              <StackLayout gap={2}>
                {/* Breadcrumbs */}
                <Breadcrumbs>
                  <Breadcrumb href="#">Global Treasury</Breadcrumb>
                  <Breadcrumb href="#">Settlement Batches</Breadcrumb>
                  <Breadcrumb aria-current="page">EMEA Ledger-2026</Breadcrumb>
                </Breadcrumbs>

                <FlexLayout justify="space-between" align="center" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
                  {/* Segmented Filter Buttons */}
                  <SegmentedButtonGroup>
                    <Button
                      variant={filterCategory === 'all' ? 'primary' : 'secondary'}
                      onClick={() => setFilterCategory('all')}
                    >
                      All Records (5)
                    </Button>
                    <Button
                      variant={filterCategory === 'settled' ? 'primary' : 'secondary'}
                      onClick={() => setFilterCategory('settled')}
                    >
                      Settled (2)
                    </Button>
                    <Button
                      variant={filterCategory === 'pending' ? 'primary' : 'secondary'}
                      onClick={() => setFilterCategory('pending')}
                    >
                      Active / Review (3)
                    </Button>
                  </SegmentedButtonGroup>

                  <FlexLayout gap={1} align="center" style={{ flexWrap: 'wrap' }}>
                    <div style={{ minWidth: '220px' }}>
                      <Input
                        value={searchQuery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                        startAdornment={<SearchIcon />}
                        placeholder="Filter counterparty..."
                      />
                    </div>
                    <Tooltip content="Export CSV Ledger">
                      <Button variant="secondary">
                        <DownloadIcon style={{ marginRight: '0.3rem' }} />
                        Export
                      </Button>
                    </Tooltip>
                    <Tooltip content="Refilter table dataset">
                      <Button variant="secondary">
                        <FilterIcon style={{ marginRight: '0.3rem' }} />
                        Filter
                      </Button>
                    </Tooltip>
                  </FlexLayout>
                </FlexLayout>

                {/* Salt DS Table */}
                <TableContainer>
                  <Table>
                    <THead>
                      <TR>
                        <TH>TX Code</TH>
                        <TH>Counterparty Entity</TH>
                        <TH>Gross Amount</TH>
                        <TH>CCY</TH>
                        <TH>Status</TH>
                        <TH>Risk Tier</TH>
                        <TH style={{ textAlign: 'right' }}>Actions</TH>
                      </TR>
                    </THead>
                    <TBody>
                      {transactions
                        .filter(tx => {
                          if (filterCategory === 'settled' && tx.status !== 'Settled') return false;
                          if (filterCategory === 'pending' && tx.status === 'Settled') return false;
                          if (searchQuery.trim()) {
                            const query = searchQuery.toLowerCase();
                            return tx.entity.toLowerCase().includes(query) || tx.id.toLowerCase().includes(query);
                          }
                          return true;
                        })
                        .map(tx => (
                          <TR key={tx.id}>
                            <TD>
                              <strong>{tx.id}</strong>
                            </TD>
                            <TD>{tx.entity}</TD>
                            <TD style={{ fontFamily: 'monospace', fontWeight: 600 }}>{tx.amount}</TD>
                            <TD>{tx.ccy}</TD>
                            <TD>
                              <FlexLayout gap={0.5} align="center">
                                <StatusIndicator status={tx.statusType} />
                                <span>{tx.status}</span>
                              </FlexLayout>
                            </TD>
                            <TD>
                              <Tag>{tx.risk}</Tag>
                            </TD>
                            <TD style={{ textAlign: 'right' }}>
                              <Tooltip content={`Inspect settlement advice for ${tx.id}`}>
                                <Button
                                  variant="secondary"
                                  data-size="small"
                                  onClick={() => setSubmittedInfo(`Selected ${tx.id} (${tx.entity})`)}
                                >
                                  Details
                                </Button>
                              </Tooltip>
                            </TD>
                          </TR>
                        ))}
                    </TBody>
                  </Table>
                </TableContainer>

                <FlexLayout justify="space-between" align="center" style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                  <span>Showing 5 of 5 entries</span>
                  <span>Clearing Window: RTGS-T0</span>
                </FlexLayout>
              </StackLayout>
            </Card>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            TAB 3: OVERLAYS & ACCORDIONS
           ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'overlays' && (
            <StackLayout gap={2}>
              {/* Modal Trigger Card */}
              <Card>
                <FlexLayout justify="space-between" align="center" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <Text style={{ fontWeight: 600, fontSize: '1rem', display: 'block' }}>
                      Interactive Salt Dialog / Modal Component
                    </Text>
                    <Text style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                      Launches an accessible floating overlay adopting Bootstrap modal geometry and backdrop
                    </Text>
                  </div>
                  <Button variant="primary" onClick={() => setIsDialogOpen(true)}>
                    Launch Settlement Dialog
                  </Button>
                </FlexLayout>
              </Card>

              {/* Accordions */}
              <StackLayout gap={1.5}>
                <Accordion value="sec1" style={{ width: '100%' }}>
                  <AccordionHeader>
                    Real-Time Gross Settlement (RTGS) SLA
                  </AccordionHeader>
                  <AccordionPanel>
                    <Text style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                      Transactions dispatched through this portal utilize Fedwire and TARGET2 clearing channels. Finality is guaranteed under Rule 15c3-3 within 120 seconds of authorization.
                    </Text>
                  </AccordionPanel>
                </Accordion>

                <Accordion value="sec2" style={{ width: '100%' }}>
                  <AccordionHeader>
                    Anti-Money Laundering (AML) &amp; Sanctions Screening
                  </AccordionHeader>
                  <AccordionPanel>
                    <Text style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                      Each wire is cross-referenced against OFAC, EU Consolidated Financial Sanctions, and UN lists using heuristic entity resolution before commitment to ledger.
                    </Text>
                  </AccordionPanel>
                </Accordion>

                <Accordion value="sec3" style={{ width: '100%' }}>
                  <AccordionHeader>
                    Cryptographic Signature Verification
                  </AccordionHeader>
                  <AccordionPanel>
                    <Text style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                      Microfrontend transactions are secured with ECDSA secp256k1 key pairs. The host application provides HMAC authentication headers via shared memory.
                    </Text>
                  </AccordionPanel>
                </Accordion>
              </StackLayout>
            </StackLayout>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            TAB 4: METRICS & SYSTEM HEALTH
           ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'metrics' && (
            <Card>
              <StackLayout gap={2}>
                <Text style={{ fontWeight: 600, fontSize: '1rem', display: 'block' }}>
                  System Health &amp; Pipeline Utilization
                </Text>

                {/* Linear Progress */}
                <StackLayout gap={0.5}>
                  <FlexLayout justify="space-between">
                    <Text style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                      Daily Clearing Limit Consumption ($38.5M / $50.0M)
                    </Text>
                    <Text style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--bs-primary, #0d6efd)' }}>
                      77%
                    </Text>
                  </FlexLayout>
                  <LinearProgress value={77} />
                </StackLayout>

                {/* Circular Progress & Spinner */}
                <FlexLayout gap={3} align="center" style={{ flexWrap: 'wrap', paddingTop: '0.5rem' }}>
                  <FlexLayout gap={1.5} align="center">
                    <CircularProgress value={84} />
                    <div>
                      <Text style={{ fontWeight: 600, display: 'block' }}>84% Capacity</Text>
                      <Text style={{ fontSize: '0.8rem', opacity: 0.7 }}>Worker Pool Utilization</Text>
                    </div>
                  </FlexLayout>

                  <FlexLayout gap={1.5} align="center">
                    <CircularProgress />
                    <div>
                      <Text style={{ fontWeight: 600, display: 'block' }}>Background Sync</Text>
                      <Text style={{ fontSize: '0.8rem', opacity: 0.7 }}>Polling remote ledger</Text>
                    </div>
                  </FlexLayout>

                  <FlexLayout gap={1.5} align="center">
                    <Spinner size="medium" />
                    <div>
                      <Text style={{ fontWeight: 600, display: 'block' }}>Active Heartbeat</Text>
                      <Text style={{ fontSize: '0.8rem', opacity: 0.7 }}>WebSocket ping 24ms</Text>
                    </div>
                  </FlexLayout>
                </FlexLayout>

                <Divider />

                {/* Status Indicator Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                  <div style={{ padding: '0.75rem', border: '1px solid rgba(128,128,128,0.2)', borderRadius: '4px' }}>
                    <FlexLayout gap={1} align="center">
                      <StatusIndicator status="success" />
                      <Text style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--salt-status-success-foreground, #198754)' }}>
                        Connected
                      </Text>
                    </FlexLayout>
                  </div>

                  <div style={{ padding: '0.75rem', border: '1px solid rgba(128,128,128,0.2)', borderRadius: '4px' }}>
                    <FlexLayout gap={1} align="center">
                      <StatusIndicator status="info" />
                      <Text style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--salt-status-info-foreground, #0dcaf0)' }}>
                        Syncing (12 tx/s)
                      </Text>
                    </FlexLayout>
                  </div>

                  <div style={{ padding: '0.75rem', border: '1px solid rgba(128,128,128,0.2)', borderRadius: '4px' }}>
                    <FlexLayout gap={1} align="center">
                      <StatusIndicator status="warning" />
                      <Text style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--salt-status-warning-foreground, #ffc107)' }}>
                        High Load
                      </Text>
                    </FlexLayout>
                  </div>

                  <div style={{ padding: '0.75rem', border: '1px solid rgba(128,128,128,0.2)', borderRadius: '4px' }}>
                    <FlexLayout gap={1} align="center">
                      <StatusIndicator status="error" />
                      <Text style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--salt-status-error-foreground, #dc3545)' }}>
                        Gateway Down
                      </Text>
                    </FlexLayout>
                  </div>
                </div>
              </StackLayout>
            </Card>
        )}
      </StackLayout>

      {/* Interactive Salt Dialog */}
      <Dialog
        className={compatMode ? "salt-bootstrap-compat" : undefined}
        open={isDialogOpen}
        onOpenChange={(open: boolean) => setIsDialogOpen(open)}
        size="medium"
      >
        <DialogHeader header="Confirm Settlement Authorization" />
        <DialogCloseButton onClick={() => setIsDialogOpen(false)} />
        <DialogContent>
          <StackLayout gap={1.5}>
            <Text>
              You are about to authorize an outbound wire transfer for reference <strong>{inputValue}</strong> in the amount of <strong>${sliderValue * 10},000 {selectedCurrency}</strong>.
            </Text>
            <div
              style={{
                padding: '0.75rem',
                backgroundColor: compatMode ? 'rgba(13, 110, 253, 0.08)' : 'var(--salt-container-primary-background)',
                borderRadius: '4px',
                border: compatMode ? '1px solid rgba(13, 110, 253, 0.2)' : '1px solid var(--salt-separable-primary-borderColor)',
              }}
            >
              <Text style={{ fontSize: '0.85rem' }}>
                ℹ️ <strong>Note:</strong> Clearing will execute immediately through the {accountType.toUpperCase()} custodial pipeline.
              </Text>
            </div>
          </StackLayout>
        </DialogContent>
        <DialogActions>
          <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setIsDialogOpen(false);
              setSubmittedInfo(`Wire ${inputValue} authorized for $${sliderValue * 10},000 ${selectedCurrency}`);
            }}
          >
            Authorize Transfer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SaltMicrofrontend;
