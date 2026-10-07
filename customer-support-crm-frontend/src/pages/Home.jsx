import { useNavigate } from 'react-router-dom'
import {
  ShieldCheck,
  UserPlus,
  LogIn,
  LockKeyhole,
  MessageSquareText,
  Activity,
  ArrowRight,
  Users,
  Ticket,
  CheckCircle2
} from 'lucide-react'

import './Home.css'

function Home() {

  const navigate = useNavigate()

  return (
    <div className="home-page">

      {/* HEADER */}

      <header className="home-header">

        <div className="home-brand">

          <div className="home-brand-icon">
            <ShieldCheck size={25} />
          </div>

          <div>

            <div className="home-brand-name">
              Customer Support CRM
            </div>

            <div className="home-brand-subtitle">
              SMART SUPPORT • SIMPLE MANAGEMENT
            </div>

          </div>

        </div>

        <nav className="home-nav">

          <a href="#home">
            Home
          </a>

          <a href="#about">
            About
          </a>

          <a href="#features">
            Features
          </a>

          <a href="#security">
            Security
          </a>

        </nav>

        <div className="home-header-actions">

          <a
            href="#get-started"
            className="home-get-started-button"
          >
            <UserPlus size={17} />
            Get started
          </a>

          <button
            className="home-login-button"
            onClick={() => navigate('/login')}
          >
            <LogIn size={17} />
            Login
          </button>

        </div>

      </header>

      <main>

        {/* HERO */}

        <section
          id="home"
          className="home-hero"
        >

          <div className="home-hero-content">

            <div className="home-eyebrow">

              <span className="home-eyebrow-dot"></span>

              WELCOME TO CUSTOMER SUPPORT CRM

            </div>

            <h1>
              Support made simple.
              <span>
                Service you can trust.
              </span>
            </h1>

            <p>
              A secure place to create support tickets,
              track progress, communicate with support teams,
              and manage customer issues from one place.
            </p>

            <div className="home-hero-actions">

              <a
                href="#get-started"
                className="home-primary-button"
              >
                Get started
                <ArrowRight size={17} />
              </a>

              <a
                href="#about"
                className="home-secondary-button"
              >
                Learn more
              </a>

            </div>

            <div className="home-trust-points">

              <div className="home-trust-item">

                <div className="home-trust-icon">
                  <ShieldCheck size={18} />
                </div>

                <div>

                  <strong>
                    Secure access
                  </strong>

                  <span>
                    Protected customer experience
                  </span>

                </div>

              </div>

              <div className="home-trust-item">

                <div className="home-trust-icon">
                  <MessageSquareText size={18} />
                </div>

                <div>

                  <strong>
                    Simple support
                  </strong>

                  <span>
                    Tickets and communication in one place
                  </span>

                </div>

              </div>

            </div>

          </div>

          <div className="home-hero-visual">

            <div className="home-visual-glow"></div>

            <div className="home-dashboard-visual">

              <div className="home-visual-top">

                <div className="home-visual-brand">
                  <ShieldCheck size={16} />
                  Support CRM
                </div>

                <span>
                  Secure
                </span>

              </div>

              <div className="home-visual-panel">

                <div className="home-visual-sidebar">

                  <div className="home-visual-sidebar-item active">
                    <Activity size={14} />
                    Dashboard
                  </div>

                  <div className="home-visual-sidebar-item">
                    <Ticket size={14} />
                    Tickets
                  </div>

                  <div className="home-visual-sidebar-item">
                    <LockKeyhole size={14} />
                    Security
                  </div>

                </div>

                <div className="home-visual-main">

                  <div className="home-visual-main-heading">

                    <small>
                      CUSTOMER SUPPORT
                    </small>

                    <strong>
                      Stay on top of every ticket
                    </strong>

                  </div>

                  <div className="home-visual-cards">

                    <div className="home-visual-mini-card">

                      <span>
                        Open
                      </span>

                      <strong>
                        08
                      </strong>

                    </div>

                    <div className="home-visual-mini-card">

                      <span>
                        In Progress
                      </span>

                      <strong>
                        14
                      </strong>

                    </div>

                    <div className="home-visual-mini-card">

                      <span>
                        Closed
                      </span>

                      <strong>
                        32
                      </strong>

                    </div>

                  </div>

                  <div className="home-visual-ticket">

                    <div>

                      <span>
                        TKT-20481
                      </span>

                      <strong>
                        Unable to access account
                      </strong>

                    </div>

                    <span className="home-visual-status">
                      IN PROGRESS
                    </span>

                  </div>

                </div>

              </div>

            </div>

            <div className="home-floating-card home-floating-security">

              <ShieldCheck size={17} />

              <div>

                <strong>
                  Protected
                </strong>

                <span>
                  Secure support experience
                </span>

              </div>

            </div>

            <div className="home-floating-card home-floating-ticket">

              <MessageSquareText size={17} />

              <div>

                <strong>
                  Ticket updated
                </strong>

                <span>
                  Support team is working on it
                </span>

              </div>

            </div>

          </div>

        </section>

        {/* ABOUT */}

        <section
          id="about"
          className="home-section home-about"
        >

          <div className="home-section-heading">

            <span>
              ABOUT THE PLATFORM
            </span>

            <h2>
              A simpler way to manage
              <br />
              customer support
            </h2>

            <p>
              Customer Support CRM connects customers and support teams
              through a clear ticket-based workflow.
            </p>

          </div>

          <div className="home-about-grid">

            <div className="home-about-card">

              <div className="home-about-icon">
                <Ticket size={21} />
              </div>

              <h3>
                Ticket-based support
              </h3>

              <p>
                Customers can create support tickets and track their
                progress from creation to completion.
              </p>

            </div>

            <div className="home-about-card">

              <div className="home-about-icon">
                <Users size={21} />
              </div>

              <h3>
                Organized support teams
              </h3>

              <p>
                Agents and managers can work with assigned tickets
                and keep support operations organized.
              </p>

            </div>

            <div className="home-about-card">

              <div className="home-about-icon">
                <Activity size={21} />
              </div>

              <h3>
                Clear ticket progress
              </h3>

              <p>
                Ticket status and priority make it easier to understand
                what needs attention and what has been completed.
              </p>

            </div>

          </div>

        </section>

        {/* GET STARTED */}

        <section
          id="get-started"
          className="home-section home-get-started"
        >

          <div className="home-section-heading">

            <span>
              GET STARTED
            </span>

            <h2>
              Choose how you want to continue
            </h2>

            <p>
              Sign in to your account or create a new customer profile.
            </p>

          </div>

          <div className="home-start-grid">

            <div className="home-start-card">

              <div className="home-start-card-top">

                <div className="home-start-icon">
                  <LogIn size={21} />
                </div>

                <span>
                  Existing users
                </span>

              </div>

              <div className="home-start-content">

                <small>
                  Welcome back
                </small>

                <h3>
                  Login
                </h3>

                <p>
                  Sign in to access your dashboard and manage your
                  customer support activity.
                </p>

              </div>

              <button
                className="home-start-button"
                onClick={() => navigate('/login')}
              >
                Login to your account
                <ArrowRight size={17} />
              </button>

            </div>

            <div className="home-start-card home-start-card-customer">

              <div className="home-start-card-top">

                <div className="home-start-icon">
                  <UserPlus size={21} />
                </div>

                <span>
                  For customers
                </span>

              </div>

              <div className="home-start-content">

                <small>
                  New customer
                </small>

                <h3>
                  Customer Registration
                </h3>

                <p>
                  Create a customer account to submit and track
                  support tickets.
                </p>

              </div>

              <button
                className="home-start-button"
                onClick={() => navigate('/register')}
              >
                Create customer account
                <ArrowRight size={17} />
              </button>

            </div>

          </div>

        </section>

        {/* FEATURES */}

        <section
          id="features"
          className="home-section home-features"
        >

          <div className="home-section-heading">

            <span>
              BUILT FOR EVERYDAY SUPPORT
            </span>

            <h2>
              Everything you need,
              <br />
              in one place
            </h2>

          </div>

          <div className="home-feature-grid">

            <div className="home-feature-card">

              <div className="home-feature-icon">
                <Ticket size={21} />
              </div>

              <div>

                <strong>
                  Ticket management
                </strong>

                <p>
                  Create, track and manage support requests with clear
                  status and priority information.
                </p>

              </div>

            </div>

            <div className="home-feature-card">

              <div className="home-feature-icon">
                <Activity size={21} />
              </div>

              <div>

                <strong>
                  Ticket progress
                </strong>

                <p>
                  Follow ticket progress from open to in-progress
                  and completed.
                </p>

              </div>

            </div>

            <div className="home-feature-card">

              <div className="home-feature-icon">
                <Users size={21} />
              </div>

              <div>

                <strong>
                  Role-based support
                </strong>

                <p>
                  Separate experiences for customers, agents, managers
                  and administrators.
                </p>

              </div>

            </div>

            <div className="home-feature-card">

              <div className="home-feature-icon">
                <MessageSquareText size={21} />
              </div>

              <div>

                <strong>
                  Support communication
                </strong>

                <p>
                  Keep ticket comments and support conversations
                  connected to the issue.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* SECURITY */}

        <section
          id="security"
          className="home-section home-security"
        >

          <div className="home-security-content">

            <div className="home-security-icon">
              <ShieldCheck size={30} />
            </div>

            <div>

              <span>
                SECURITY
              </span>

              <h2>
                Your support experience matters.
              </h2>

              <p>
                Access customer support services through a protected
                role-based experience designed to keep support activity
                controlled and organized.
              </p>

            </div>

          </div>

          <div className="home-security-points">

            <div>

              <LockKeyhole size={20} />

              <strong>
                Protected access
              </strong>

              <span>
                Secure authenticated access
              </span>

            </div>

            <div>

              <ShieldCheck size={20} />

              <strong>
                Role-based permissions
              </strong>

              <span>
                Access based on user role
              </span>

            </div>

            <div>

              <CheckCircle2 size={20} />

              <strong>
                Controlled operations
              </strong>

              <span>
                Support actions remain organized
              </span>

            </div>

          </div>

        </section>

      </main>

      {/* FOOTER */}

      <footer className="home-footer">

        <div className="home-footer-brand">

          <ShieldCheck size={18} />

          <strong>
            Customer Support CRM
          </strong>

        </div>

        <span>
          © 2026 Customer Support CRM. All rights reserved.
        </span>

        <span>
          Built for secure customer support.
        </span>

      </footer>

    </div>
  )
}

export default Home