const ticketForm = document.getElementById("ticketForm");
const formMessage = document.getElementById("formMessage");


ticketForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const customerName = document.getElementById("customerName").value.trim();
    const customerEmail = document.getElementById("customerEmail").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const description = document.getElementById("description").value.trim();

    const requestData = {
        customer_name: customerName,
        customer_email: customerEmail,
        subject: subject,
        description: description
    };

    try {

        formMessage.textContent = "Creating ticket...";

        const response = await fetch("/api/tickets", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to create ticket");
        }

        formMessage.textContent =
            `Ticket ${data.ticket_id} created successfully.`;

        ticketForm.reset();

        setTimeout(() => {
            window.location.href = "/";
        }, 1000);

    } catch (error) {

        console.error(error);

        formMessage.textContent =
            error.message || "Unable to create ticket.";
    }
});