import React from 'react'
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi'
import WithdrawReview from '../WithdrawReview';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Input, Modal, toast } from '../ui'
import '../userdashboardfundaccount/userdashboardfundaccount.css'

const withdrawMethods = [
  { id: 1, min: 10, max: 1000000, image: '/btc.png', method: 'BTC' },
  { id: 2, min: 10, max: 1000000, image: '/etherium.png', method: 'ETH' },
  { id: 3, min: 10, max: 1000000, image: '/tron.png', method: 'tether(TRC20)' },
  { id: 7, min: 10, max: 1000000, image: '/usdc-coin.png', method: 'USDC (ETH Network)' },
  { id: 4, min: 10, max: 1000000, image: '/solana.png', method: 'Solana (SOL) ' },
  { id: 5, min: 10, max: 1000000, image: '/dogecoin-logo.png', method: 'Dodgecoin ' },
  { id: 6, min: 10, max: 1000000, image: '/xrp-icon.png', method: 'XRP ' },
]

const Userdashboardwithdraw = ({ route }) => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState()
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [activeMethod, setActiveMethod] = useState()
  const [checkoutPage, setCheckoutPage] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState()
  const [selectedCrypto, setSelectedCrypto] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    const getData = async () => {
      try {
        const req = await fetch(`${route}/api/getData`, { headers: { 'x-access-token': token } })
        const res = await req.json()
        if (res.status === 'error') {
          navigate('/login')
          return
        }
        setUserData(res)
      } finally {
        setLoading(false)
      }
    }
    getData()
  }, [navigate, route])

  const close = () => setCheckoutPage(false)

  const handleChange = (e) => {
    const methodDetails = withdrawMethods.find(opt => opt.method === e.target.value)
    setSelectedCrypto(methodDetails)
  }

  const handleProceed = () => {
    if (withdrawAmount >= activeMethod.min) {
      setCheckoutPage(true)
    } else if (isNaN(withdrawAmount)) {
      toast.warning('Amount must be a number')
    } else {
      toast.warning('Amount is less than the withdrawal limit')
    }
  }

  if (checkoutPage) {
    return <WithdrawReview Active={activeMethod} withdrawAmount={withdrawAmount} closepage={close} route={route} funded={userData?.funded} />
  }

  return (
    <main className="fund-wrapper">
      <div className="fund-page">
        <button type="button" className="fund-back-btn" onClick={() => navigate('/dashboard')} aria-label="Back to dashboard">
          <FiArrowLeft />
        </button>

        <div className="fund-page-header">
          <h3>Choose an option</h3>
          <h2>Withdrawal methods</h2>
          <p>Choose a withdrawal method to withdraw money.</p>
        </div>

        <Card padding="lg" className="fund-select-card">
          <label className="fund-select-label" htmlFor="withdraw-select">Select cryptocurrency</label>
          <select id="withdraw-select" onChange={handleChange} defaultValue="" className="fund-select">
            <option value="" disabled>Select method</option>
            {withdrawMethods.map(opt => (
              <option key={opt.id} value={opt.method}>{opt.method}</option>
            ))}
          </select>

          {selectedCrypto && (
            <div className="fund-crypto-summary">
              <img src={selectedCrypto.image} alt="" className="fund-crypto-icon" />
              <div className="fund-crypto-details">
                <p className="fund-crypto-method">{selectedCrypto.method}</p>
                <p className="fund-crypto-range">Min withdrawal: {selectedCrypto.min} USD</p>
              </div>
              <Button
                disabled={loading}
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
          Withdrawal history <FiArrowRight />
        </Button>
      </div>

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={activeMethod ? `Withdraw via ${activeMethod.method}` : ''}
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowModal(false)}>Close</Button>
            <Button onClick={handleProceed}>Next</Button>
          </>
        }
      >
        {activeMethod && (
          <>
            <p className="fund-modal-min">Minimum withdrawal: {activeMethod.min} USD</p>
            <Input
              label="Amount"
              type="tel"
              placeholder="0.00"
              onChange={(e) => setWithdrawAmount(parseInt(e.target.value, 10))}
              trailingAction={<span>USD</span>}
            />
          </>
        )}
      </Modal>
    </main>
  )
}

export default Userdashboardwithdraw
