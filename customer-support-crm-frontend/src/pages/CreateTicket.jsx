import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  PlusCircle,
  Ticket,
  ArrowLeft
} from 'lucide-react'

import DashboardLayout from '../components/DashboardLayout'
import '../styles/dashboard.css'

function CreateTicket() {

  const navigate = useNavigate()

  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('')

  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const [submitting, setSubmitting] = useState(false)

  const handleCreateTicket = async (event) => {

    event.preventDefault()

    setError('')
    setSuccessMessage('')

    if (!subject.trim()) {
      setError('Subject is required')
      return
    }

    if (subject.length > 150) {
      setError(
        'Subject must not exceed 150 characters'
      )
      return
    }

    if (!description.trim()) {
      setError('Description is required')
      return
    }

    if (description.length > 2000) {
      setError(
        'Description must not exceed 2000 characters'
      )
      return
    }

    if (!priority) {
      setError('Priority is required')
      return
    }

    const token = localStorage.getItem('token')

    if (!token) {
      navigate('/login')
      return
    }

    setSubmitting(true)

    try {

      const response = await fetch(
        'http://localhost:8080/api/tickets',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            subject: subject.trim(),
            description: description.trim(),
            priority: priority
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
          'Failed to create ticket'
        )
      }

      setSuccessMessage(
        `Ticket created successfully: ${data.ticketId}`
      )

      setSubject('')
      setDescription('')
      setPriority('')

    } catch (error) {

      setError(error.message)

    } finally {

      setSubmitting(false)
    }
  }

  return (
    <DashboardLayout>

      <div className="dashboard-page">

        <div className="dashboard-page-header">

          <h1>
            Create New Ticket
          </h1>

          <p>
            Submit a new customer support request.
          </p>

        </div>

        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="dashboard-success">
            {successMessage}
          </div>
        )}

        <section className="dashboard-section">

          <div className="dashboard-section-header">

            <h2>
              <PlusCircle size={17} />
              Ticket Information
            </h2>

            <span>
              New Support Request
            </span>

          </div>

          <div className="dashboard-form-card">

            <div className="dashboard-form-heading">

              <div className="dashboard-form-icon">
                <Ticket size={21} />
              </div>

              <div>

                <h3>
                  Create Support Ticket
                </h3>

                <p>
                  Provide the details of your issue so our support team can assist you.
                </p>

              </div>

            </div>

            <form
              className="dashboard-form"
              onSubmit={handleCreateTicket}
            >

              <div className="dashboard-form-field">

                <label>
                  Subject
                </label>

                <input
                  type="text"
                  value={subject}
                  onChange={(event) =>
                    setSubject(
                      event.target.value
                    )
                  }
                  placeholder="Enter your issue subject"
                  maxLength="150"
                  required
                />

                <span className="dashboard-form-helper">
                  {subject.length}/150 characters
                </span>

              </div>

              <div className="dashboard-form-field">

                <label>
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  placeholder="Describe your issue in detail..."
                  rows="7"
                  maxLength="2000"
                  required
                />

                <span className="dashboard-form-helper">
                  {description.length}/2000 characters
                </span>

              </div>

              <div className="dashboard-form-field">

                <label>
                  Priority
                </label>

                <select
                  value={priority}
                  onChange={(event) =>
                    setPriority(
                      event.target.value
                    )
                  }
                  required
                >

                  <option value="">
                    Select Priority
                  </option>

                  <option value="LOW">
                    LOW
                  </option>

                  <option value="MEDIUM">
                    MEDIUM
                  </option>

                  <option value="HIGH">
                    HIGH
                  </option>

                  <option value="URGENT">
                    URGENT
                  </option>

                </select>

              </div>

              <div className="dashboard-form-actions">

                <button
                  type="submit"
                  disabled={submitting}
                >
                  <PlusCircle size={16} />

                  {submitting
                    ? 'Creating...'
                    : 'Create Ticket'}
                </button>

              </div>

            </form>

          </div>

        </section>

        <button
          type="button"
          className="dashboard-back-button"
          onClick={() =>
            navigate('/customer-dashboard')
          }
        >
          <ArrowLeft size={17} />
          Back to Customer Dashboard
        </button>

      </div>

    </DashboardLayout>
  )
}

export default CreateTicket