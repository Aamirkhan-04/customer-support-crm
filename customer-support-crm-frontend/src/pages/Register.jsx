import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  UserPlus,
  ShieldCheck,
  Mail,
  Lock,
  User
} from 'lucide-react'

import './Auth.css'

function Register() {

  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (event) => {

    event.preventDefault()

    setMessage('')
    setError('')
    setLoading(true)

    try {

      const response = await fetch(
        'http://localhost:8080/api/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: username.trim(),
            email: email.trim(),
            password
          })
        }
      )

      const responseText = await response.text()

      if (!response.ok) {

        let errorMessage = 'Registration failed'

        try {

          const errorData =
            JSON.parse(responseText)

          if (errorData.message) {
            errorMessage = errorData.message
          }

        } catch {

          if (responseText) {
            errorMessage = responseText
          }
        }

        throw new Error(errorMessage)
      }

      setMessage(
        responseText ||
        'Account created successfully'
      )

      setUsername('')
      setEmail('')
      setPassword('')

      setTimeout(() => {
        navigate('/login', {
          replace: true
        })
      }, 1000)

    } catch (error) {

      setError(error.message)

    } finally {

      setLoading(false)
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
            <UserPlus size={22} />
          </div>

          <div>

            <h1>
              Create Customer Account
            </h1>

            <p>
              Create an account to submit and track your support tickets.
            </p>

          </div>

        </div>

        {message && (
          <div className="auth-message auth-message-success">
            {message}
          </div>
        )}

        {error && (
          <div className="auth-message auth-message-error">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>

          <div className="auth-field">

            <label htmlFor="username">
              Username
            </label>

            <div className="auth-input-wrapper">

              <User size={18} />

              <input
                id="username"
                type="text"
                value={username}
                onChange={(event) =>
                  setUsername(
                    event.target.value
                  )
                }
                placeholder="Choose a username"
                autoComplete="username"
                required
              />

            </div>

          </div>

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
                  setEmail(
                    event.target.value
                  )
                }
                placeholder="Enter your email address"
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
                  setPassword(
                    event.target.value
                  )
                }
                placeholder="Create a secure password"
                autoComplete="new-password"
                minLength="6"
                required
              />

            </div>

            <small>
              Password must be at least 6 characters.
            </small>

          </div>

          <button
            type="submit"
            className="auth-submit-button"
            disabled={loading}
          >
            {loading
              ? 'Creating Account...'
              : 'Create Account'}
          </button>

        </form>

        <div className="auth-footer">

          <span>
            Already have an account?
          </span>

          <Link to="/login">
            Sign in to your account
          </Link>

        </div>

      </div>

    </div>
  )
}

export default Register