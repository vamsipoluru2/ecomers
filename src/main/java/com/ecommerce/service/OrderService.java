package com.ecommerce.service;

import com.ecommerce.model.CartItem;
import com.ecommerce.model.Order;
import com.ecommerce.model.OrderItem;
import com.ecommerce.model.PaymentStatus;
import com.ecommerce.model.User;
import com.ecommerce.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    // ✅ Creates a local order WITH the owning user
    @Transactional
    public Order placeOrder(List<CartItem> cartItems, User user) {
        if (cartItems == null || cartItems.isEmpty())
            return null;
        if (user == null || user.getId() == null) {
            throw new IllegalArgumentException("User must be logged in to place an order");
        }

        double total = cartItems.stream()
                .mapToDouble(CartItem::getTotalPrice)
                .sum();

        Order order = new Order(total);
        order.setOrderDate(LocalDateTime.now());
        order.setPaymentStatus(PaymentStatus.CREATED);

        // 🔴 CRITICAL: set the user here
        order.setUser(user);

        for (CartItem ci : cartItems) {
            OrderItem item = new OrderItem(order, ci.getProduct(), ci.getQuantity(), ci.getTotalPrice());
            order.getItems().add(item);
        }

        return orderRepository.save(order);
    }

    // ✅ Save/update (guard against missing user)
    @Transactional
    public Order save(Order order) {
        if (order.getUser() == null) {
            throw new IllegalStateException("Order must have a user before saving");
        }
        return orderRepository.save(order);
    }

    // ✅ When Razorpay order is created (store gateway orderId)
    @Transactional
    public Order markCreatedWithGateway(Order order, String razorpayOrderId) {
        order.setRazorpayOrderId(razorpayOrderId);
        order.setPaymentStatus(PaymentStatus.CREATED);
        return orderRepository.save(order);
    }

    // ✅ On Razorpay success + signature verified
    @Transactional
    public Order markPaid(Long orderId, String paymentId, String signature) {
        Order order = getOrderById(orderId);
        if (order == null)
            return null;
        order.setRazorpayPaymentId(paymentId);
        order.setRazorpaySignature(signature);
        order.setPaymentStatus(PaymentStatus.PAID);
        return orderRepository.save(order);
    }

    // ✅ On Razorpay failure/verification failure
    @Transactional
    public Order markFailed(Long orderId) {
        Order order = getOrderById(orderId);
        if (order == null)
            return null;
        order.setPaymentStatus(PaymentStatus.FAILED);
        return orderRepository.save(order);
    }

    // ✅ Fetch all orders with relationships eagerly loaded to avoid
    // LazyInitializationException
    @Transactional(readOnly = true)
    public List<Order> getAllOrders() {
        return orderRepository.findAllWithDetails();
    }

    // ✅ Fetch single order with relationships eagerly loaded
    @Transactional(readOnly = true)
    public Order getOrderById(Long id) {
        return orderRepository.findByIdWithDetails(id).orElse(null);
    }

    @Transactional
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
}
