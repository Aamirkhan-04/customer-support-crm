import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Ticket,
  Users,
  UserRoundCog,
  PlusCircle,
  LogOut,
  ShieldCheck,
  ChevronRight,
  Eye,
  Settings2,
  Wrench
} from 'lucide-react'

import './DashboardLayout.css'

function DashboardLayout({ children }) {

  const navigate = useNavigate()
  const location = useLocation()

  const username = localStorage.getItem('email') || 'User'
  const role = localStorage.getItem('role') || ''

  const getRoleLabel = () => {

    switch (role) {

      case 'ADMIN':
        return 'Administrator'

      case 'MANAGER':
        return 'Manager'

      case 'AGENT':
        return 'Support Agent'

      case 'CUSTOMER':
        return 'Customer'

      default:
        return 'User'
    }
  }

  const getDashboardPath = () => {

    switch (role) {

      case 'ADMIN':
        return '/admin-dashboard'

      case 'MANAGER':
        return '/manager-dashboard'

      case 'AGENT':
        return '/agent-dashboard'

      case 'CUSTOMER':
        return '/customer-dashboard'

      default:
        return '/login'
    }
  }

  const getMenuItems = () => {

    const dashboardItem = {
      label: 'Dashboard',
      path: getDashboardPath(),
      icon: LayoutDashboard,
      level: 0
    }

    if (role === 'ADMIN') {

      if (location.pathname === '/admin/tickets') {

        return [
          dashboardItem,
          {
            label: 'All Tickets',
            path: '/admin/tickets',
            icon: Ticket,
            level: 0
          }
        ]
      }

      if (location.pathname.startsWith('/admin/tickets/')) {

        return [
          dashboardItem,
          {
            label: 'All Tickets',
            path: '/admin/tickets',
            icon: Ticket,
            level: 0,
            parentActive: true
          },
          {
            label: 'View Ticket',
            path: location.pathname,
            icon: Eye,
            level: 1
          }
        ]
      }

      if (location.pathname === '/admin/ticket-operations') {

        return [
          dashboardItem,
          {
            label: 'Ticket Operations',
            path: '/admin/ticket-operations',
            icon: Settings2,
            level: 0
          }
        ]
      }

      if (
        location.pathname.startsWith(
          '/admin/ticket-operations/'
        )
      ) {

        return [
          dashboardItem,
          {
            label: 'Ticket Operations',
            path: '/admin/ticket-operations',
            icon: Settings2,
            level: 0,
            parentActive: true
          },
          {
            label: 'Manage Ticket',
            path: location.pathname,
            icon: Wrench,
            level: 1
          }
        ]
      }

      if (location.pathname === '/admin/users') {

        return [
          dashboardItem,
          {
            label: 'All Users',
            path: '/admin/users',
            icon: Users,
            level: 0
          }
        ]
      }

      if (location.pathname === '/admin/user-operations') {

        return [
          dashboardItem,
          {
            label: 'User Operations',
            path: '/admin/user-operations',
            icon: UserRoundCog,
            level: 0
          }
        ]
      }

      return [dashboardItem]
    }

    if (role === 'MANAGER') {

      if (location.pathname === '/manager/tickets') {

        return [
          dashboardItem,
          {
            label: 'Team Tickets',
            path: '/manager/tickets',
            icon: Ticket,
            level: 0
          }
        ]
      }

      if (
        location.pathname.startsWith('/manager/tickets/')
      ) {

        return [
          dashboardItem,
          {
            label: 'Team Tickets',
            path: '/manager/tickets',
            icon: Ticket,
            level: 0,
            parentActive: true
          },
          {
            label: 'View Ticket',
            path: location.pathname,
            icon: Eye,
            level: 1
          }
        ]
      }

      if (
        location.pathname ===
        '/manager/ticket-operations'
      ) {

        return [
          dashboardItem,
          {
            label: 'Ticket Operations',
            path: '/manager/ticket-operations',
            icon: Settings2,
            level: 0
          }
        ]
      }

      if (
        location.pathname.startsWith(
          '/manager/ticket-operations/'
        )
      ) {

        return [
          dashboardItem,
          {
            label: 'Ticket Operations',
            path: '/manager/ticket-operations',
            icon: Settings2,
            level: 0,
            parentActive: true
          },
          {
            label: 'Manage Ticket',
            path: location.pathname,
            icon: Wrench,
            level: 1
          }
        ]
      }

      return [dashboardItem]
    }

    if (role === 'AGENT') {

      if (location.pathname === '/agent/tickets') {

        return [
          dashboardItem,
          {
            label: 'My Assigned Tickets',
            path: '/agent/tickets',
            icon: Ticket,
            level: 0
          }
        ]
      }

      if (
        location.pathname.startsWith(
          '/agent/tickets/'
        )
      ) {

        return [
          dashboardItem,
          {
            label: 'My Assigned Tickets',
            path: '/agent/tickets',
            icon: Ticket,
            level: 0,
            parentActive: true
          },
          {
            label: 'View Ticket',
            path: location.pathname,
            icon: Eye,
            level: 1
          }
        ]
      }

      return [dashboardItem]
    }

    if (role === 'CUSTOMER') {

      if (location.pathname === '/customer/tickets') {

        return [
          dashboardItem,
          {
            label: 'My Tickets',
            path: '/customer/tickets',
            icon: Ticket,
            level: 0
          }
        ]
      }

      if (
        location.pathname.startsWith(
          '/customer/tickets/'
        )
      ) {

        return [
          dashboardItem,
          {
            label: 'My Tickets',
            path: '/customer/tickets',
            icon: Ticket,
            level: 0,
            parentActive: true
          },
          {
            label: 'View Ticket',
            path: location.pathname,
            icon: Eye,
            level: 1
          }
        ]
      }

      if (
        location.pathname ===
        '/customer/create-ticket'
      ) {

        return [
          dashboardItem,
          {
            label: 'Create Ticket',
            path: '/customer/create-ticket',
            icon: PlusCircle,
            level: 0
          }
        ]
      }

      return [dashboardItem]
    }

    return []
  }

  const getBreadcrumbItems = () => {

    if (location.pathname === '/admin/tickets') {
      return ['All Tickets']
    }

    if (
      location.pathname.startsWith('/admin/tickets/')
    ) {
      return ['All Tickets', 'View Ticket']
    }

    if (
      location.pathname ===
      '/admin/ticket-operations'
    ) {
      return ['Ticket Operations']
    }

    if (
      location.pathname.startsWith(
        '/admin/ticket-operations/'
      )
    ) {
      return [
        'Ticket Operations',
        'Manage Ticket'
      ]
    }

    if (
      location.pathname ===
      '/admin/users'
    ) {
      return ['All Users']
    }

    if (
      location.pathname ===
      '/admin/user-operations'
    ) {
      return ['User Operations']
    }

    if (
      location.pathname ===
      '/manager/tickets'
    ) {
      return ['Team Tickets']
    }

    if (
      location.pathname.startsWith(
        '/manager/tickets/'
      )
    ) {
      return ['Team Tickets', 'View Ticket']
    }

    if (
      location.pathname ===
      '/manager/ticket-operations'
    ) {
      return ['Ticket Operations']
    }

    if (
      location.pathname.startsWith(
        '/manager/ticket-operations/'
      )
    ) {
      return [
        'Ticket Operations',
        'Manage Ticket'
      ]
    }

    if (location.pathname === '/agent/tickets') {

      const searchParams = new URLSearchParams(
        location.search
      )

      const status = searchParams.get('status')

      if (status === 'OPEN') {
        return [
          'My Assigned Tickets',
          'Open Tickets'
        ]
      }

      if (status === 'IN_PROGRESS') {
        return [
          'My Assigned Tickets',
          'In Progress Tickets'
        ]
      }

      if (status === 'CLOSED') {
        return [
          'My Assigned Tickets',
          'Closed Tickets'
        ]
      }

      return ['My Assigned Tickets']
    }

    if (
      location.pathname.startsWith(
        '/agent/tickets/'
      )
    ) {
      return [
        'My Assigned Tickets',
        'View Ticket'
      ]
    }

    if (location.pathname === '/customer/tickets') {

      const searchParams = new URLSearchParams(
        location.search
      )

      const status = searchParams.get('status')

      if (status === 'OPEN') {
        return [
          'My Tickets',
          'Open Tickets'
        ]
      }

      if (status === 'IN_PROGRESS') {
        return [
          'My Tickets',
          'In Progress Tickets'
        ]
      }

      if (status === 'CLOSED') {
        return [
          'My Tickets',
          'Closed Tickets'
        ]
      }

      return ['My Tickets']
    }

    if (
      location.pathname.startsWith(
        '/customer/tickets/'
      )
    ) {
      return [
        'My Tickets',
        'View Ticket'
      ]
    }

    if (
      location.pathname ===
      '/customer/create-ticket'
    ) {
      return ['Create Ticket']
    }

    return ['Dashboard']
  }

  const handleLogout = () => {

    localStorage.removeItem('token')
    localStorage.removeItem('email')
    localStorage.removeItem('role')

    navigate('/login')
  }

  const menuItems = getMenuItems()
  const breadcrumbItems = getBreadcrumbItems()

  return (
    <div className="crm-layout">

      <aside className="crm-sidebar">

        <div className="crm-brand">

          <div className="crm-brand-icon">
            <ShieldCheck size={25} />
          </div>

          <div>

            <div className="crm-brand-name">
              Customer Support CRM
            </div>

            <div className="crm-brand-subtitle">
              SUPPORT PORTAL
            </div>

          </div>

        </div>

        <div className="crm-sidebar-divider"></div>

        <nav className="crm-sidebar-menu">

          <div className="crm-menu-title">
            MAIN MENU
          </div>

          {menuItems.map((item, index) => {

            const Icon = item.icon

            const isCurrentPage =
              item.path === location.pathname

            const isActive =
              isCurrentPage ||
              Boolean(item.parentActive)

            return (
              <NavLink
                key={`${item.label}-${index}`}
                to={item.path}
                end
                className={`crm-menu-link ${isActive ? 'active' : ''
                  } ${item.level === 1
                    ? 'crm-menu-link-child'
                    : ''
                  }`}
              >

                <Icon
                  size={
                    item.level === 1
                      ? 16
                      : 18
                  }
                />

                <span>
                  {item.label}
                </span>

                {item.label === 'Dashboard' &&
                  isCurrentPage && (
                    <span className="crm-menu-dot"></span>
                  )}

              </NavLink>
            )
          })}

        </nav>

        <div className="crm-sidebar-bottom">

          <div className="crm-sidebar-profile">

            <div className="crm-profile-icon">
              <UserRoundCog size={20} />
            </div>

            <div className="crm-profile-text">

              <strong>
                {getRoleLabel()}
              </strong>

              <span>
                CRM Portal
              </span>

            </div>

          </div>

          <button
            className="crm-logout-button"
            onClick={handleLogout}
          >
            <LogOut size={18} />

            <span>
              Logout
            </span>

          </button>

        </div>

      </aside>

      <div className="crm-main">

        <header className="crm-topbar">

          <div className="crm-breadcrumb">

            <span>
              {getRoleLabel()}
            </span>

            {breadcrumbItems.map((item, index) => (

              <span
                key={`${item}-${index}`}
                className="crm-breadcrumb-item"
              >

                <ChevronRight size={15} />

                <strong>
                  {item}
                </strong>

              </span>
            ))}

          </div>

          <div className="crm-topbar-user">

            <div className="crm-topbar-avatar">
              {role.charAt(0) || 'U'}
            </div>

            <div className="crm-topbar-user-info">

              <strong>
                {role || 'User'}
              </strong>

              <span>
                {username}
              </span>

            </div>

          </div>

        </header>

        <main className="crm-content">

          {children}

        </main>

      </div>

    </div>
  )
}

export default DashboardLayout