import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  UserRoundCog,
  CheckCircle2,
  XCircle,
  ArrowLeft
} from 'lucide-react'

import DashboardLayout from '../components/DashboardLayout'
import '../styles/dashboard.css'

function AdminUserOperations() {

  const navigate = useNavigate()

  const [users, setUsers] = useState([])
  const [selectedRoles, setSelectedRoles] = useState({})
  const [selectedManagers, setSelectedManagers] = useState({})

  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const [loading, setLoading] = useState(true)
  const [updatingUserId, setUpdatingUserId] = useState(null)

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

        const roleValues = {}
        const managerValues = {}

        data.forEach((user) => {
          roleValues[user.id] = user.role
        })

        setSelectedRoles(roleValues)
        setSelectedManagers(managerValues)

      } catch (error) {

        setError(error.message)

      } finally {

        setLoading(false)
      }
    }

    loadUsers()

  }, [navigate])

  const handleToggleStatus = async (user) => {

    setError('')
    setSuccessMessage('')

    const token = localStorage.getItem('token')

    if (!token) {
      navigate('/login')
      return
    }

    setUpdatingUserId(user.id)

    try {

      const response = await fetch(
        `http://localhost:8080/api/users/${user.id}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            enable: !user.enabled
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
          'Failed to update user status'
        )
      }

      setUsers((previousUsers) =>
        previousUsers.map((currentUser) =>
          currentUser.id === data.id
            ? data
            : currentUser
        )
      )

      setSuccessMessage(
        `${data.username} is now ${
          data.enabled ? 'enabled' : 'disabled'
        }`
      )

    } catch (error) {

      setError(error.message)

    } finally {

      setUpdatingUserId(null)
    }
  }

  const handleRoleChange = async (userId) => {

    setError('')
    setSuccessMessage('')

    const selectedRole = selectedRoles[userId]

    if (!selectedRole) {
      setError('Role is required')
      return
    }

    const token = localStorage.getItem('token')

    if (!token) {
      navigate('/login')
      return
    }

    setUpdatingUserId(userId)

    try {

      const response = await fetch(
        `http://localhost:8080/api/users/${userId}/role`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            role: selectedRole
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
          'Failed to update user role'
        )
      }

      setUsers((previousUsers) =>
        previousUsers.map((currentUser) =>
          currentUser.id === data.id
            ? data
            : currentUser
        )
      )

      setSelectedRoles((previousRoles) => ({
        ...previousRoles,
        [data.id]: data.role
      }))

      setSuccessMessage(
        `${data.username} role updated to ${data.role}`
      )

    } catch (error) {

      setError(error.message)

    } finally {

      setUpdatingUserId(null)
    }
  }

  const handleAssignManager = async (userId) => {

    setError('')
    setSuccessMessage('')

    const managerId = selectedManagers[userId]

    if (!managerId) {
      setError('Please select a manager')
      return
    }

    const token = localStorage.getItem('token')

    if (!token) {
      navigate('/login')
      return
    }

    setUpdatingUserId(userId)

    try {

      const response = await fetch(
        `http://localhost:8080/api/users/${userId}/manager`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            managerId: Number(managerId)
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
          'Failed to assign manager'
        )
      }

      setUsers((previousUsers) =>
        previousUsers.map((currentUser) =>
          currentUser.id === data.id
            ? data
            : currentUser
        )
      )

      setSuccessMessage(
        `Manager assigned successfully to ${data.username}`
      )

    } catch (error) {

      setError(error.message)

    } finally {

      setUpdatingUserId(null)
    }
  }

  const managers = users.filter(
    (user) => user.role === 'MANAGER'
  )

  return (
    <DashboardLayout>

      <div className="dashboard-page">

        <div className="dashboard-page-header">

          <h1>User Operations</h1>

          <p>
            Manage user access, roles and manager assignments.
          </p>

        </div>

        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="dashboard-success">
            <CheckCircle2 size={16} />
            <span>
              {successMessage}
            </span>
          </div>
        )}

        {loading ? (

          <div className="dashboard-loading">
            Loading users...
          </div>

        ) : users.length === 0 ? (

          <div className="dashboard-empty">
            No users found.
          </div>

        ) : (

          <section className="dashboard-section">

            <div className="dashboard-section-header">

              <h2>
                <UserRoundCog size={17} />
                Manage Users
              </h2>

              <span>
                {users.length} users
              </span>

            </div>

            <div className="dashboard-table-wrapper">

              <table className="dashboard-table">

                <thead>

                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Current Role</th>
                    <th>Status</th>
                    <th>Access</th>
                    <th>Change Role</th>
                    <th>Assign Manager</th>
                  </tr>

                </thead>

                <tbody>

                  {users.map((user) => (

                    <tr key={user.id}>

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

                      <td>

                        <button
                          className={
                            user.enabled
                              ? 'dashboard-danger-button'
                              : 'dashboard-success-button'
                          }
                          onClick={() =>
                            handleToggleStatus(user)
                          }
                          disabled={
                            updatingUserId === user.id
                          }
                        >
                          {user.enabled
                            ? 'Disable'
                            : 'Enable'}
                        </button>

                      </td>

                      <td>

                        <div className="dashboard-table-action">

                          <select
                            value={
                              selectedRoles[user.id] ||
                              user.role
                            }
                            onChange={(event) =>
                              setSelectedRoles(
                                (previousRoles) => ({
                                  ...previousRoles,
                                  [user.id]:
                                    event.target.value
                                })
                              )
                            }
                          >

                            <option value="ADMIN">
                              ADMIN
                            </option>

                            <option value="MANAGER">
                              MANAGER
                            </option>

                            <option value="AGENT">
                              AGENT
                            </option>

                            <option value="CUSTOMER">
                              CUSTOMER
                            </option>

                          </select>

                          <button
                            className="dashboard-secondary-button"
                            onClick={() =>
                              handleRoleChange(user.id)
                            }
                            disabled={
                              updatingUserId === user.id
                            }
                          >
                            Change
                          </button>

                        </div>

                      </td>

                      <td>

                        <div className="dashboard-table-action">

                          <select
                            value={
                              selectedManagers[user.id] ||
                              ''
                            }
                            onChange={(event) =>
                              setSelectedManagers(
                                (previousManagers) => ({
                                  ...previousManagers,
                                  [user.id]:
                                    event.target.value
                                })
                              )
                            }
                          >

                            <option value="">
                              Select Manager
                            </option>

                            {managers.map((manager) => (

                              <option
                                key={manager.id}
                                value={manager.id}
                              >
                                {manager.username}
                              </option>

                            ))}

                          </select>

                          <button
                            className="dashboard-secondary-button"
                            onClick={() =>
                              handleAssignManager(user.id)
                            }
                            disabled={
                              updatingUserId === user.id ||
                              managers.length === 0
                            }
                          >
                            Assign
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

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

export default AdminUserOperations