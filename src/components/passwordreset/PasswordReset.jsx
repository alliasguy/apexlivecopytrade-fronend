import React, { useState } from 'react'
import '../../styles/authcard.css'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import { FiLock } from 'react-icons/fi'
import { BsEye, BsEyeSlash } from 'react-icons/bs'
import { Input, Button } from '../ui'
import Swal from 'sweetalert2'

const PasswordReset = ({ route }) => {
    const params = useParams()
    const [token] = useState(params.token)
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loader, setLoader] = useState(false)
    const navigate = useNavigate()

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

    const resetPassword = async () => {
        if (newPassword !== confirmPassword) {
            Toast.fire({
                icon: 'error',
                title: 'passwords do not match'
            })
            return
        }
        setLoader(true);
        try {
            const req = await axios.post(
                `${route}/api/resetpassword`,
                {
                    newPassword,
                    token
                },
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            setLoader(false)

            if (req.data.status === 'ok') {
                Toast.fire({
                    icon: 'success',
                    title: 'password successfully reset!'
                })
                navigate('/login')
            } else {
                Toast.fire({
                    icon: 'error',
                    title: req.data.message || 'error! something went wrong'
                })
            }
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
                <h1>Reset your password</h1>
                <p className="auth-card-subtitle">Choose a new password for your account.</p>
                <form
                    className="auth-card-form"
                    onSubmit={(e) => {
                        e.preventDefault()
                        resetPassword()
                    }}
                >
                    <Input
                        label="New password"
                        type={showPassword ? 'text' : 'password'}
                        icon={<FiLock />}
                        placeholder="Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value.trim())}
                        trailingAction={
                            <span onClick={() => setShowPassword(!showPassword)} role="button" aria-label="Toggle password visibility">
                                {showPassword ? <BsEye /> : <BsEyeSlash />}
                            </span>
                        }
                        required
                    />
                    <Input
                        label="Confirm new password"
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
                        reset password
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default PasswordReset
