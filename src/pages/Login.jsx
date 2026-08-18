import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { BsEyeSlash, BsEye } from 'react-icons/bs'
import { FiMail, FiLock, FiTrendingUp, FiShield, FiZap } from 'react-icons/fi'
import Loader from '../components/Loader'
import { Input, Button } from '../components/ui'
import '../styles/authsplit.css'

const brandPoints = [
  { icon: <FiTrendingUp />, title: 'Copy top performers', body: 'Mirror trades from vetted, high-performing traders in real time.' },
  { icon: <FiZap />, title: 'Live everywhere', body: 'Forex, crypto, indices and futures - one account, every market.' },
  { icon: <FiShield />, title: 'Built on trust', body: 'Transparent performance history and secure fund management.' },
]

const Login = ({ route }) => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loader, setLoader] = useState(false)
  const [check, setChecked] = useState(false)

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

  const login = async () => {
    try {
      setLoader(true);

      const request = await axios.post(
        `${route}/api/login`,
        {
          email,
          password,
          rememberme: check,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const { status, token } = request.data;

      if (status === 'ok' && token) {
        localStorage.setItem('token', token);

        Toast.fire({
          icon: 'success',
          title: 'Signed in successfully',
        });

        navigate('/dashboard');

      } else if (status === 400) {
        Toast.fire({
          icon: 'error',
          title: 'Error! Email not verified',
        });
      } else if (status === 401) {
        Toast.fire({
          icon: 'warning',
          title: 'Warning! Incorrect password',
        });
      } else {
        Toast.fire({
          icon: 'error',
          title: 'User does not exist',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      Toast.fire({
        icon: 'error',
        title: 'Something went wrong. Please try again.',
      });
    } finally {
      setLoader(false);
    }
  };

  return (
    <main className="auth-split">
      {loader && <Loader />}

      <aside className="auth-split__brand">
        <div className="auth-split__brand-top" onClick={() => navigate('/')}>
          <img src="/apexlivetradelogo3.png" alt="Apexlivecopytrade" className="auth-split__brand-logo" />
          <span className="auth-split__brand-name">Apexlivecopytrade</span>
        </div>

        <h1 className="auth-split__brand-headline">Welcome back to your trading dashboard.</h1>

        <div className="auth-split__brand-points">
          {brandPoints.map((point) => (
            <div className="auth-split__brand-point" key={point.title}>
              <span className="auth-split__brand-point-icon">{point.icon}</span>
              <div className="auth-split__brand-point-text">
                <strong>{point.title}</strong>
                <span>{point.body}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="auth-split__brand-footer">&copy; {new Date().getFullYear()} Apexlivecopytrade. All rights reserved.</p>
      </aside>

      <section className="auth-split__form-panel">
        <div className="auth-split__form-inner">
          <div className="auth-split__mobile-logo" onClick={() => navigate('/')}>
            <img src="/apexlivetradelogo3.png" alt="Apexlivecopytrade" />
            <span>Apexlivecopytrade</span>
          </div>

          <div className="auth-split__form-header">
            <h1>Log in to your account</h1>
            <p>Welcome back - enter your details to continue.</p>
          </div>

          <form
            className="auth-split__form"
            onSubmit={(e) => {
              e.preventDefault()
              login()
            }}
          >
            <Input
              label="Email"
              type="text"
              icon={<FiMail />}
              placeholder="name@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim().toLocaleLowerCase())}
              required
            />
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              icon={<FiLock />}
              placeholder="Password"
              autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.target.value.trim())}
              trailingAction={
                <span onClick={() => setShowPassword(!showPassword)} role="button" aria-label="Toggle password visibility">
                  {showPassword ? <BsEye /> : <BsEyeSlash />}
                </span>
              }
              required
            />

            <div className="auth-split__remember">
              <label>
                <input type="checkbox" checked={check} onChange={() => setChecked(!check)} />
                Remember me
              </label>
              <Link to="/passwordreset">Forgot password?</Link>
            </div>

            <Button type="submit" variant="primary" fullWidth loading={loader}>
              Log in
            </Button>
          </form>

          <p className="auth-split__footer-link">
            Don't have an account? <Link to="/signup">Create one</Link>
          </p>
          <p className="auth-split__terms">
            By continuing, you agree to our <Link to="/policy">Terms of use &amp; Privacy Policy</Link>.
          </p>
        </div>
      </section>
    </main>
  )
}

export default Login
