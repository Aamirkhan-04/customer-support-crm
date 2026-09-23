const ticketTableBody = document.getElementById("ticketTableBody");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");


async function loadTickets() {

    const search = searchInput.value.trim();
    const status = statusFilter.value;

    const params = new URLSearchParams();

    if (search) {
        params.append("search", search);
    }

    if (status) {
        params.append("status", status);
    }

    const queryString = params.toString();

    const url = queryString
        ? `/api/tickets?${queryString}`
        : "/api/tickets";

    try {

        ticketTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-message">
                    Loading tickets...
                </td>
            </tr>
        `;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to load tickets");
        }

        const tickets = await response.json();

        displayTickets(tickets);

    } catch (error) {

        console.error(error);

        ticketTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-message">
                    Unable to load tickets.
                </td>
            </tr>
        `;
    }
}


function displayTickets(tickets) {

    if (tickets.length === 0) {

        ticketTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-message">
                    No tickets found.
                </td>
            </tr>
        `;

        return;
    }

    ticketTableBody.innerHTML = tickets.map(ticket => {

        const statusClass = getStatusClass(ticket.status);

        return `
            <tr>

                <td>
                    <a
                        href="/ticket-detail.html?ticketId=${encodeURIComponent(ticket.ticket_id)}"
                        class="ticket-link"
                    >
                        ${escapeHtml(ticket.ticket_id)}
                    </a>
                </td>

                <td>
                    ${escapeHtml(ticket.customer_name)}
                </td>

                <td>
                    ${escapeHtml(ticket.subject)}
                </td>

                <td>
                    <span class="status ${statusClass}">
                        ${escapeHtml(ticket.status)}
                    </span>
                </td>

                <td>
                    ${formatDate(ticket.created_at)}
                </td>

            </tr>
        `;

    }).join("");
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


function formatDate(dateTime) {

    if (!dateTime) {
        return "-";
    }

    return new Date(dateTime).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short"
    });
}


function escapeHtml(value) {

    const div = document.createElement("div");

    div.textContent = value ?? "";

    return div.innerHTML;
}


searchInput.addEventListener("input", loadTickets);

statusFilter.addEventListener("change", loadTickets);


loadTickets();