import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Ticket,
  Settings2,
  ArrowRight
} from 'lucide-react'

import DashboardLayout from '../components/DashboardLayout'
import '../styles/dashboard.css'

function ManagerDashboard() {

  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [tickets, setTickets] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const token = localStorage.getItem('token')

    if (!token) {
      navigate('/login')
      return
    }

    const fetchDashboardData = async () => {

      try {

        const userResponse = await fetch(
          'http://localhost:8080/api/auth/me',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        const userData = await userResponse.json()

        if (!userResponse.ok) {
          throw new Error(
            userData.message ||
            'Failed to load user details'
          )
        }

        setUser(userData)

        const ticketResponse = await fetch(
          'http://localhost:8080/api/tickets',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        const ticketData = await ticketResponse.json()

        if (!ticketResponse.ok) {
          throw new Error(
            ticketData.message ||
            'Failed to load team tickets'
          )
        }

        setTickets(ticketData)

      } catch (error) {

        setError(error.message)

      } finally {

        setLoading(false)
      }
    }

    fetchDashboardData()

  }, [navigate])

  const openTickets = tickets.filter(
    (ticket) => ticket.status === 'OPEN'
  ).length

  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === 'IN_PROGRESS'
  ).length

  const managerCards = [
    {
      title: 'Team Tickets',
      description: 'View all tickets handled by your support team',
      icon: Ticket,
      action: () => navigate('/manager/tickets')
    },
    {
      title: 'Ticket Operations',
      description: 'Assign agents and update ticket information',
      icon: Settings2,
      action: () => navigate('/manager/ticket-operations')
    },
    {
      title: 'Open Tickets',
      description: 'Tickets waiting to be handled',
      icon: Ticket,
      count: openTickets,
      action: () =>
        navigate('/manager/tickets?status=OPEN')
    },
    {
      title: 'In Progress',
      description: 'Tickets currently being handled',
      icon: Ticket,
      count: inProgressTickets,
      action: () =>
        navigate('/manager/tickets?status=IN_PROGRESS')
    }
  ]

  return (
    <DashboardLayout>

      <div className="dashboard-page">

        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        {loading && (
          <div className="dashboard-loading">
            Loading dashboard...
          </div>
        )}

        {user && !loading && !error && (
          <>

            <div className="dashboard-page-header">

              <h1>Manager Dashboard</h1>

              <p>
                Track team tickets and manage support operations from one place.
              </p>

            </div>

            <div className="dashboard-welcome">

              <div className="dashboard-welcome-content">

                <div className="dashboard-welcome-label">
                  CRM MANAGER PANEL
                </div>

                <h2>
                  Welcome, {user.username}
                </h2>

                <p>
                  Monitor your team's tickets and manage support operations.
                </p>

              </div>

              <div className="dashboard-welcome-icon">
                <Ticket size={52} />
              </div>

            </div>

            <section className="dashboard-section">

              <div className="dashboard-section-header">

                <h2>
                  Team Management
                </h2>

                <span>
                  4 options
                </span>

              </div>

              <div className="dashboard-card-grid">

                {managerCards.map((item) => {

                  const Icon = item.icon

                  return (
                    <button
                      key={item.title}
                      className="dashboard-card"
                      onClick={item.action}
                    >

                      <div className="dashboard-card-icon">
                        <Icon size={23} />
                      </div>

                      <div className="dashboard-card-content">

                        <h3>
                          {item.title}
                        </h3>

                        <p>
                          {item.description}
                        </p>

                        {item.count !== undefined && (
                          <strong className="dashboard-card-count">
                            {item.count}
                          </strong>
                        )}

                      </div>

                      <ArrowRight
                        size={19}
                        className="dashboard-card-arrow"
                      />

                    </button>
                  )
                })}

              </div>

            </section>

          </>
        )}

      </div>

    </DashboardLayout>
  )
}

export default ManagerDashboard