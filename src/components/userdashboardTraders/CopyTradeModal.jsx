import React, { useState } from 'react';
import { IoWarningOutline, IoShieldCheckmarkOutline } from 'react-icons/io5';
import { FaLock, FaChartLine } from 'react-icons/fa';
import Swal from 'sweetalert2';
import Modal from '../ui/Modal/Modal';
import Button from '../ui/Button/Button';

const CopyTradeModal = ({ trader, userData, onClose, onConfirmCopy, isSubmitting }) => {
  const userBalance = Number(userData?.capital) || 0;
  const minCapital = Number(trader?.minimumcapital) || 100;

  const [allocationAmount, setAllocationAmount] = useState(
    Math.max(minCapital, userBalance > 0 ? userBalance : minCapital)
  );
  const [stopLoss, setStopLoss] = useState(15);
  const [copyMode, setCopyMode] = useState('proportional');

  const hasEnoughCapital = userBalance >= minCapital;

  const handleQuickPercent = (percent) => {
    if (userBalance > 0) {
      const calculated = Math.round((userBalance * percent) / 100);
      setAllocationAmount(Math.max(calculated, minCapital));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!hasEnoughCapital) {
      Swal.fire({
        icon: 'error',
        title: 'Insufficient Balance',
        text: `Minimum capital required to copy ${trader.firstname} is $${minCapital.toLocaleString()} USD.`,
        background: '#121624',
        color: '#ffffff',
        confirmButtonColor: '#2f6aff'
      });
      return;
    }

    if (allocationAmount < minCapital) {
      Swal.fire({
        icon: 'warning',
        title: 'Minimum Capital Required',
        text: `Your copy allocation must be at least $${minCapital.toLocaleString()} USD.`,
        background: '#121624',
        color: '#ffffff',
        confirmButtonColor: '#2f6aff'
      });
      return;
    }

    onConfirmCopy(trader, { allocationAmount, stopLoss, copyMode });
  };

  if (!trader) return null;

  return (
    <Modal
      open={Boolean(trader)}
      onClose={onClose}
      title={`Copy Trader — ${trader.firstname} ${trader.lastname}`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="copy-modal-body">
        <div className="copy-modal-trader-info" style={{ marginBottom: 16 }}>
          <img
            src={trader.traderImage || '/preview.gif'}
            alt={`${trader.firstname} ${trader.lastname}`}
            className="copy-modal-avatar"
          />
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{trader.firstname} {trader.lastname}</h3>
            <p className="copy-modal-sub" style={{ fontSize: '0.85rem' }}>
              Win Rate: <span className="highlight-text">{trader.profitrate}%</span> · Followers: {trader.followers || '1.2k'}
            </p>
          </div>
        </div>

        {/* Balance & Capital Check Banner */}
        <div className={`modal-balance-banner ${hasEnoughCapital ? 'valid' : 'invalid'}`}>
          <div className="balance-info-left">
            <span className="balance-label">Unused Deposit Balance</span>
            <span className="balance-val">${userBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD</span>
          </div>
          <div className="balance-info-right">
            <span className="balance-label">Required Min Capital</span>
            <span className="balance-val min">${minCapital.toLocaleString()} USD</span>
          </div>
        </div>

        {!hasEnoughCapital && (
          <div className="modal-warning-box">
            <IoWarningOutline className="warning-icon" />
            <span>Your balance is below the minimum required capital (${minCapital}). Please fund your account to start copying.</span>
          </div>
        )}

        {/* Capital Allocation Input */}
        <div className="modal-input-group">
          <div className="input-label-row">
            <label htmlFor="allocation">Copy Investment Amount (USD)</label>
            <span className="min-hint">Min: ${minCapital}</span>
          </div>
          <div className="input-with-symbol">
            <span className="currency-prefix">$</span>
            <input
              id="allocation"
              type="number"
              min={minCapital}
              step="10"
              value={allocationAmount}
              onChange={(e) => setAllocationAmount(Number(e.target.value))}
              placeholder={`${minCapital}`}
              className="modal-number-input"
            />
          </div>
          <div className="quick-percent-chips">
            {[25, 50, 75, 100].map((pct) => (
              <button
                type="button"
                key={pct}
                className="percent-chip"
                onClick={() => handleQuickPercent(pct)}
              >
                {pct}% Balance
              </button>
            ))}
          </div>
        </div>

        {/* Stop Loss Protection Slider */}
        <div className="modal-input-group">
          <div className="input-label-row">
            <label htmlFor="stoploss">Stop Loss Protection</label>
            <span className="stoploss-val">{stopLoss}% Max Drawdown</span>
          </div>
          <input
            id="stoploss"
            type="range"
            min="5"
            max="40"
            step="1"
            value={stopLoss}
            onChange={(e) => setStopLoss(Number(e.target.value))}
            className="modal-slider"
          />
          <p className="slider-hint">
            Automatically stops copying if total portfolio drawdown reaches {stopLoss}%.
          </p>
        </div>

        {/* Copy Mode Selector */}
        <div className="modal-input-group">
          <label className="input-label">Execution Strategy</label>
          <div className="execution-mode-grid">
            <div
              className={`mode-card ${copyMode === 'proportional' ? 'active' : ''}`}
              onClick={() => setCopyMode('proportional')}
            >
              <div className="mode-card-title">
                <FaChartLine />
                <span>Proportional Ratio</span>
              </div>
              <p>Positions scale automatically based on allocated capital.</p>
            </div>
            <div
              className={`mode-card ${copyMode === 'fixed' ? 'active' : ''}`}
              onClick={() => setCopyMode('fixed')}
            >
              <div className="mode-card-title">
                <FaLock />
                <span>Fixed Mirroring</span>
              </div>
              <p>Trades mirror exact lot sizes executed by lead trader.</p>
            </div>
          </div>
        </div>

        {/* Safety & Action Footer */}
        <div className="modal-footer">
          <div className="safety-guarantee">
            <IoShieldCheckmarkOutline />
            <span>Capital protection & real-time order routing enabled</span>
          </div>

          <div className="modal-action-buttons">
            <Button variant="ghost" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!hasEnoughCapital || isSubmitting}
              loading={isSubmitting}
            >
              Start Copy Trading
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default CopyTradeModal;
