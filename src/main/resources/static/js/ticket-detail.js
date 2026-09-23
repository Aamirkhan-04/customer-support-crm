const ticketDetails = document.getElementById("ticketDetails");

const params = new URLSearchParams(window.location.search);
const ticketId = params.get("ticketId");


async function loadTicket() {

    if (!ticketId) {
        showError("Ticket ID is missing.");
        return;
    }

    try {

        const response = await fetch(
            `/api/tickets/${encodeURIComponent(ticketId)}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Unable to load ticket."
            );
        }

        displayTicket(data);

    } catch (error) {

        console.error(error);

        showError(error.message);
    }
}


function displayTicket(ticket) {

    const notesHtml = ticket.notes.length > 0
        ? ticket.notes.map(note => `
            <div class="note-item">
                ${escapeHtml(note)}
            </div>
        `).join("")
        : `
            <p class="detail-value">
                No notes added yet.
            </p>
        `;

    const statusClass = getStatusClass(ticket.status);

    ticketDetails.innerHTML = `

        <div class="detail-container">

            <div class="detail-header">

                <div>
                    <div class="detail-ticket-id">
                        ${escapeHtml(ticket.ticket_id)}
                    </div>

                    <div class="detail-subject">
                        ${escapeHtml(ticket.subject)}
                    </div>
                </div>

                <span class="status ${statusClass}">
                    ${escapeHtml(ticket.status)}
                </span>

            </div>


            <div class="detail-grid">

                <div class="detail-item">

                    <span class="detail-label">
                        Customer Name
                    </span>

                    <span class="detail-value">
                        ${escapeHtml(ticket.customer_name)}
                    </span>

                </div>


                <div class="detail-item">

                    <span class="detail-label">
                        Customer Email
                    </span>

                    <span class="detail-value">
                        ${escapeHtml(ticket.customer_email)}
                    </span>

                </div>

            </div>


            <div class="detail-description">

                <h3>Description</h3>

                <div class="description-box">
                    ${escapeHtml(ticket.description)}
                </div>

            </div>


            <div class="notes-section">

                <h3>Notes</h3>

                <div class="notes-list">
                    ${notesHtml}
                </div>

            </div>


            <div class="update-section">

                <h3>Update Ticket</h3>

                <form id="updateForm" class="update-form">

                    <div class="form-group">

                        <label for="status">
                            Status
                        </label>

                        <select id="status" required>

                            <option value="Open"
                                ${ticket.status === "Open" ? "selected" : ""}>
                                Open
                            </option>

                            <option value="In Progress"
                                ${ticket.status === "In Progress" ? "selected" : ""}>
                                In Progress
                            </option>

                            <option value="Closed"
                                ${ticket.status === "Closed" ? "selected" : ""}>
                                Closed
                            </option>

                        </select>

                    </div>


                    <div class="form-group">

                        <label for="notes">
                            Add Note
                        </label>

                        <textarea
                            id="notes"
                            rows="4"
                            placeholder="Add a note or comment..."
                        ></textarea>

                    </div>


                    <div id="updateMessage"></div>


                    <button
                        type="submit"
                        class="submit-button"
                    >
                        Update Ticket
                    </button>

                </form>

            </div>

        </div>
    `;

    document
        .getElementById("updateForm")
        .addEventListener("submit", updateTicket);
}


async function updateTicket(event) {

    event.preventDefault();

    const status = document.getElementById("status").value;
    const notes = document.getElementById("notes").value.trim();
    const updateMessage = document.getElementById("updateMessage");

    try {

        updateMessage.textContent = "Updating ticket...";

        const response = await fetch(
            `/api/tickets/${encodeURIComponent(ticketId)}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status: status,
                    notes: notes
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Unable to update ticket."
            );
        }

        updateMessage.textContent =
            "Ticket updated successfully.";

        await loadTicket();

    } catch (error) {

        console.error(error);

        updateMessage.textContent =
            error.message || "Unable to update ticket.";
    }
}


function getStatusClass(status) {

    switch (status) {

        case "Open":
            return "status-open";

        case "In Progress":
            return "status-progress";

        case "Closed":
            return "status-closed";

        default:
            return "";
    }
}


function escapeHtml(value) {

    const div = document.createElement("div");

    div.textContent = value ?? "";

    return div.innerHTML;
}


function showError(message) {

    ticketDetails.innerHTML = `
        <div class="detail-container">
            <p class="empty-message">
                ${escapeHtml(message)}
            </p>
        </div>
    `;
}


loadTicket();