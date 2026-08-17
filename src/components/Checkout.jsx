import React, { useEffect, useState } from 'react'
import Deposit from './Deposit'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { Button, Card } from './ui'
import './checkout.css'

const Checkout = ({ Active, depositAmount, closepage, route }) => {
  const [checkout, setCheckout] = useState(true)
  const [active] = useState(Active)
  const [deposit, setDeposit] = useState(false)
  const [amount] = useState(depositAmount)
  const navigate = useNavigate()

  useEffect(() => {
    if (Active === undefined) {
      navigate('/fundwallet')
    }
  }, [])

  const close = () => {
    setDeposit(false)
    setCheckout(true)
  }

  if (deposit) {
    return <Deposit amount={amount} active={active} close={close} route={route} />
  }

  if (!checkout || !Active) return null;

  return (
    <main className="fund-wrapper">
      <div className="fund-page">
        <button type="button" className="fund-back-btn" onClick={closepage} aria-label="Back">
          <FiArrowLeft />
        </button>

        <div className="fund-page-header">
          <h3>Review</h3>
          <h2>Payment preview</h2>
          <p>Confirm your deposit details before continuing.</p>
        </div>

        <Card padding="lg" className="checkout-card">
          <div className="checkout-method">
            <img src={Active.image} alt="" className="checkout-method-icon" />
            <span>{Active.method.trim()}</span>
          </div>

          <dl className="checkout-summary-list">
            <div className="checkout-summary-row">
              <dt>Amount to deposit</dt>
              <dd>{depositAmount} USD</dd>
            </div>
            <div className="checkout-summary-row">
              <dt>Network/processing charge</dt>
              <dd>0 USD</dd>
            </div>
            <div className="checkout-summary-row">
              <dt>Minimum deposit</dt>
              <dd>{Active.min} USD</dd>
            </div>
            <div className="checkout-summary-row">
              <dt>Conversion rate</dt>
              <dd>1 USD = 1 USD</dd>
            </div>
            <div className="checkout-summary-row checkout-summary-row--total">
              <dt>Total</dt>
              <dd>{depositAmount} USD</dd>
            </div>
          </dl>

          <Button
            fullWidth
            onClick={() => {
              setDeposit(true)
              setCheckout(false)
            }}
          >
            Confirm and continue
          </Button>
        </Card>
      </div>
    </main>
  )
}

export default Checkout
