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

function CustomerTicketDetails() {

  const { ticketId } = useParams()
  const navigate = useNavigate()

  const [ticket, setTicket] = useState(null)
  const [comments, setComments] = useState([])
  const [attachments, setAttachments] = useState([])

  const [error, setError] = useState('')
  const [commentError, setCommentError] = useState('')
  const [attachmentError, setAttachmentError] = useState('')

  const [comment, setComment] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)

  const [successMessage, setSuccessMessage] = useState('')
  const [attachmentSuccess, setAttachmentSuccess] = useState('')

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)

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
            ticketData.message ||
            'Failed to load ticket'
          )
        }

        setTicket(ticketData)

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
            commentData.message ||
            'Failed to load comments'
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

        const attachmentData =
          await attachmentResponse.json()

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

  const handleAddComment = async (event) => {

    event.preventDefault()

    setCommentError('')
    setSuccessMessage('')

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

    setSubmitting(true)

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
      setSuccessMessage(
        'Comment added successfully'
      )

    } catch (error) {

      setCommentError(error.message)

    } finally {

      setSubmitting(false)
    }
  }

  const handleFileChange = (event) => {

    const file = event.target.files[0]

    setAttachmentError('')
    setAttachmentSuccess('')

    if (!file) {
      setSelectedFile(null)
      return
    }

    if (file.size > 5 * 1024 * 1024) {

      setSelectedFile(null)

      setAttachmentError(
        'File size must not exceed 5 MB'
      )

      return
    }

    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'text/plain'
    ]

    if (!allowedTypes.includes(file.type)) {

      setSelectedFile(null)

      setAttachmentError(
        'Only PDF, JPG, JPEG, PNG and TXT files are allowed'
      )

      return
    }

    setSelectedFile(file)
  }

  const handleUploadAttachment = async (event) => {

    event.preventDefault()

    setAttachmentError('')
    setAttachmentSuccess('')

    if (!selectedFile) {
      setAttachmentError(
        'Please select a file'
      )
      return
    }

    const token = localStorage.getItem('token')

    if (!token) {
      navigate('/login')
      return
    }

    setUploading(true)

    try {

      const formData = new FormData()

      formData.append(
        'file',
        selectedFile
      )

      const response = await fetch(
        `http://localhost:8080/api/tickets/${ticketId}/attachments`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
          'Failed to upload attachment'
        )
      }

      setAttachments((previousAttachments) => [
        ...previousAttachments,
        data
      ])

      setSelectedFile(null)

      setAttachmentSuccess(
        'Attachment uploaded successfully'
      )

      event.target.reset()

    } catch (error) {

      setAttachmentError(error.message)

    } finally {

      setUploading(false)
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

      setError(
        'Please allow pop-ups to view the attachment.'
      )

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

        let message =
          'Failed to open attachment'

        try {

          const data =
            await response.json()

          message =
            data.message || message

        } catch {
          // Response is not JSON
        }

        throw new Error(message)
      }

      const blob =
        await response.blob()

      const blobUrl =
        URL.createObjectURL(blob)

      newTab.location.href =
        blobUrl

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
            View Ticket
          </h1>

          <p>
            View your ticket information and support history.
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

                    <label>
                      Ticket ID
                    </label>

                    <input
                      type="text"
                      value={ticket.ticketId}
                      readOnly
                    />

                  </div>

                  <div className="dashboard-form-field">

                    <label>
                      Subject
                    </label>

                    <input
                      type="text"
                      value={ticket.subject}
                      readOnly
                    />

                  </div>

                  <div className="dashboard-form-field">

                    <label>
                      Status
                    </label>

                    <input
                      type="text"
                      value={ticket.status}
                      readOnly
                    />

                  </div>

                  <div className="dashboard-form-field">

                    <label>
                      Priority
                    </label>

                    <input
                      type="text"
                      value={ticket.priority}
                      readOnly
                    />

                  </div>

                  <div className="dashboard-form-field">

                    <label>
                      Customer
                    </label>

                    <input
                      type="text"
                      value={ticket.customerName}
                      readOnly
                    />

                  </div>

                  <div className="dashboard-form-field">

                    <label>
                      Assigned Agent
                    </label>

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

                    <label>
                      Created
                    </label>

                    <input
                      type="text"
                      value={ticket.createdAt}
                      readOnly
                    />

                  </div>

                  <div className="dashboard-form-field">

                    <label>
                      Updated
                    </label>

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
                        setComment(
                          event.target.value
                        )
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

                  {successMessage && (
                    <div className="dashboard-success">
                      {successMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="dashboard-primary-button"
                    disabled={submitting}
                  >
                    {submitting
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

              {attachmentError && (
                <div className="dashboard-error">
                  {attachmentError}
                </div>
              )}

              {attachmentSuccess && (
                <div className="dashboard-success">
                  {attachmentSuccess}
                </div>
              )}

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

            {/* UPLOAD ATTACHMENT */}

            <section className="dashboard-section">

              <div className="dashboard-section-header">

                <h2>
                  <Paperclip size={17} />
                  Upload Attachment
                </h2>

                <span>
                  Maximum 5 MB
                </span>

              </div>

              <div className="dashboard-form-card">

                <form
                  onSubmit={handleUploadAttachment}
                >

                  <div className="dashboard-form-field">

                    <label>
                      Select File
                    </label>

                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png,.txt"
                    />

                  </div>

                  <button
                    type="submit"
                    className="dashboard-primary-button"
                    disabled={uploading}
                  >
                    {uploading
                      ? 'Uploading...'
                      : 'Upload Attachment'}
                  </button>

                </form>

              </div>

            </section>

            <button
              className="dashboard-back-button"
              onClick={() =>
                navigate('/customer/tickets')
              }
            >
              <ArrowLeft size={17} />
              Back to My Tickets
            </button>

          </>
        )}

      </div>

    </DashboardLayout>
  )
}

export default CustomerTicketDetails