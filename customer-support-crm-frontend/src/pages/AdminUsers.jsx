import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  ArrowLeft,
  CheckCircle2,
  XCircle
} from 'lucide-react'

import DashboardLayout from '../components/DashboardLayout'
import '../styles/dashboard.css'

function AdminUsers() {

  const navigate = useNavigate()

  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const token = localStorage.getItem('token')

    if (!token) {
      navigate('/login')
      return
    }

    const loadUsers = async () => {

      try {

        const response = await fetch(
          'http://localhost:8080/api/users',
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
            data.message || 'Failed to load users'
          )
        }

        setUsers(data)

      } catch (error) {

        setError(error.message)

      } finally {

        setLoading(false)
      }
    }

    loadUsers()

  }, [navigate])

  const enabledUsers = users.filter(
    (user) => user.enabled
  ).length

  const disabledUsers = users.filter(
    (user) => !user.enabled
  ).length

  const managerCount = users.filter(
    (user) => user.role === 'MANAGER'
  ).length

  const agentCount = users.filter(
    (user) => user.role === 'AGENT'
  ).length

  return (
    <DashboardLayout>

      <div className="dashboard-page">

        <div className="dashboard-page-header">

          <h1>All Users</h1>

          <p>
            View all registered users and their current account information.
          </p>

        </div>

        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        {loading && (
          <div className="dashboard-loading">
            Loading users...
          </div>
        )}

        {!loading && !error && (
          <>

            <section className="dashboard-section">

              <div className="dashboard-section-header">

                <h2>
                  User Overview
                </h2>

                <span>
                  {users.length} total users
                </span>

              </div>

              <div className="dashboard-card-grid">

                <div className="dashboard-card dashboard-card-static">

                  <div className="dashboard-card-icon">
                    <Users size={23} />
                  </div>

                  <div className="dashboard-card-content">

                    <h3>Total Users</h3>

                    <p>
                      All registered users
                    </p>

                    <strong className="dashboard-card-count">
                      {users.length}
                    </strong>

                  </div>

                </div>

                <div className="dashboard-card dashboard-card-static">

                  <div className="dashboard-card-icon">
                    <CheckCircle2 size={23} />
                  </div>

                  <div className="dashboard-card-content">

                    <h3>Enabled Users</h3>

                    <p>
                      Users currently enabled
                    </p>

                    <strong className="dashboard-card-count">
                      {enabledUsers}
                    </strong>

                  </div>

                </div>

                <div className="dashboard-card dashboard-card-static">

                  <div className="dashboard-card-icon">
                    <XCircle size={23} />
                  </div>

                  <div className="dashboard-card-content">

                    <h3>Disabled Users</h3>

                    <p>
                      Users currently disabled
                    </p>

                    <strong className="dashboard-card-count">
                      {disabledUsers}
                    </strong>

                  </div>

                </div>

                <div className="dashboard-card dashboard-card-static">

                  <div className="dashboard-card-icon">
                    <Users size={23} />
                  </div>

                  <div className="dashboard-card-content">

                    <h3>Support Team</h3>

                    <p>
                      Managers and support agents
                    </p>

                    <strong className="dashboard-card-count">
                      {managerCount + agentCount}
                    </strong>

                  </div>

                </div>

              </div>

            </section>

            <section className="dashboard-section">

              <div className="dashboard-section-header">

                <h2>
                  <Users size={17} />
                  User Directory
                </h2>

                <span>
                  Read only
                </span>

              </div>

              {users.length === 0 ? (

                <div className="dashboard-empty">
                  No users found.
                </div>

              ) : (

                <div className="dashboard-table-wrapper">

                  <table className="dashboard-table">

                    <thead>

                      <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                      </tr>

                    </thead>

                    <tbody>

                      {users.map((user) => (

                        <tr key={user.id}>

                          <td>
                            <strong>
                              #{user.id}
                            </strong>
                          </td>

                          <td>

                            <div className="dashboard-user-cell">

                              <div className="dashboard-user-avatar">
                                {user.username
                                  ?.charAt(0)
                                  .toUpperCase()}
                              </div>

                              <span>
                                {user.username}
                              </span>

                            </div>

                          </td>

                          <td>
                            {user.email}
                          </td>

                          <td>

                            <span className="crm-role-badge">
                              {user.role}
                            </span>

                          </td>

                          <td>

                            {user.enabled ? (

                              <span className="crm-user-status enabled">
                                <CheckCircle2 size={13} />
                                Enabled
                              </span>

                            ) : (

                              <span className="crm-user-status disabled">
                                <XCircle size={13} />
                                Disabled
                              </span>

                            )}

                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

              )}

            </section>

          </>
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

export default AdminUsers