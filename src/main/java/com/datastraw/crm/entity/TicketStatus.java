package com.datastraw.crm.entity;

import java.util.Arrays;

public enum TicketStatus {

    OPEN("Open"),
    IN_PROGRESS("In Progress"),
    CLOSED("Closed");

    private final String displayName;

    TicketStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static TicketStatus from(String value) {

        return Arrays.stream(values())
                .filter(status ->
                        status.displayName.equalsIgnoreCase(value.trim())
                        || status.name().equalsIgnoreCase(value.trim())
                        || status.name().replace("_", " ")
                                .equalsIgnoreCase(value.trim()))
                .findFirst()
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Invalid status. Allowed values: Open, In Progress, Closed"));
    }
}