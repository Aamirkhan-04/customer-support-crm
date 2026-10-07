import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  LogIn,
  ShieldCheck,
  Mail,
  Lock
} from 'lucide-react'

import './Auth.css'

function Login() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('error')

  const navigate = useNavigate()

  const handleLogin = async (event) => {

    event.preventDefault()

    setMessage('')
    setMessageType('error')

    try {

      const response = await fetch(
        'http://localhost:8080/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email.trim(),
            password
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Login failed'
        )
      }

      localStorage.setItem(
        'token',
        data.token
      )

      localStorage.setItem(
        'email',
        data.email
      )

      localStorage.setItem(
        'role',
        data.role
      )

      setMessage('Login successful')
      setMessageType('success')

      switch (data.role) {

        case 'ADMIN':
          navigate('/admin-dashboard')
          break

        case 'MANAGER':
          navigate('/manager-dashboard')
          break

        case 'AGENT':
          navigate('/agent-dashboard')
          break

        case 'CUSTOMER':
          navigate('/customer-dashboard')
          break

        default:

          localStorage.removeItem('token')
          localStorage.removeItem('email')
          localStorage.removeItem('role')

          setMessage('Invalid user role')
          setMessageType('error')
      }

    } catch (error) {

      setMessage(error.message)
      setMessageType('error')
    }
  }

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-brand">

          <div className="auth-brand-icon">
            <ShieldCheck size={25} />
          </div>

          <div>

            <div className="auth-brand-name">
              Customer Support CRM
            </div>

            <div className="auth-brand-subtitle">
              CUSTOMER SUPPORT PORTAL
            </div>

          </div>

        </div>

        <div className="auth-heading">

          <div className="auth-heading-icon">
            <LogIn size={22} />
          </div>

          <div>

            <h1>
              Login
            </h1>

            <p>
              Sign in to access your customer support dashboard.
            </p>

          </div>

        </div>

        <form onSubmit={handleLogin}>

          <div className="auth-field">

            <label htmlFor="email">
              Email Address
            </label>

            <div className="auth-input-wrapper">

              <Mail size={18} />

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="Enter your registered email address"
                autoComplete="email"
                required
              />

            </div>

          </div>

          <div className="auth-field">

            <label htmlFor="password">
              Password
            </label>

            <div className="auth-input-wrapper">

              <Lock size={18} />

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter your account password"
                autoComplete="current-password"
                required
              />

            </div>

          </div>

          <button
            type="submit"
            className="auth-submit-button"
          >
            Login
          </button>

        </form>

        {message && (
          <div
            className={`auth-message ${
              messageType === 'success'
                ? 'auth-message-success'
                : 'auth-message-error'
            }`}
          >
            {message}
          </div>
        )}

        <div className="auth-footer">

          <span>
            New customer?
          </span>

          <Link to="/register">
            Create a customer account
          </Link>

        </div>

      </div>

    </div>
  )
}

export default Login