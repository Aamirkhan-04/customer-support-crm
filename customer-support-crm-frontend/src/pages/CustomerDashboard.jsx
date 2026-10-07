import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Ticket,
  PlusCircle,
  ListChecks,
  Clock3,
  CheckCircle2,
  ArrowRight
} from 'lucide-react'

import DashboardLayout from '../components/DashboardLayout'
import '../styles/dashboard.css'

function CustomerDashboard() {

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
            'Failed to load tickets'
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

  const closedTickets = tickets.filter(
    (ticket) => ticket.status === 'CLOSED'
  ).length

  const customerCards = [
    {
      title: 'My Tickets',
      description: 'View and track all your support tickets',
      icon: Ticket,
      count: tickets.length,
      action: () =>
        navigate('/customer/tickets')
    },
    {
      title: 'Create Ticket',
      description: 'Create a new customer support request',
      icon: PlusCircle,
      count: null,
      action: () =>
        navigate('/customer/create-ticket')
    },
    {
      title: 'Open Tickets',
      description: 'Support requests waiting to be handled',
      icon: ListChecks,
      count: openTickets,
      action: () =>
        navigate('/customer/tickets?status=OPEN')
    },
    {
      title: 'In Progress',
      description: 'Support requests currently being handled',
      icon: Clock3,
      count: inProgressTickets,
      action: () =>
        navigate('/customer/tickets?status=IN_PROGRESS')
    },
    {
      title: 'Closed Tickets',
      description: 'Support requests that have been completed',
      icon: CheckCircle2,
      count: closedTickets,
      action: () =>
        navigate('/customer/tickets?status=CLOSED')
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

              <h1>
                Customer Dashboard
              </h1>

              <p>
                Create and track your customer support requests.
              </p>

            </div>

            <div className="dashboard-welcome">

              <div className="dashboard-welcome-content">

                <div className="dashboard-welcome-label">
                  CUSTOMER SUPPORT PORTAL
                </div>

                <h2>
                  Welcome, {user.username}
                </h2>

                <p>
                  Create support tickets and keep track of their
                  progress from one place.
                </p>

              </div>

              <div className="dashboard-welcome-icon">
                <Ticket size={52} />
              </div>

            </div>

            <section className="dashboard-section">

              <div className="dashboard-section-header">

                <h2>
                  Support Overview
                </h2>

                <span>
                  {tickets.length} total tickets
                </span>

              </div>

              <div className="dashboard-card-grid">

                {customerCards.map((item) => {

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

                        {item.count !== null && (
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

export default CustomerDashboard