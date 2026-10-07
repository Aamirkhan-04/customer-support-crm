import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Settings2,
  ArrowLeft,
  Wrench
} from 'lucide-react'

import DashboardLayout from '../components/DashboardLayout'
import '../styles/dashboard.css'

function AdminTicketOperations() {

  const navigate = useNavigate()

  const [tickets, setTickets] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const token = localStorage.getItem('token')

    if (!token) {
      navigate('/login')
      return
    }

    const fetchTickets = async () => {

      try {

        const response = await fetch(
          'http://localhost:8080/api/tickets',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(
            data.message || 'Failed to load tickets'
          )
        }

        setTickets(data)

      } catch (error) {

        setError(error.message)

      } finally {

        setLoading(false)
      }
    }

    fetchTickets()

  }, [navigate])

  const handleManageTicket = (ticketId) => {
    navigate(`/admin/ticket-operations/${ticketId}`)
  }

  return (
    <DashboardLayout>

      <div className="dashboard-page">

        <div className="dashboard-page-header">

          <h1>Ticket Operations</h1>

          <p>
            Select a ticket to assign agents and update support operations.
          </p>

        </div>

        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        {loading && (
          <div className="dashboard-loading">
            Loading tickets...
          </div>
        )}

        {!loading && !error && (

          <section className="dashboard-section">

            <div className="dashboard-section-header">

              <h2>
                <Settings2 size={17} />
                Manage Tickets
              </h2>

              <span>
                {tickets.length} tickets
              </span>

            </div>

            {tickets.length === 0 ? (

              <div className="dashboard-empty">
                No tickets found.
              </div>

            ) : (

              <div className="dashboard-table-wrapper">

                <table className="dashboard-table">

                  <thead>

                    <tr>
                      <th>Ticket ID</th>
                      <th>Subject</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Customer</th>
                      <th>Assigned Agent</th>
                      <th>Operation</th>
                    </tr>

                  </thead>

                  <tbody>

                    {tickets.map((ticket) => (

                      <tr key={ticket.id}>

                        <td>
                          <strong>
                            {ticket.ticketId}
                          </strong>
                        </td>

                        <td>
                          {ticket.subject}
                        </td>

                        <td>

                          <span
                            className={`crm-status crm-status-${ticket.status
                              ?.toLowerCase()
                              .replace('_', '-')}`}
                          >
                            {ticket.status}
                          </span>

                        </td>

                        <td>

                          <span
                            className={`crm-priority crm-priority-${ticket.priority
                              ?.toLowerCase()}`}
                          >
                            {ticket.priority}
                          </span>

                        </td>

                        <td>
                          {ticket.customerName}
                        </td>

                        <td>
                          {ticket.assignedAgentName ||
                            'Not Assigned'}
                        </td>

                        <td>

                          <button
                            className="dashboard-view-button"
                            onClick={() =>
                              handleManageTicket(
                                ticket.ticketId
                              )
                            }
                          >
                            <Wrench size={14} />
                            Manage
                          </button>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </section>

        )}

        <button
          className="dashboard-back-button"
          onClick={() =>
            navigate('/admin-dashboard')
          }
        >
          <ArrowLeft size={17} />
          Back to Admin Dashboard
        </button>

      </div>

    </DashboardLayout>
  )
}

export default AdminTicketOperations