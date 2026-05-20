// src/main/java/com/ecommerce/controller/PaymentRestController.java
package com.ecommerce.controller;

import com.ecommerce.api.ApiResponse;
import com.ecommerce.model.Order;
import com.ecommerce.service.EmailService;
import com.ecommerce.service.InvoiceService;
import com.ecommerce.service.OrderService;
import com.ecommerce.service.PaymentService;
import com.ecommerce.service.SmsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.support.SessionStatus;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class PaymentRestController {

    @Autowired private PaymentService paymentService;
    @Autowired private OrderService orderService;
    @Autowired private EmailService emailService;
    @Autowired private SmsService smsService;
    @Autowired private InvoiceService invoiceService;

    // ✅ Called by Angular frontend after Razorpay payment success
    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestBody Map<String, String> payload,
                                    SessionStatus status) {
        try {
            Long localOrderId = Long.parseLong(payload.get("localOrderId"));
            String razorpayOrderId = payload.get("razorpay_order_id");
            String razorpayPaymentId = payload.get("razorpay_payment_id");
            String razorpaySignature = payload.get("razorpay_signature");

            Order order = orderService.getOrderById(localOrderId);
            if (order == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.fail("Order not found"));
            }

            // Verify signature
            boolean ok = paymentService.verifySignature(
                    razorpayOrderId,
                    razorpayPaymentId,
                    razorpaySignature
            );

            if (!ok) {
                orderService.markFailed(localOrderId);
                return ResponseEntity.badRequest()
                        .body(ApiResponse.fail("Payment verification failed"));
            }

            // ✅ Mark order as paid
            orderService.markPaid(localOrderId, razorpayPaymentId, razorpaySignature);

            // ✅ Send email/SMS (best-effort, not mandatory)
            try {
                String subject = "Payment Success - Order #" + order.getId();
                String body = "Your payment was successful.\nOrder ID: " + order.getId() +
                              "\nAmount: ₹" + order.getTotalAmount();

                // Uncomment these if your order contains valid contact info:
                // emailService.send(order.getCustomerEmail(), subject, body);
                // smsService.send(order.getCustomerPhone(), "Payment received for Order #" + order.getId());
            } catch (Exception ex) {
                System.err.println("Email/SMS sending failed: " + ex.getMessage());
            }

            // ✅ Clear cart session
            status.setComplete();

            // ✅ Return JSON confirmation to Angular
            return ResponseEntity.ok(ApiResponse.ok(Map.of(
                    "message", "Payment verified successfully",
                    "orderId", order.getId(),
                    "status", "PAID"
            )));

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.fail("Payment verification error: " + e.getMessage()));
        }
    }
}
