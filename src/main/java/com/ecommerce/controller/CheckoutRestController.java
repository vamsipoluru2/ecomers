// src/main/java/com/ecommerce/controller/CheckoutRestController.java
package com.ecommerce.controller;

import com.ecommerce.api.ApiResponse;
import com.ecommerce.model.BillingInfo;
import com.ecommerce.model.Order;
import com.ecommerce.model.PaymentMethod;
import com.ecommerce.model.PaymentStatus;
import com.ecommerce.model.User;
import com.ecommerce.service.CartService;
import com.ecommerce.service.OrderService;
import com.ecommerce.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.Map;

@RestController
@RequestMapping("/api/checkout")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class CheckoutRestController {

    @Autowired
    private CartService cartService;
    @Autowired
    private OrderService orderService;
    @Autowired
    private PaymentService paymentService;

    @Value("${razorpay.keyId}")
    private String razorpayKeyId;

    // ✅ Show checkout details
    @GetMapping
    public ResponseEntity<?> showCheckout() {
        if (cartService.getCart().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.fail("Your cart is empty"));
        }

        return ResponseEntity.ok(ApiResponse.ok(Map.of(
                "cartItems", cartService.getCart(),
                "total", cartService.getTotal(),
                "methods", PaymentMethod.values())));
    }

    // ✅ Create Razorpay order
    @PostMapping
    public ResponseEntity<?> placeOrder(@RequestBody Map<String, Object> payload,
            HttpSession session) {

        if (cartService.getCart().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.fail("Cart empty!"));
        }

        // Check user session
        User loggedUser = (User) session.getAttribute("loggedUser");
        if (loggedUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.fail("Please login to continue."));
        }

        // ✅ Map billing info properly
        BillingInfo billing = new BillingInfo();
        Object billingObj = payload.get("billing");
        if (billingObj instanceof Map<?, ?> b) {
            billing.setFullName((String) b.getOrDefault("fullName", null));
            billing.setEmail((String) b.getOrDefault("email", null));
            billing.setContactNumber((String) b.getOrDefault("contactNumber", null));
            billing.setAddressLine1((String) b.getOrDefault("addressLine1", null));
            billing.setAddressLine2((String) b.getOrDefault("addressLine2", null));
            billing.setCity((String) b.getOrDefault("city", null));
            billing.setState((String) b.getOrDefault("state", null));
            billing.setPostalCode((String) b.getOrDefault("postalCode", null));
        }

        // ✅ 1. Create local order
        Order order = orderService.placeOrder(cartService.getCart(), loggedUser);
        if (order == null) {
            return ResponseEntity.internalServerError().body(ApiResponse.fail("Could not create order."));
        }

        order.setPaymentStatus(PaymentStatus.CREATED);
        orderService.save(order);

        // ✅ 2. Create Razorpay order
        Double totalAmount = order.getTotalAmount();
        if (totalAmount == null || totalAmount <= 0) {
            return ResponseEntity.badRequest().body(ApiResponse.fail("Invalid order amount"));
        }
        long amountPaise = Math.round(totalAmount * 100.0);

        try {
            var rpOrder = paymentService.createRazorpayOrder(amountPaise, "rcpt_" + order.getId());
            orderService.markCreatedWithGateway(order, rpOrder.get("id"));

            // ✅ 3. Return data for Angular checkout
            return ResponseEntity.ok(ApiResponse.ok(Map.of(
                    "orderId", order.getId(),
                    "razorpayOrderId", rpOrder.get("id"),
                    "amount", amountPaise,
                    "currency", rpOrder.get("currency"),
                    "razorpayKeyId", razorpayKeyId,
                    "user", Map.of(
                            "name", loggedUser.getName(),
                            "email", loggedUser.getEmail()))));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.fail("Unable to start payment: " + e.getMessage()));
        }
    }

    // ✅ Confirm payment
    @PostMapping("/confirm")
    public ResponseEntity<?> confirm(@RequestBody Map<String, String> payload) {
        try {
            Long orderId = Long.parseLong(payload.get("orderId"));
            String paymentId = payload.get("razorpay_payment_id");
            String signature = payload.get("razorpay_signature");

            // ⚙️ Optional: verify signature if needed
            // boolean verified = paymentService.verifySignature(payload);
            // if (!verified) {
            // orderService.markFailed(orderId);
            // return ResponseEntity.badRequest().body(ApiResponse.fail("Payment
            // verification failed"));
            // }

            orderService.markPaid(orderId, paymentId, signature);
            cartService.clear();

            return ResponseEntity.ok(ApiResponse.ok(Map.of(
                    "message", "Payment successful",
                    "orderId", orderId,
                    "status", PaymentStatus.PAID.toString())));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.fail("Error confirming payment: " + e.getMessage()));
        }
    }

    // ✅ Legacy redirect (for safety)
    @GetMapping("/confirm")
    public ResponseEntity<?> confirmRedirect() {
        return ResponseEntity.ok(ApiResponse.ok(Map.of("redirect", "/checkout")));
    }
}
