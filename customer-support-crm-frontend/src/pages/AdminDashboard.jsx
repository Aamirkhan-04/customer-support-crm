import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Ticket,
  Users,
  ShieldCheck,
  ArrowRight,
  Settings2
} from 'lucide-react'

import DashboardLayout from '../components/DashboardLayout'
import '../styles/dashboard.css'

function AdminDashboard() {

  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const token = localStorage.getItem('token')

    if (!token) {
      navigate('/login')
      return
    }

    const fetchUser = async () => {

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

      } catch (error) {

        setError(error.message)

      } finally {

        setLoading(false)
      }
    }

    fetchUser()

  }, [navigate])

  const handleAllTickets = () => {
    navigate('/admin/tickets')
  }

  const handleTicketOperations = () => {
    navigate('/admin/ticket-operations')
  }

  const handleAllUsers = () => {
    navigate('/admin/users')
  }

  const handleUserOperations = () => {
    navigate('/admin/user-operations')
  }

  const adminCards = [
    {
      title: 'All Tickets',
      description: 'View all customer support tickets',
      icon: Ticket,
      action: handleAllTickets
    },
    {
      title: 'Ticket Operations',
      description: 'Assign and update customer support tickets',
      icon: Settings2,
      action: handleTicketOperations
    },
    {
      title: 'All Users',
      description: 'View all users and their current status',
      icon: Users,
      action: handleAllUsers
    },
    {
      title: 'User Operations',
      description: 'Manage access, roles and manager assignments',
      icon: ShieldCheck,
      action: handleUserOperations
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

              <h1>Admin Dashboard</h1>

              <p>
                Manage tickets and users from separate operations.
              </p>

            </div>

            <div className="dashboard-welcome">

              <div className="dashboard-welcome-content">

                <div className="dashboard-welcome-label">
                  CRM ADMIN PANEL
                </div>

                <h2>
                  Welcome, {user.username}
                </h2>

                <p>
                  Monitor support activity and manage CRM users
                  from one place.
                </p>

              </div>

              <div className="dashboard-welcome-icon">
                <ShieldCheck size={52} />
              </div>

            </div>

            <section className="dashboard-section">

              <div className="dashboard-section-header">

                <h2>
                  Support Management
                </h2>

                <span>
                  4 options
                </span>

              </div>

              <div className="dashboard-card-grid">

                {adminCards.map((item) => {

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

export default AdminDashboard