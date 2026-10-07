import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Ticket,
  ArrowLeft,
  Eye
} from 'lucide-react'

import DashboardLayout from '../components/DashboardLayout'
import '../styles/dashboard.css'

function AgentTickets() {

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [tickets, setTickets] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const statusFilter = searchParams.get('status')

  const isValidStatus =
    statusFilter === 'OPEN' ||
    statusFilter === 'IN_PROGRESS' ||
    statusFilter === 'CLOSED'

  const filteredTickets = isValidStatus
    ? tickets.filter(
        (ticket) => ticket.status === statusFilter
      )
    : tickets

  const pageTitle =
    statusFilter === 'OPEN'
      ? 'Open Tickets'
      : statusFilter === 'IN_PROGRESS'
        ? 'In Progress Tickets'
        : statusFilter === 'CLOSED'
          ? 'Closed Tickets'
          : 'My Assigned Tickets'

  const pageDescription =
    statusFilter === 'OPEN'
      ? 'View tickets waiting for support action.'
      : statusFilter === 'IN_PROGRESS'
        ? 'View tickets currently being handled by you.'
        : statusFilter === 'CLOSED'
          ? 'View tickets that have been completed and closed.'
          : 'View all tickets currently assigned to you.'

  const sectionTitle =
    statusFilter === 'OPEN'
      ? 'Open Tickets'
      : statusFilter === 'IN_PROGRESS'
        ? 'In Progress Tickets'
        : statusFilter === 'CLOSED'
          ? 'Closed Tickets'
          : 'My Assigned Tickets'

  const emptyMessage =
    statusFilter === 'OPEN'
      ? 'No open tickets found.'
      : statusFilter === 'IN_PROGRESS'
        ? 'No in-progress tickets found.'
        : statusFilter === 'CLOSED'
          ? 'No closed tickets found.'
          : 'No assigned tickets found.'

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
            data.message ||
            'Failed to load assigned tickets'
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

  const handleViewTicket = (ticketId) => {
    navigate(`/agent/tickets/${ticketId}`)
  }

  return (
    <DashboardLayout>

      <div className="dashboard-page">

        <div className="dashboard-page-header">

          <h1>
            {pageTitle}
          </h1>

          <p>
            {pageDescription}
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
                <Ticket size={17} />
                {sectionTitle}
              </h2>

              <span>
                {filteredTickets.length} tickets
              </span>

            </div>

            {filteredTickets.length === 0 ? (

              <div className="dashboard-empty">
                {emptyMessage}
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
                      <th>Action</th>
                    </tr>

                  </thead>

                  <tbody>

                    {filteredTickets.map((ticket) => (

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

                          <button
                            className="dashboard-view-button"
                            onClick={() =>
                              handleViewTicket(
                                ticket.ticketId
                              )
                            }
                          >
                            <Eye size={14} />
                            View
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
            navigate('/agent-dashboard')
          }
        >
          <ArrowLeft size={17} />
          Back to Agent Dashboard
        </button>

      </div>

    </DashboardLayout>
  )
}

export default AgentTickets