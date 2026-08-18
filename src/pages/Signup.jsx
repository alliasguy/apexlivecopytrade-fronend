import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BsEye, BsEyeSlash } from 'react-icons/bs'
import { FiUser, FiMail, FiLock, FiTrendingUp, FiShield, FiZap } from 'react-icons/fi'
import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import Loader from '../components/Loader'
import { Input, Button } from '../components/ui'
import { IoMdClose } from "react-icons/io";
import '../styles/authsplit.css'

const brandPoints = [
  { icon: <FiTrendingUp />, title: 'Copy top performers', body: 'Mirror trades from vetted, high-performing traders in real time.' },
  { icon: <FiZap />, title: 'Live everywhere', body: 'Forex, crypto, indices and futures - one account, every market.' },
  { icon: <FiShield />, title: 'Built on trust', body: 'Transparent performance history and secure fund management.' },
]

const Signup = ({ route }) => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [firstname, setFirstname] = useState('')
  const [username, setUserName] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loader, setLoader] = useState(false)
  const [showServerForm, setShowServerForm] = useState(false)
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [country, setCountry] = useState('');
  const [deviceName, setDeviceName] = useState('');

  useEffect(() => {
    // Get user's geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });

          try {
            // Fetch country name using reverse geocoding from Nominatim
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await res.json();
            if (data?.address?.country) {
              setCountry(data.address.country);
            }
          } catch (err) {
            console.warn('Could not fetch country from coordinates:', err);
          }
        },
        (error) => {
          console.warn('Geolocation not available or denied:', error);
        }
      );
    }

    // Detect OS and browser from userAgent
    const ua = navigator.userAgent;
    let os = 'Unknown OS';
    let browser = 'Unknown Browser';

    if (/windows/i.test(ua)) os = 'Windows';
    else if (/mac/i.test(ua)) os = 'MacOS';
    else if (/android/i.test(ua)) os = 'Android';
    else if (/linux/i.test(ua)) os = 'Linux';
    else if (/iphone|ipad/i.test(ua)) os = 'iOS';

    if (/chrome/i.test(ua) && !/edge|opr/i.test(ua)) browser = 'Chrome';
    else if (/firefox/i.test(ua)) browser = 'Firefox';
    else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari';
    else if (/edge/i.test(ua)) browser = 'Edge';
    else if (/opr|opera/i.test(ua)) browser = 'Opera';

    setDeviceName(`${os} – ${browser}`);
  }, []);

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

  // Signup function
  const Signup = async () => {
    setLoader(true);

    try {
      const referringUser = localStorage.getItem('referedUser') || '';
      const response = await fetch(`${route}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstname,
          lastName: lastname,
          userName: username,
          password: password,
          email: email,
          referralLink: referringUser,
          server: activeServer,
          location,
          deviceName,
          country
        }),
      });

      const result = await response.json();
      setLoader(false);


      if (result.status === 'error') {
        Toast.fire({
          icon: 'warning',
          title: `${result.message}`,
        });
        return;
      }

      // Save token and navigate to dashboard
      localStorage.setItem('token', result.token);

      const userData = {
        service_id: 'service_dn7i37u',
        template_id: 'template_scum1ro',
        user_id: '9tExDeSYFXDcRcM_q',
        template_params: {
          'name': `${result.name}`,
          'email': `${result.email}`,
        }
      };

      const adminData = {
        service_id: 'service_dn7i37u',
        template_id: 'template_fnm0gpa',
        user_id: '9tExDeSYFXDcRcM_q',
        template_params: {
          'name': `Bro`,
          'email': `support@apexlivecopytrade.org`,
          'message': `${result.message}`,
          'reply_to': `support@apexlivecopytrade.org`,
          'subject': `${result.adminSubject}`
        }
      };

      if (result.referringUser === null) {
        const sendMail = async () => {
          await Promise.all([
            await fetch('https://api.emailjs.com/api/v1.0/email/send', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(userData),
            }),
            await fetch('https://api.emailjs.com/api/v1.0/email/send', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(adminData),
            })
          ])
        }
        sendMail()
      }
      else {
        const referringUserData = {
          service_id: 'service_dn7i37u',
          template_id: 'template_fnm0gpa',
          user_id: '9tExDeSYFXDcRcM_q',
          template_params: {
            'name': `${result.referringUserName}`,
            'email': `${result.referringUserEmail}`,
            'message': `${result.referringUserMessage}`,
            'reply_to': `support@apexlivecopytrade.org`,
            'subject': `${result.subject}`
          }
        };
        const sendMail = async () => {
          await Promise.all([
            await fetch('https://api.emailjs.com/api/v1.0/email/send', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(userData),
            }),
            await fetch('https://api.emailjs.com/api/v1.0/email/send', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(referringUserData),
            }),
            await fetch('https://api.emailjs.com/api/v1.0/email/send', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(adminData),
            })
          ])
        }
        sendMail()
      }
      Toast.fire({
        icon: 'success',
        title: 'Account successfully created!'
      })

      // Clear form and localStorage
      setFirstname('');
      setLastname('');
      setUserName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      localStorage.removeItem('referedUser');

      navigate('/dashboard');

    } catch (error) {
      setLoader(false);
      console.error("Error during signup:", error);
      Toast.fire({
        icon: 'error',
        title: 'Something went wrong. Please try again.',
      });
    }
  };

  const [activeServer, setActiveServer] = useState(null); // stores 'server1', 'server2', 'server3'

  const handleCheckboxChange = (serverId) => {
    setActiveServer(prev => (prev === serverId ? null : serverId)); // toggle if same clicked again
  };

  const checkDetails = () => {
    if (password !== confirmPassword) {
      Toast.fire({
        icon: 'warning',
        title: "Passwords don't match",
      });
      return;
    }
    setShowServerForm(true)
  }

  return (
    <main className="auth-split">
      {loader && <Loader />}

      {showServerForm && (
        <div className="server-form-wrapper">
          <div className="admin-trader-card-delete-btn-container server-close-btn-container" onClick={() => { setShowServerForm(false) }}>
            <IoMdClose />
          </div>
          <h1>select server</h1>
          <div className="cards">
            <div className="server-card red">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={activeServer === 'server1'}
                  onChange={() => handleCheckboxChange('server1')}
                />
                <span className="slider"></span>
              </label>
              <p className="tip">server 1</p>
            </div>

            <div className="server-card blue">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={activeServer === 'server2'}
                  onChange={() => handleCheckboxChange('server2')}
                />
                <span className="slider"></span>
              </label>
              <p className="tip">server 2</p>
            </div>

            <div className="server-card green">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={activeServer === 'server3'}
                  onChange={() => handleCheckboxChange('server3')}
                />
                <span className="slider"></span>
              </label>
              <p className="tip">server 3</p>
            </div>
          </div>
          <button className="server-form-btn" onClick={(e) => {
            e.preventDefault()
            Signup()
          }}>proceed</button>
        </div>
      )}

      <aside className="auth-split__brand">
        <div className="auth-split__brand-top" onClick={() => navigate('/')}>
          <img src="/apexlivetradelogo3.png" alt="Apexlivecopytrade" className="auth-split__brand-logo" />
          <span className="auth-split__brand-name">Apexlivecopytrade</span>
        </div>

        <h1 className="auth-split__brand-headline">Start copytrading in minutes.</h1>

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
            <h1>Create your account</h1>
            <p>Get started - it only takes a minute.</p>
          </div>

          <form
            className="auth-split__form"
            onSubmit={(e) => {
              e.preventDefault()
              checkDetails()
            }}
          >
            <div className="auth-split__row">
              <Input
                label="First name"
                type="text"
                icon={<FiUser />}
                placeholder="John"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value.trim())}
                required
              />
              <Input
                label="Last name"
                type="text"
                icon={<FiUser />}
                placeholder="Doe"
                autoComplete="off"
                value={lastname}
                onChange={(e) => setLastname(e.target.value.trim())}
                required
              />
            </div>

            <Input
              label="Username"
              type="text"
              icon={<FiUser />}
              placeholder="johnsmith"
              value={username}
              onChange={(e) => setUserName(e.target.value.trim())}
              required
            />

            <Input
              label="Email"
              type="email"
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
              value={password}
              onChange={(e) => setPassword(e.target.value.trim())}
              trailingAction={
                <span onClick={() => setShowPassword(!showPassword)} role="button" aria-label="Toggle password visibility">
                  {showPassword ? <BsEye /> : <BsEyeSlash />}
                </span>
              }
              required
            />

            <Input
              label="Confirm password"
              type={showConfirmPassword ? 'text' : 'password'}
              icon={<FiLock />}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value.trim())}
              trailingAction={
                <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} role="button" aria-label="Toggle password visibility">
                  {showConfirmPassword ? <BsEye /> : <BsEyeSlash />}
                </span>
              }
              required
            />

            <Button type="submit" variant="primary" fullWidth loading={loader}>
              Register
            </Button>
          </form>

          <p className="auth-split__footer-link">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
          <p className="auth-split__terms">
            By continuing, you agree to our <Link to="/policy">Terms of use &amp; Privacy Policy</Link>.
          </p>
        </div>
      </section>
    </main>
  )
}

export default Signup
