import React, { useState } from 'react'
import '../../styles/authcard.css'
import { Link, useNavigate } from 'react-router-dom';
import { FiMail } from 'react-icons/fi';
import { Input, Button } from '../ui';
import Swal from 'sweetalert2'

const ForgotPassword = ({ route }) => {
  const navigate = useNavigate()
  const [loader, setLoader] = useState(false)
  const [email, setEmail] = useState('')

  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  const sendMail = async () => {
    setLoader(true)
    try {
      await fetch(`${route}/api/requestpasswordreset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email }),
      })

      // The backend emails the reset link directly to the account's address
      // now, so there's nothing further to do here on success.
      setLoader(false)
      Toast.fire({
        icon: 'success',
        title: 'If that account exists, a password reset link has been sent to its email'
      })
    } catch (error) {
      setLoader(false)
      Toast.fire({
        icon: 'error',
        title: 'error! something went wrong'
      })
    }
  }

  return (
    <div className="auth-card-page">
      <div className="auth-card">
        <img
          src="/apexlivetradelogo3.png"
          alt="Apexlivecopytrade"
          className="auth-card-logo"
          onClick={() => navigate('/')}
        />
        <h1>Forgot your password?</h1>
        <p className="auth-card-subtitle">Enter the email address linked to your account and we'll send you a reset link.</p>
        <form
          className="auth-card-form"
          onSubmit={(e) => {
            e.preventDefault()
            sendMail()
          }}
        >
          <Input
            label="Email"
            type="email"
            icon={<FiMail />}
            placeholder="name@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim().toLowerCase())}
            required
          />
          <Button type="submit" variant="primary" fullWidth loading={loader}>
            send reset link
          </Button>
        </form>
        <div className="auth-card-links">
          <Link to="/login">back to login</Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
