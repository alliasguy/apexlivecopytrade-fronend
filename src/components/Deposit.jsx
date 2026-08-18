import React, { useState, useRef } from 'react'
import { MdOutlineContentCopy, MdOutlineDone } from 'react-icons/md'
import { BsImageFill, BsUpload } from 'react-icons/bs'
import { FiLink, FiArrowLeft } from 'react-icons/fi'
import { Button, Card, toast } from './ui'
import './deposit.css'

const Deposit = ({ amount, active, close, route }) => {
    const [Active] = useState(active)
    const [clipBoard, setClipBoard] = useState(false)
    const [showImage, setShowImage] = useState()
    const clipRef = useRef(null)
    const [uploading, setUploading] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const copy = () => {
        navigator.clipboard.writeText(clipRef.current.value)
        setClipBoard(true)
        setTimeout(() => setClipBoard(false), 2000)
    }

    const uploadProof = async (file) => {
        setUploading(true)
        const formData = new FormData
        formData.append('file', file)
        formData.append('upload_preset', 'upload');
        const req = await fetch('https://api.cloudinary.com/v1_1/duesyx3zu/image/upload',
            {
                method: 'POST',
                body: formData,
            }
        )
        const res = await req.json()
        if (res) {
            setShowImage(res.secure_url)
            setUploading(false)
        }
    }

    const sendProof = async () => {
        setSubmitting(true)
        const req = await fetch(`${route}/api/sendproof`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token')
            },
            body: JSON.stringify({
                amount: amount,
                method: Active.method
            })
        })
        const res = await req.json()
        setSubmitting(false)

        if (res.status === 200) {
            toast.success(`You have successfully placed a deposit of ${amount}`)

            const data = {
                service_id: 'service_dn7i37u',
                template_id: 'template_fnm0gpa',
                user_id: '9tExDeSYFXDcRcM_q',
                template_params: {
                    'name': `${res.name}`,
                    'email': `${res.email}`,
                    'message': `${res.message}`,
                    'reply_to': `support@apexlivecopytrade.org`,
                    'subject': `${res.subject}`
                }
            };
            const adminData = {
                service_id: 'service_dn7i37u',
                template_id: 'template_fnm0gpa',
                user_id: '9tExDeSYFXDcRcM_q',
                template_params: {
                    'name': `Bro`,
                    'email': `support@apexlivecopytrade.org`,
                    'message': `${res.adminMessage}`,
                    'reply_to': `${res.email}`,
                    'subject': `${res.adminSubject}`
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
        }
        else if (res.status === 500) {
            toast.error('User does not exist')
        }
        else {
            toast.error('Internal server error')
        }
    }

    return (
        <main className="fund-wrapper">
            <div className="fund-page">
                <button type="button" className="fund-back-btn" onClick={close} aria-label="Back">
                    <FiArrowLeft />
                </button>

                <div className="fund-page-header">
                    <h3>Confirm</h3>
                    <h2>Confirm deposit</h2>
                    <p>Pay to the address below, then upload proof of payment.</p>
                </div>

                <Card padding="lg" className="deposit-card">
                    <p className="deposit-amount-line">
                        You have requested <strong>{amount} USD</strong>. Please pay <strong>{amount} USD</strong> to the address below.
                    </p>

                    <p className="deposit-wallet-label">Wallet address</p>
                    <div className="deposit-copy-row">
                        <span className="deposit-copy-icon"><FiLink /></span>
                        <input type="text" value={Active.wallet} ref={clipRef} readOnly className="deposit-wallet-input" />
                        <button type="button" className="deposit-copy-btn" onClick={copy} aria-label="Copy wallet address">
                            {clipBoard ? <MdOutlineDone /> : <MdOutlineContentCopy />}
                        </button>
                    </div>

                    <form
                        className="deposit-proof-form"
                        onSubmit={(e) => {
                            e.preventDefault()
                            sendProof()
                        }}
                    >
                        <p className="deposit-proof-label">Upload proof of payment</p>
                        <div className="deposit-proof-preview">
                            {uploading && <div className="deposit-proof-spinner" aria-hidden="true" />}
                            {!uploading && (showImage ? <img src={showImage} alt="Proof of payment" className="deposit-proof-image" /> : <BsImageFill />)}
                        </div>
                        <label htmlFor="proof-img" className="deposit-upload-label">
                            <BsUpload /> Choose file
                            <input
                                type="file"
                                accept=".jpg, .png, .svg, .webp, .jpeg"
                                name="images"
                                id="proof-img"
                                className="deposit-upload-input"
                                required
                                onChange={(e) => {
                                    const image = e.target.files[0]
                                    uploadProof(image)
                                }}
                            />
                        </label>
                        <Button type="submit" fullWidth loading={submitting} disabled={!showImage}>
                            Send proof
                        </Button>
                    </form>
                </Card>
            </div>
        </main>
    )
}

export default Deposit
