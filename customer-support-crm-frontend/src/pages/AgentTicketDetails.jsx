import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Ticket,
  ArrowLeft,
  MessageSquare,
  Paperclip
} from 'lucide-react'

import DashboardLayout from '../components/DashboardLayout'
import '../styles/dashboard.css'

function AgentTicketDetails() {

  const { ticketId } = useParams()
  const navigate = useNavigate()

  const [ticket, setTicket] = useState(null)
  const [comments, setComments] = useState([])
  const [attachments, setAttachments] = useState([])

  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedPriority, setSelectedPriority] = useState('')

  const [comment, setComment] = useState('')

  const [error, setError] = useState('')

  const [statusError, setStatusError] = useState('')
  const [statusSuccess, setStatusSuccess] = useState('')

  const [priorityError, setPriorityError] = useState('')
  const [prioritySuccess, setPrioritySuccess] = useState('')

  const [commentError, setCommentError] = useState('')
  const [commentSuccess, setCommentSuccess] = useState('')

  const [loading, setLoading] = useState(true)
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

      } catch (error) {

        setError(error.message)

      } finally {

        setLoading(false)
      }
    }

    fetchTicketDetails()

  }, [ticketId, navigate])

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
          data.message || 'Failed to update status'
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
          data.message || 'Failed to update priority'
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
          data.message || 'Failed to add comment'
        )
      }

      setComments((previousComments) => [
        ...previousComments,
        data
      ])

      setComment('')
      setCommentSuccess('Comment added successfully')

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

  const handleViewAttachment = async (attachment) => {

    const token = localStorage.getItem('token')

    if (!token) {
      navigate('/login')
      return
    }

    const newTab = window.open('', '_blank')

    if (!newTab) {
      setError('Please allow pop-ups to view the attachment.')
      return
    }

    try {

      const response = await fetch(
        `http://localhost:8080/api/attachments/${attachment.id}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (!response.ok) {

        newTab.close()

        let message = 'Failed to open attachment'

        try {
          const data = await response.json()
          message = data.message || message
        } catch {
          // Response is not JSON
        }

        throw new Error(message)
      }

      const blob = await response.blob()

      const blobUrl = URL.createObjectURL(blob)

      newTab.location.href = blobUrl

      setTimeout(() => {
        URL.revokeObjectURL(blobUrl)
      }, 60000)

    } catch (error) {

      newTab.close()
      setError(error.message)

    }
  }

  return (
    <DashboardLayout>

      <div className="dashboard-page">

        <div className="dashboard-page-header">

          <h1>
            Manage Ticket
          </h1>

          <p>
            Update ticket status, priority and communicate with the customer.
          </p>

        </div>

        {loading && (
          <div className="dashboard-loading">
            Loading ticket...
          </div>
        )}

        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        {ticket && !loading && !error && (
          <>

            {/* TICKET INFORMATION */}

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

                  <label>
                    Description
                  </label>

                  <textarea
                    value={ticket.description}
                    readOnly
                  />

                </div>

              </div>

            </section>

            {/* STATUS + PRIORITY */}

            <section className="dashboard-section">

              <div className="dashboard-section-header">

                <h2>
                  Ticket Operations
                </h2>

                <span>
                  Update Ticket
                </span>

              </div>

              <div className="dashboard-form-card">

                <div className="dashboard-form-grid">

                  <div className="dashboard-form-field">

                    <label>
                      Update Status
                    </label>

                    <form onSubmit={handleUpdateStatus}>

                      <select
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

                      <button
                        type="submit"
                        className="dashboard-primary-button"
                        disabled={updatingStatus}
                      >
                        {updatingStatus
                          ? 'Updating...'
                          : 'Update Status'}
                      </button>

                    </form>

                    {statusError && (
                      <div className="dashboard-error">
                        {statusError}
                      </div>
                    )}

                    {statusSuccess && (
                      <div className="dashboard-success">
                        {statusSuccess}
                      </div>
                    )}

                  </div>

                  <div className="dashboard-form-field">

                    <label>
                      Update Priority
                    </label>

                    <form onSubmit={handleUpdatePriority}>

                      <select
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

                      <button
                        type="submit"
                        className="dashboard-primary-button"
                        disabled={updatingPriority}
                      >
                        {updatingPriority
                          ? 'Updating...'
                          : 'Update Priority'}
                      </button>

                    </form>

                    {priorityError && (
                      <div className="dashboard-error">
                        {priorityError}
                      </div>
                    )}

                    {prioritySuccess && (
                      <div className="dashboard-success">
                        {prioritySuccess}
                      </div>
                    )}

                  </div>

                </div>

              </div>

            </section>

            {/* COMMENTS */}

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

            {/* ADD COMMENT */}

            <section className="dashboard-section">

              <div className="dashboard-section-header">

                <h2>
                  <MessageSquare size={17} />
                  Add Comment
                </h2>

                <span>
                  {comment.length}/1000
                </span>

              </div>

              <div className="dashboard-form-card">

                <form onSubmit={handleAddComment}>

                  <div className="dashboard-form-field">

                    <label>
                      Comment
                    </label>

                    <textarea
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
                      {commentSuccess}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="dashboard-primary-button"
                    disabled={addingComment}
                  >
                    {addingComment
                      ? 'Adding...'
                      : 'Add Comment'}
                  </button>

                </form>

              </div>

            </section>

            {/* ATTACHMENTS */}

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

                            <button
                              type="button"
                              className="dashboard-view-button"
                              onClick={() =>
                                handleViewAttachment(
                                  attachment
                                )
                              }
                            >
                              View File
                            </button>

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
                navigate('/agent-dashboard')
              }
            >
              <ArrowLeft size={17} />
              Back to Agent Dashboard
            </button>

          </>
        )}

      </div>

    </DashboardLayout>
  )
}

export default AgentTicketDetails