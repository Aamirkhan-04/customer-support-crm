import { Routes, Route, Navigate } from 'react-router-dom'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'

import CustomerDashboard from './pages/CustomerDashboard'
import CustomerTickets from './pages/CustomerTickets'
import CustomerTicketDetails from './pages/CustomerTicketDetails'
import CreateTicket from './pages/CreateTicket'

import AdminDashboard from './pages/AdminDashboard'
import AdminTickets from './pages/AdminTickets'
import AdminTicketView from './pages/AdminTicketView'
import AdminTicketOperations from './pages/AdminTicketOperations'
import AdminTicketDetails from './pages/AdminTicketDetails'
import AdminUsers from './pages/AdminUsers'
import AdminUserOperations from './pages/AdminUserOperations'

import ManagerDashboard from './pages/ManagerDashboard'
import ManagerTickets from './pages/ManagerTickets'
import ManagerTicketView from './pages/ManagerTicketView'
import ManagerTicketOperations from './pages/ManagerTicketOperations'
import ManagerTicketDetails from './pages/ManagerTicketDetails'

import AgentDashboard from './pages/AgentDashboard'
import AgentTickets from './pages/AgentTickets'
import AgentTicketDetails from './pages/AgentTicketDetails'

import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>

      {/* PUBLIC */}

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      {/* CUSTOMER */}

      <Route
        path="/customer-dashboard"
        element={
          <ProtectedRoute allowedRoles={['CUSTOMER']}>
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/tickets"
        element={
          <ProtectedRoute allowedRoles={['CUSTOMER']}>
            <CustomerTickets />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/tickets/:ticketId"
        element={
          <ProtectedRoute allowedRoles={['CUSTOMER']}>
            <CustomerTicketDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/create-ticket"
        element={
          <ProtectedRoute allowedRoles={['CUSTOMER']}>
            <CreateTicket />
          </ProtectedRoute>
        }
      />

      {/* ADMIN */}

      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/tickets"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminTickets />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/tickets/:ticketId"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminTicketView />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/ticket-operations"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminTicketOperations />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/ticket-operations/:ticketId"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminTicketDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminUsers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/user-operations"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminUserOperations />
          </ProtectedRoute>
        }
      />

      {/* MANAGER */}

      <Route
        path="/manager-dashboard"
        element={
          <ProtectedRoute allowedRoles={['MANAGER']}>
            <ManagerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/manager/tickets"
        element={
          <ProtectedRoute allowedRoles={['MANAGER']}>
            <ManagerTickets />
          </ProtectedRoute>
        }
      />

      <Route
        path="/manager/tickets/:ticketId"
        element={
          <ProtectedRoute allowedRoles={['MANAGER']}>
            <ManagerTicketView />
          </ProtectedRoute>
        }
      />

      <Route
        path="/manager/ticket-operations"
        element={
          <ProtectedRoute allowedRoles={['MANAGER']}>
            <ManagerTicketOperations />
          </ProtectedRoute>
        }
      />

      <Route
        path="/manager/ticket-operations/:ticketId"
        element={
          <ProtectedRoute allowedRoles={['MANAGER']}>
            <ManagerTicketDetails />
          </ProtectedRoute>
        }
      />

      {/* AGENT */}

      <Route
        path="/agent-dashboard"
        element={
          <ProtectedRoute allowedRoles={['AGENT']}>
            <AgentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/agent/tickets"
        element={
          <ProtectedRoute allowedRoles={['AGENT']}>
            <AgentTickets />
          </ProtectedRoute>
        }
      />

      <Route
        path="/agent/tickets/:ticketId"
        element={
          <ProtectedRoute allowedRoles={['AGENT']}>
            <AgentTicketDetails />
          </ProtectedRoute>
        }
      />

      {/* FALLBACK */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  )
}

export default App