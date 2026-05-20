// src/main/java/com/ecommerce/controller/CheckoutController.java
package com.ecommerce.controller;

import com.ecommerce.model.BillingInfo;
import com.ecommerce.model.Order;
import com.ecommerce.model.PaymentInfo;
import com.ecommerce.model.PaymentMethod;
import com.ecommerce.model.PaymentStatus;
import com.ecommerce.model.User;
import com.ecommerce.service.CartService;
import com.ecommerce.service.OrderService;
import com.ecommerce.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.support.SessionStatus;

import javax.servlet.http.HttpSession;

@Controller
@RequestMapping("/checkout")
@SessionAttributes("cart")
public class CheckoutController {

    @Autowired private CartService cartService;
    @Autowired private OrderService orderService;
    @Autowired private PaymentService paymentService;

    // Public Razorpay key to be used by Checkout.js on the payment page
    @Value("${razorpay.keyId}")
    private String razorpayKeyId;

    // Show checkout form
    @GetMapping
    public String showCheckout(Model model) {
        if (cartService.getCart().isEmpty()) {
            model.addAttribute("message", "Your cart is empty");
            return "cart";
        }
        model.addAttribute("cartItems", cartService.getCart());
        model.addAttribute("total", cartService.getTotal());
        model.addAttribute("billing", new BillingInfo());
        model.addAttribute("payment", new PaymentInfo());
        model.addAttribute("methods", PaymentMethod.values());
        return "checkout";
    }

    // Place order -> create Razorpay order -> open payment page
    @PostMapping
    public String placeOrder(@ModelAttribute("billing") BillingInfo billing,
                             @ModelAttribute("payment") PaymentInfo payment,
                             Model model,
                             HttpSession session) {

        if (cartService.getCart().isEmpty()) {
            model.addAttribute("message", "Cart empty!");
            return "cart";
        }

        // Require logged-in user
        User loggedUser = (User) session.getAttribute("loggedUser");
        if (loggedUser == null) {
            return "redirect:/login";
        }

        // 1) Create local order (status = CREATED) with owner set
        Order order = orderService.placeOrder(cartService.getCart(), loggedUser);
        if (order == null) {
            model.addAttribute("message", "Could not create order.");
            return "cart";
        }

        order.setPaymentStatus(PaymentStatus.CREATED);
        orderService.save(order);

        // 2) Create Razorpay order (amount in paise)
        long amountPaise = Math.round(order.getTotalAmount() * 100.0);

        try {
            var rpOrder = paymentService.createRazorpayOrder(amountPaise, "rcpt_" + order.getId());

            // Persist gateway order id
            orderService.markCreatedWithGateway(order, rpOrder.get("id"));

            // 3) Data needed by the payment view (Checkout.js)
            model.addAttribute("order", order);
            model.addAttribute("razorpayOrderId", rpOrder.get("id"));
            model.addAttribute("amount", amountPaise);
            model.addAttribute("billing", billing);             // prefill name/email/phone
            model.addAttribute("razorpayKeyId", razorpayKeyId); // public key for Checkout.js

            // ⚠️ Clear cart only after successful payment verification callback
            return "payment";
        } catch (Exception e) {
            model.addAttribute("message", "Unable to start payment: " + e.getMessage());
            return "cart";
        }
    }

    // (Optional) If anyone hits /checkout/confirm directly, redirect to /checkout
    @GetMapping("/confirm")
    public String confirmRedirect() {
        return "redirect:/checkout";
    }
}
