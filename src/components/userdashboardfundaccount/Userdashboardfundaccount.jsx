import React from 'react'
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi'
import './userdashboardfundaccount.css'
import Checkout from '../Checkout';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { Button, Card, Input, Modal, toast } from '../ui'

const depositOptions = [
  { id: 1, min: 1, max: 1000, image: '/btc.png', method: 'BTC', wallet: 'bc1q9f5z4vf660mjkr3977mny0h455l436mx3uxedn' },
  { id: 2, min: 1, max: 1000, image: '/etherium.png', method: 'ETH', wallet: '0xdD1b82C7cb95CB5Df487F2a2F7533a4CEcffa431' },
  { id: 3, min: 1, max: 1000, image: '/tron.png', method: 'USDT (TRC20 tron) ', wallet: 'TL2L8VwLKi9kRbE2GwjaDDX6G8zQQdDBC8' },
  { id: 24, min: 1, max: 1000, image: '/tron.png', method: 'TRON (TRX) ', wallet: 'TL2L8VwLKi9kRbE2GwjaDDX6G8zQQdDBC8' },
  { id: 23, min: 1, max: 1000, image: '/tron.png', method: 'USDT (ETH) ', wallet: '0xdD1b82C7cb95CB5Df487F2a2F7533a4CEcffa431' },
  { id: 4, min: 1, max: 1000, image: '/usdc-coin.png', method: 'USDC (ETH) ', wallet: '0xdD1b82C7cb95CB5Df487F2a2F7533a4CEcffa431' },
  { id: 12, min: 1, max: 1000, image: '/usdc-coin.png', method: 'USDC (Base Mainnet) ', wallet: '0xdD1b82C7cb95CB5Df487F2a2F7533a4CEcffa431' },
  { id: 13, min: 1, max: 1000, image: '/usdc-coin.png', method: 'USDC (SOL) ', wallet: '3yLwFT1ENdxdSEYBWpq34u1W9cNfNXs2FU1pJM5u5muf' },
  { id: 5, min: 1, max: 1000, image: '/solana.png', method: 'Solana (SOL) ', wallet: '3yLwFT1ENdxdSEYBWpq34u1W9cNfNXs2FU1pJM5u5muf' },
  { id: 6, min: 1, max: 1000, image: '/dogecoin-logo.png', method: 'Dogecoin ', wallet: 'DRrygJJSHqLdRwPBfgEE1AQW3wLGvoDHxE' },
  { id: 7, min: 1, max: 1000, image: '/xrp-icon.png', method: 'XRP ', wallet: 'rMRwDrs748B7J1PrcJKz8AGCeBaFrWEedJ' },
  { id: 8, min: 1, max: 1000, image: '/bnb.png', method: 'BNB ', wallet: '0xdD1b82C7cb95CB5Df487F2a2F7533a4CEcffa431' },
];

const Userdashboardfundaccount = ({ route }) => {
  const navigate = useNavigate()
  const [depositAmount, setDepositAmount] = useState()
  const [checkoutPage, setCheckoutPage] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [activeMethod, setActiveMethod] = useState()
  const [selectedCrypto, setSelectedCrypto] = useState(null);

  const close = () => {
    setCheckoutPage(false)
  }

  const handleChange = (e) => {
    const selectedMethod = e.target.value;
    const methodDetails = depositOptions.find(opt => opt.method === selectedMethod);
    setSelectedCrypto(methodDetails);
  };

  const handleProceed = () => {
    if (depositAmount >= activeMethod.min) {
      setCheckoutPage(true)
    } else if (isNaN(depositAmount)) {
      toast.warning('Only numbers are accepted')
    } else {
      toast.warning('Deposit amount too low')
    }
  }

  if (checkoutPage) {
    return <Checkout Active={activeMethod} depositAmount={depositAmount} closepage={close} route={route} />
  }

  return (
    <main className="fund-wrapper">
      <div className="fund-page">
        <button type="button" className="fund-back-btn" onClick={() => navigate('/dashboard')} aria-label="Back to dashboard">
          <FiArrowLeft />
        </button>

        <div className="fund-page-header">
          <h3>Choose an option</h3>
          <h2>Deposit methods</h2>
          <p>Choose a deposit method to add money.</p>
        </div>

        <Card padding="lg" className="fund-select-card">
          <label className="fund-select-label" htmlFor="crypto-select">Select cryptocurrency</label>
          <select id="crypto-select" onChange={handleChange} defaultValue="" className="fund-select">
            <option value="" disabled>Select method</option>
            {depositOptions.map(opt => (
              <option key={opt.id} value={opt.method}>{opt.method}</option>
            ))}
          </select>

          {selectedCrypto && (
            <div className="fund-crypto-summary">
              <img src={selectedCrypto.image} alt="" className="fund-crypto-icon" />
              <div className="fund-crypto-details">
                <p className="fund-crypto-method">{selectedCrypto.method}</p>
                <p className="fund-crypto-range">Min deposit: {selectedCrypto.min} USD</p>
              </div>
              <Button
                onClick={() => {
                  setActiveMethod(selectedCrypto)
                  setShowModal(true)
                }}
              >
                Proceed
              </Button>
            </div>
          )}
        </Card>

        <Button variant="ghost" onClick={() => navigate('/transactions')} className="fund-history-btn">
          Deposit history <FiArrowRight />
        </Button>
      </div>

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={activeMethod ? `Deposit via ${activeMethod.method}` : ''}
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowModal(false)}>Close</Button>
            <Button onClick={handleProceed}>Next</Button>
          </>
        }
      >
        {activeMethod && (
          <>
            <p className="fund-modal-min">Minimum deposit: {activeMethod.min} USD</p>
            <Input
              label="Amount"
              type="tel"
              placeholder="0.00"
              onChange={(e) => setDepositAmount(parseInt(e.target.value, 10))}
              trailingAction={<span>USD</span>}
            />
          </>
        )}
      </Modal>
    </main>
  )
}

export default Userdashboardfundaccount
