import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Ticket,
  UserCheck,
  Flag,
  MessageSquare,
  Paperclip,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react'

import DashboardLayout from '../components/DashboardLayout'
import '../styles/dashboard.css'

function ManagerTicketDetails() {

  const { ticketId } = useParams()
  const navigate = useNavigate()

  const [ticket, setTicket] = useState(null)
  const [comments, setComments] = useState([])
  const [attachments, setAttachments] = useState([])
  const [agents, setAgents] = useState([])

  const [selectedAgentId, setSelectedAgentId] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedPriority, setSelectedPriority] = useState('')

  const [comment, setComment] = useState('')

  const [error, setError] = useState('')

  const [assignmentError, setAssignmentError] = useState('')
  const [assignmentSuccess, setAssignmentSuccess] = useState('')

  const [statusError, setStatusError] = useState('')
  const [statusSuccess, setStatusSuccess] = useState('')

  const [priorityError, setPriorityError] = useState('')
  const [prioritySuccess, setPrioritySuccess] = useState('')

  const [commentError, setCommentError] = useState('')
  const [commentSuccess, setCommentSuccess] = useState('')

  const [loading, setLoading] = useState(true)
  const [assigning, setAssigning] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [updatingPriority, setUpdatingPriority] = useState(false)
  const [addingComment, setAddingComment] = useState(false)

  useEffect(() => {

    const token = localStorage.getItem('token')

    if (!token) {
      navigate('/login')
      return
    }

    const fetchTicketDetails = async () => {

      try {

        const ticketResponse = await fetch(
          `http://localhost:8080/api/tickets/${ticketId}`,
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
            ticketData.message || 'Failed to load ticket'
          )
        }

        setTicket(ticketData)
        setSelectedStatus(ticketData.status)
        setSelectedPriority(ticketData.priority)

        const commentResponse = await fetch(
          `http://localhost:8080/api/tickets/${ticketId}/comments`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        const commentData = await commentResponse.json()

        if (!commentResponse.ok) {
          throw new Error(
            commentData.message || 'Failed to load comments'
          )
        }

        setComments(commentData)

        const attachmentResponse = await fetch(
          `http://localhost:8080/api/tickets/${ticketId}/attachments`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        const attachmentData = await attachmentResponse.json()

        if (!attachmentResponse.ok) {
          throw new Error(
            attachmentData.message ||
            'Failed to load attachments'
          )
        }

        setAttachments(attachmentData)

        const agentResponse = await fetch(
          'http://localhost:8080/api/tickets/team-agents',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        const agentData = await agentResponse.json()

        if (!agentResponse.ok) {
          throw new Error(
            agentData.message ||
            'Failed to load team agents'
          )
        }

        setAgents(agentData)

        const assignedAgent = agentData.find(
          (agent) =>
            agent.username === ticketData.assignedAgentName
        )

        if (assignedAgent) {
          setSelectedAgentId(
            String(assignedAgent.id)
          )
        }

      } catch (error) {

        setError(error.message)

      } finally {

        setLoading(false)
      }
    }

    fetchTicketDetails()

  }, [ticketId, navigate])

  const handleAssignTicket = async (event) => {

    event.preventDefault()

    setAssignmentError('')
    setAssignmentSuccess('')

    if (!selectedAgentId) {
      setAssignmentError('Please select an agent')
      return
    }

    const token = localStorage.getItem('token')

    if (!token) {
      navigate('/login')
      return
    }

    setAssigning(true)

    try {

      const response = await fetch(
        `http://localhost:8080/api/tickets/${ticketId}/assign`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            assignedAgentId: Number(selectedAgentId)
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
          'Failed to assign ticket'
        )
      }

      setTicket(data)

      setAssignmentSuccess(
        `Ticket assigned to ${data.assignedAgentName}`
      )

    } catch (error) {

      setAssignmentError(error.message)

    } finally {

      setAssigning(false)
    }
  }

  const handleUpdateStatus = async (event) => {

    event.preventDefault()

    setStatusError('')
    setStatusSuccess('')

    if (!selectedStatus) {
      setStatusError('Please select a status')
      return
    }

    const token = localStorage.getItem('token')

    if (!token) {
      navigate('/login')
      return
    }

    setUpdatingStatus(true)

    try {

      const response = await fetch(
        `http://localhost:8080/api/tickets/${ticketId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            status: selectedStatus
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
          'Failed to update status'
        )
      }

      setTicket(data)
      setSelectedStatus(data.status)

      setStatusSuccess(
        `Ticket status updated to ${data.status}`
      )

    } catch (error) {

      setStatusError(error.message)

    } finally {

      setUpdatingStatus(false)
    }
  }

  const handleUpdatePriority = async (event) => {

    event.preventDefault()

    setPriorityError('')
    setPrioritySuccess('')

    if (!selectedPriority) {
      setPriorityError('Please select a priority')
      return
    }

    const token = localStorage.getItem('token')

    if (!token) {
      navigate('/login')
      return
    }

    setUpdatingPriority(true)

    try {

      const response = await fetch(
        `http://localhost:8080/api/tickets/${ticketId}/priority`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            priority: selectedPriority
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
          'Failed to update priority'
        )
      }

      setTicket(data)
      setSelectedPriority(data.priority)

      setPrioritySuccess(
        `Ticket priority updated to ${data.priority}`
      )

    } catch (error) {

      setPriorityError(error.message)

    } finally {

      setUpdatingPriority(false)
    }
  }

  const handleAddComment = async (event) => {

    event.preventDefault()

    setCommentError('')
    setCommentSuccess('')

    if (!comment.trim()) {
      setCommentError('Comment is required')
      return
    }

    if (comment.length > 1000) {
      setCommentError(
        'Comment must not exceed 1000 characters'
      )
      return
    }

    const token = localStorage.getItem('token')

    if (!token) {
      navigate('/login')
      return
    }

    setAddingComment(true)

    try {

      const response = await fetch(
        `http://localhost:8080/api/tickets/${ticketId}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            comment: comment.trim()
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
          'Failed to add comment'
        )
      }

      setComments((previousComments) => [
        ...previousComments,
        data
      ])

      setComment('')
      setCommentSuccess(
        'Comment added successfully'
      )

    } catch (error) {

      setCommentError(error.message)

    } finally {

      setAddingComment(false)
    }
  }

  const formatFileSize = (fileSize) => {

    if (fileSize < 1024) {
      return `${fileSize} bytes`
    }

    return `${(fileSize / 1024).toFixed(2)} KB`
  }

  return (
    <DashboardLayout>

      <div className="dashboard-page">

        {loading && (
          <div className="dashboard-loading">
            Loading ticket details...
          </div>
        )}

        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        {ticket && !loading && (
          <>

            <div className="dashboard-page-header">

              <h1>Manage Ticket</h1>

              <p>
                Manage assignment, status, priority and support activity.
              </p>

            </div>

            <section className="dashboard-section">

              <div className="dashboard-section-header">

                <h2>
                  <Ticket size={17} />
                  Ticket Information
                </h2>

                <span>
                  {ticket.ticketId}
                </span>

              </div>

              <div className="dashboard-form-card">

                <div className="dashboard-form-grid">

                  <div className="dashboard-form-field">
                    <label>Ticket ID</label>

                    <input
                      type="text"
                      value={ticket.ticketId}
                      readOnly
                    />
                  </div>

                  <div className="dashboard-form-field">
                    <label>Subject</label>

                    <input
                      type="text"
                      value={ticket.subject}
                      readOnly
                    />
                  </div>

                  <div className="dashboard-form-field">
                    <label>Status</label>

                    <input
                      type="text"
                      value={ticket.status}
                      readOnly
                    />
                  </div>

                  <div className="dashboard-form-field">
                    <label>Priority</label>

                    <input
                      type="text"
                      value={ticket.priority}
                      readOnly
                    />
                  </div>

                  <div className="dashboard-form-field">
                    <label>Customer</label>

                    <input
                      type="text"
                      value={ticket.customerName}
                      readOnly
                    />
                  </div>

                  <div className="dashboard-form-field">
                    <label>Assigned Agent</label>

                    <input
                      type="text"
                      value={
                        ticket.assignedAgentName ||
                        'Not Assigned'
                      }
                      readOnly
                    />
                  </div>

                  <div className="dashboard-form-field">
                    <label>Created</label>

                    <input
                      type="text"
                      value={ticket.createdAt}
                      readOnly
                    />
                  </div>

                  <div className="dashboard-form-field">
                    <label>Updated</label>

                    <input
                      type="text"
                      value={ticket.updatedAt}
                      readOnly
                    />
                  </div>

                </div>

                <div className="dashboard-form-field dashboard-detail-description">

                  <label>Description</label>

                  <textarea
                    value={ticket.description}
                    readOnly
                  />

                </div>

              </div>

            </section>

            <section className="dashboard-section">

              <div className="dashboard-section-header">

                <h2>
                  <UserCheck size={17} />
                  Assign Agent
                </h2>

                <span>
                  {agents.length} team agents
                </span>

              </div>

              <div className="dashboard-form-card">

                <form
                  className="dashboard-form"
                  onSubmit={handleAssignTicket}
                >

                  <div className="dashboard-form-field">

                    <label htmlFor="assignedAgent">
                      Team Agent
                    </label>

                    <select
                      id="assignedAgent"
                      value={selectedAgentId}
                      onChange={(event) =>
                        setSelectedAgentId(
                          event.target.value
                        )
                      }
                    >

                      <option value="">
                        Select Agent
                      </option>

                      {agents.map((agent) => (

                        <option
                          key={agent.id}
                          value={agent.id}
                        >
                          {agent.username}
                        </option>

                      ))}

                    </select>

                  </div>

                  {agents.length === 0 && (
                    <div className="dashboard-error">
                      No agents are currently assigned to your team.
                    </div>
                  )}

                  {assignmentError && (
                    <div className="dashboard-error">
                      {assignmentError}
                    </div>
                  )}

                  {assignmentSuccess && (
                    <div className="dashboard-success">
                      <CheckCircle2 size={16} />
                      <span>
                        {assignmentSuccess}
                      </span>
                    </div>
                  )}

                  <div className="dashboard-form-actions">

                    <button
                      type="submit"
                      disabled={
                        assigning ||
                        agents.length === 0
                      }
                    >
                      <UserCheck size={16} />

                      {assigning
                        ? 'Assigning...'
                        : 'Assign Ticket'}
                    </button>

                  </div>

                </form>

              </div>

            </section>

            <section className="dashboard-section">

              <div className="dashboard-section-header">

                <h2>
                  <Flag size={17} />
                  Update Status
                </h2>

                <span>
                  Current: {ticket.status}
                </span>

              </div>

              <div className="dashboard-form-card">

                <form
                  className="dashboard-form"
                  onSubmit={handleUpdateStatus}
                >

                  <div className="dashboard-form-field">

                    <label htmlFor="ticketStatus">
                      Status
                    </label>

                    <select
                      id="ticketStatus"
                      value={selectedStatus}
                      onChange={(event) =>
                        setSelectedStatus(
                          event.target.value
                        )
                      }
                    >

                      <option value="">
                        Select Status
                      </option>

                      <option value="OPEN">
                        OPEN
                      </option>

                      <option value="IN_PROGRESS">
                        IN_PROGRESS
                      </option>

                      <option value="CLOSED">
                        CLOSED
                      </option>

                    </select>

                  </div>

                  {statusError && (
                    <div className="dashboard-error">
                      {statusError}
                    </div>
                  )}

                  {statusSuccess && (
                    <div className="dashboard-success">
                      <CheckCircle2 size={16} />
                      <span>
                        {statusSuccess}
                      </span>
                    </div>
                  )}

                  <div className="dashboard-form-actions">

                    <button
                      type="submit"
                      disabled={updatingStatus}
                    >
                      <Flag size={16} />

                      {updatingStatus
                        ? 'Updating...'
                        : 'Update Status'}
                    </button>

                  </div>

                </form>

              </div>

            </section>

            <section className="dashboard-section">

              <div className="dashboard-section-header">

                <h2>
                  <Ticket size={17} />
                  Update Priority
                </h2>

                <span>
                  Current: {ticket.priority}
                </span>

              </div>

              <div className="dashboard-form-card">

                <form
                  className="dashboard-form"
                  onSubmit={handleUpdatePriority}
                >

                  <div className="dashboard-form-field">

                    <label htmlFor="ticketPriority">
                      Priority
                    </label>

                    <select
                      id="ticketPriority"
                      value={selectedPriority}
                      onChange={(event) =>
                        setSelectedPriority(
                          event.target.value
                        )
                      }
                    >

                      <option value="">
                        Select Priority
                      </option>

                      <option value="LOW">
                        LOW
                      </option>

                      <option value="MEDIUM">
                        MEDIUM
                      </option>

                      <option value="HIGH">
                        HIGH
                      </option>

                      <option value="URGENT">
                        URGENT
                      </option>

                    </select>

                  </div>

                  {priorityError && (
                    <div className="dashboard-error">
                      {priorityError}
                    </div>
                  )}

                  {prioritySuccess && (
                    <div className="dashboard-success">
                      <CheckCircle2 size={16} />
                      <span>
                        {prioritySuccess}
                      </span>
                    </div>
                  )}

                  <div className="dashboard-form-actions">

                    <button
                      type="submit"
                      disabled={updatingPriority}
                    >
                      <Ticket size={16} />

                      {updatingPriority
                        ? 'Updating...'
                        : 'Update Priority'}
                    </button>

                  </div>

                </form>

              </div>

            </section>

            <section className="dashboard-section">

              <div className="dashboard-section-header">

                <h2>
                  <MessageSquare size={17} />
                  Comments
                </h2>

                <span>
                  {comments.length} comments
                </span>

              </div>

              {comments.length === 0 ? (

                <div className="dashboard-empty">
                  No comments found.
                </div>

              ) : (

                <div className="dashboard-list">

                  {comments.map((commentItem) => (

                    <div
                      key={commentItem.id}
                      className="dashboard-list-card"
                    >

                      <div className="dashboard-list-header">

                        <div>

                          <strong>
                            {commentItem.userName}
                          </strong>

                          <span className="crm-role-badge">
                            {commentItem.userRole}
                          </span>

                        </div>

                        <small>
                          {commentItem.createdAt}
                        </small>

                      </div>

                      <p>
                        {commentItem.comment}
                      </p>

                    </div>

                  ))}

                </div>

              )}

            </section>

            <section className="dashboard-section">

              <div className="dashboard-section-header">

                <h2>
                  Add Comment
                </h2>

                <span>
                  {comment.length}/1000
                </span>

              </div>

              <div className="dashboard-form-card">

                <form
                  className="dashboard-form"
                  onSubmit={handleAddComment}
                >

                  <div className="dashboard-form-field">

                    <label htmlFor="comment">
                      Comment
                    </label>

                    <textarea
                      id="comment"
                      value={comment}
                      onChange={(event) =>
                        setComment(event.target.value)
                      }
                      placeholder="Write your comment..."
                      rows="5"
                      maxLength="1000"
                    />

                  </div>

                  {commentError && (
                    <div className="dashboard-error">
                      {commentError}
                    </div>
                  )}

                  {commentSuccess && (
                    <div className="dashboard-success">
                      <CheckCircle2 size={16} />
                      <span>
                        {commentSuccess}
                      </span>
                    </div>
                  )}

                  <div className="dashboard-form-actions">

                    <button
                      type="submit"
                      disabled={addingComment}
                    >
                      <MessageSquare size={16} />

                      {addingComment
                        ? 'Adding...'
                        : 'Add Comment'}
                    </button>

                  </div>

                </form>

              </div>

            </section>

            <section className="dashboard-section">

              <div className="dashboard-section-header">

                <h2>
                  <Paperclip size={17} />
                  Attachments
                </h2>

                <span>
                  {attachments.length} files
                </span>

              </div>

              {attachments.length === 0 ? (

                <div className="dashboard-empty">
                  No attachments found.
                </div>

              ) : (

                <div className="dashboard-table-wrapper">

                  <table className="dashboard-table">

                    <thead>

                      <tr>
                        <th>File Name</th>
                        <th>Type</th>
                        <th>Size</th>
                        <th>Uploaded By</th>
                        <th>Created</th>
                        <th>Action</th>
                      </tr>

                    </thead>

                    <tbody>

                      {attachments.map((attachment) => (

                        <tr key={attachment.id}>

                          <td>
                            <strong>
                              {attachment.fileName}
                            </strong>
                          </td>

                          <td>
                            {attachment.contentType}
                          </td>

                          <td>
                            {formatFileSize(
                              attachment.fileSize
                            )}
                          </td>

                          <td>
                            {attachment.uploadedBy}
                          </td>

                          <td>
                            {attachment.createdAt}
                          </td>

                          <td>

                            <a
                              className="dashboard-view-button"
                              href={`http://localhost:8080${attachment.fileUrl}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              View File
                            </a>

                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

              )}

            </section>

            <button
              className="dashboard-back-button"
              onClick={() =>
                navigate('/manager-dashboard')
              }
            >
              <ArrowLeft size={17} />
              Back to Manager Dashboard
            </button>

          </>
        )}

      </div>

    </DashboardLayout>
  )
}

export default ManagerTicketDetails