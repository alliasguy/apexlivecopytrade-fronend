import React, { useState } from 'react';
import { Button, Input, Card, CardHeader, Badge, Modal, Table, Tabs, FinancialFigure, ThemeToggle, toast } from '../../components/ui';
import EmptyStateCard from '../../components/common/EmptyStateCard';
import { TraderCardSkeleton, StatCardSkeleton } from '../../components/common/SkeletonLoader';
import { useTheme } from '../../context/ThemeContext';
import { FiMail } from 'react-icons/fi';
import './styleguide.css';

/**
 * Temporary internal reference page for the new design system - not linked
 * from the app nav, exists so the token/component work can be reviewed in
 * a real browser before it's rolled out across the rest of the app.
 */
export default function StyleGuide() {
  const { theme } = useTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const [tab, setTab] = useState('overview');

  const rows = [
    { id: 1, date: '2026-08-10', type: 'Deposit', amount: 500, status: 'completed' },
    { id: 2, date: '2026-08-12', type: 'Withdrawal', amount: -120, status: 'pending' },
  ];

  return (
    <div className="styleguide">
      <div className="styleguide__topbar">
        <h1>Design System Reference</h1>
        <div className="styleguide__row" style={{ marginBottom: 0 }}>
          <span>Current theme: {theme}</span>
          <ThemeToggle />
        </div>
      </div>

      <div className="styleguide__section">
        <h2>Buttons</h2>
        <div className="styleguide__row">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="primary" loading>Loading</Button>
          <Button variant="primary" disabled>Disabled</Button>
        </div>
        <div className="styleguide__row">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </div>

      <div className="styleguide__section">
        <h2>Inputs</h2>
        <div className="styleguide__row styleguide__row--stack">
          <Input label="Email" type="email" placeholder="name@mail.com" icon={<FiMail />} required />
          <Input label="With error" defaultValue="bad-value" error="This field is invalid" />
          <Input label="With helper text" helperText="We'll never share this." />
        </div>
      </div>

      <div className="styleguide__section">
        <h2>Badges</h2>
        <div className="styleguide__row">
          <Badge tone="success">Active</Badge>
          <Badge tone="error">Failed</Badge>
          <Badge tone="warning">Pending</Badge>
          <Badge tone="primary">New</Badge>
          <Badge tone="neutral">Draft</Badge>
        </div>
      </div>

      <div className="styleguide__section">
        <h2>Financial figures (AAA contrast)</h2>
        <div className="styleguide__row">
          <FinancialFigure value={1240.5} format="currency" size="lg" />
          <FinancialFigure value={-340.2} format="currency" size="lg" />
          <FinancialFigure value={12.4} format="percent" />
          <FinancialFigure value={-4.1} format="percent" />
          <FinancialFigure value={0} format="currency" />
        </div>
      </div>

      <div className="styleguide__section">
        <h2>Cards</h2>
        <div className="styleguide__row styleguide__row--stack">
          <Card padding="md">
            <CardHeader title="Portfolio value" subtitle="Updated 2 minutes ago" action={<Badge tone="success">Live</Badge>} />
            <FinancialFigure value={18420.33} format="currency" size="lg" />
          </Card>
        </div>
      </div>

      <div className="styleguide__section">
        <h2>Tabs</h2>
        <Tabs
          items={[
            { key: 'overview', label: 'Overview' },
            { key: 'trades', label: 'Trades' },
            { key: 'settings', label: 'Settings' },
          ]}
          activeKey={tab}
          onChange={setTab}
        />
        <p className="styleguide__tab-panel">Active tab: {tab}</p>
      </div>

      <div className="styleguide__section">
        <h2>Table (with empty + loading states)</h2>
        <Table
          columns={[
            { key: 'date', header: 'Date' },
            { key: 'type', header: 'Type' },
            { key: 'amount', header: 'Amount', align: 'right', render: (r) => <FinancialFigure value={r.amount} format="currency" size="sm" /> },
            { key: 'status', header: 'Status', render: (r) => <Badge tone={r.status === 'completed' ? 'success' : 'warning'}>{r.status}</Badge> },
          ]}
          rows={rows}
          getRowKey={(r) => r.id}
        />
        <div style={{ height: 16 }} />
        <Table columns={[{ key: 'a', header: 'Empty example' }]} rows={[]} />
        <div style={{ height: 16 }} />
        <Table columns={[{ key: 'a', header: 'Loading example' }, { key: 'b', header: 'Col 2' }]} rows={[]} loading />
      </div>

      <div className="styleguide__section">
        <h2>Empty state / skeletons</h2>
        <div className="styleguide__row styleguide__row--stack">
          <EmptyStateCard />
          <div className="styleguide__row">
            <TraderCardSkeleton />
            <StatCardSkeleton />
          </div>
        </div>
      </div>

      <div className="styleguide__section">
        <h2>Modal &amp; toasts</h2>
        <div className="styleguide__row">
          <Button onClick={() => setModalOpen(true)}>Open modal</Button>
          <Button variant="secondary" onClick={() => toast.success('Saved successfully')}>Success toast</Button>
          <Button variant="secondary" onClick={() => toast.error('Something went wrong')}>Error toast</Button>
        </div>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Confirm withdrawal"
          footer={
            <>
              <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => setModalOpen(false)}>Confirm</Button>
            </>
          }
        >
          <p>Are you sure you want to withdraw <FinancialFigure value={500} format="currency" size="sm" showSign={false} />?</p>
        </Modal>
      </div>
    </div>
  );
}
