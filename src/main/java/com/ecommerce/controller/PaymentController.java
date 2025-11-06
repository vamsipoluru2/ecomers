// src/main/java/com/ecommerce/controller/PaymentController.java
package com.ecommerce.controller;

import com.ecommerce.model.Order;
import com.ecommerce.service.EmailService;
import com.ecommerce.service.InvoiceService;
import com.ecommerce.service.OrderService;
import com.ecommerce.service.PaymentService;
import com.ecommerce.service.SmsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.support.SessionStatus;

@Controller
@RequestMapping("/payment")
public class PaymentController {

    @Autowired private PaymentService paymentService;
    @Autowired private OrderService orderService;
    @Autowired private EmailService emailService;
    @Autowired private SmsService smsService;
    @Autowired private InvoiceService invoiceService;

    // Called by frontend on success
    @PostMapping("/verify")
    public String verify(@RequestParam Long localOrderId,
                         @RequestParam("razorpay_order_id") String razorpayOrderId,
                         @RequestParam("razorpay_payment_id") String razorpayPaymentId,
                         @RequestParam("razorpay_signature") String razorpaySignature,
                         Model model,
                         SessionStatus status) {

        Order order = orderService.getOrderById(localOrderId);
        if (order == null) {
            model.addAttribute("message", "Order not found");
            return "cart";
        }

        boolean ok = paymentService.verifySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
        if (!ok) {
            orderService.markFailed(localOrderId);
            model.addAttribute("message", "Payment verification failed");
            return "cart";
        }

        // Mark as paid
        orderService.markPaid(localOrderId, razorpayPaymentId, razorpaySignature);

        // Send email/SMS best-effort (your EmailService already tolerant)
        String subject = "Payment Success - Order #" + order.getId();
        String body = "Your payment was successful.\nOrder: " + order.getId() +
                "\nAmount: ₹" + order.getTotalAmount();
        // If you stored billing email/phone on order, use them here.
        // emailService.send(order.getCustomerEmail(), subject, body);

        // Clear cart session if any
        status.setComplete();

        model.addAttribute("order", orderService.getOrderById(localOrderId));
        return "order_confirmation";
    }
}
