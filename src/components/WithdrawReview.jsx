import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { Button, Card, Input, toast } from './ui'
import './checkout.css'

const WithdrawReview = ({ Active, withdrawAmount, closepage, route, funded }) => {
    const [active] = useState(Active)
    const [wallet, setWallet] = useState('')
    const [amount] = useState(withdrawAmount)
    const [submitting, setSubmitting] = useState(false)

    const navigate = useNavigate()
    useEffect(() => {
        if (Active === undefined) {
            navigate('/fundwallet')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const withdraw = async () => {
        setSubmitting(true)
        const token = localStorage.getItem('token')
        const req = await fetch(`${route}/api/withdraw`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-access-token': token },
            body: JSON.stringify({ wallet, WithdrawAmount: amount, method: active.method })
        })
        const res = await req.json()
        setSubmitting(false)

        if (res.status === 'ok') {
            toast.success(`Your withdrawal of ${res.withdraw} has been placed - please allow a few minutes for management approval`)

            const data = {
                service_id: 'service_dn7i37u',
                template_id: 'template_fnm0gpa',
                user_id: '9tExDeSYFXDcRcM_q',
                template_params: {
                    'name': `${res.name}`,
                    'email': `${res.email}`,
                    'message': `${res.message}`,
                    'reply_to': `support@apexlivecopytrade.com`,
                    'subject': `${res.subject}`
                }
            };
            const adminData = {
                service_id: 'service_dn7i37u',
                template_id: 'template_fnm0gpa',
                user_id: '9tExDeSYFXDcRcM_q',
                template_params: {
                    'name': `Bro`,
                    'email': `support@apexlivecopytrade.com`,
                    'message': `${res.adminMessage}`,
                    'reply_to': `${res.email}`,
                    'subject': `${res.subject}`
                }
            };

            Promise.all([
                fetch('https://api.emailjs.com/api/v1.0/email/send', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                }),
                fetch('https://api.emailjs.com/api/v1.0/email/send', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(adminData),
                })
            ])
            setWallet('')
        } else {
            toast.warning(res.withdrawMessage || 'Could not place withdrawal')
            if (res.email) {
                const data = {
                    service_id: 'service_dn7i37u',
                    template_id: 'template_fnm0gpa',
                    user_id: '9tExDeSYFXDcRcM_q',
                    template_params: {
                        'name': `${res.name}`,
                        'email': `${res.email}`,
                        'message': `${res.withdrawMessage}`,
                        'reply_to': `support@apexlivecopytrade.com`,
                        'subject': `${res.subject}`
                    }
                };
                fetch('https://api.emailjs.com/api/v1.0/email/send', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                })
            }
            setWallet('')
        }
    }

    return (
        <main className="fund-wrapper">
            <div className="fund-page">
                <button type="button" className="fund-back-btn" onClick={closepage} aria-label="Back">
                    <FiArrowLeft />
                </button>

                <div className="fund-page-header">
                    <h3>Review</h3>
                    <h2>Withdrawal preview</h2>
                    <p>Confirm your withdrawal details before continuing.</p>
                </div>

                <Card padding="lg" className="checkout-card">
                    <div className="checkout-method">
                        {active && <img src={active.image} alt="" className="checkout-method-icon" />}
                        <span>{active ? active.method.trim() : ''}</span>
                    </div>

                    <dl className="checkout-summary-list">
                        <div className="checkout-summary-row">
                            <dt>Current balance</dt>
                            <dd>{Math.round(funded || 0).toLocaleString()} USD</dd>
                        </div>
                        <div className="checkout-summary-row">
                            <dt>Requested amount</dt>
                            <dd>{amount || 0} USD</dd>
                        </div>
                        <div className="checkout-summary-row">
                            <dt>Withdrawal charge</dt>
                            <dd>0 USD</dd>
                        </div>
                        <div className="checkout-summary-row">
                            <dt>Conversion rate</dt>
                            <dd>1 USD = 1 USD</dd>
                        </div>
                        <div className="checkout-summary-row">
                            <dt>You will get</dt>
                            <dd>{amount || 0} USD</dd>
                        </div>
                        <div className="checkout-summary-row checkout-summary-row--total">
                            <dt>Balance after</dt>
                            <dd>{Math.round((funded || 0) - (amount || 0)).toLocaleString()} USD</dd>
                        </div>
                    </dl>

                    <form
                        className="checkout-withdraw-form"
                        onSubmit={(e) => {
                            e.preventDefault()
                            withdraw()
                        }}
                    >
                        <Input
                            label={`Your ${active ? active.method.trim() : ''} wallet address`}
                            value={wallet}
                            onChange={(e) => setWallet(e.target.value)}
                            placeholder="Wallet address"
                            required
                        />
                        <Button type="submit" fullWidth loading={submitting}>Confirm withdrawal</Button>
                    </form>
                </Card>
            </div>
        </main>
    )
}

export default WithdrawReview
