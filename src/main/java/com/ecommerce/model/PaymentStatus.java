package com.ecommerce.model;

public enum PaymentStatus {
    CREATED,  // order created, waiting for payment
    PAID,     // payment verified
    FAILED    // payment failed or signature invalid
}
