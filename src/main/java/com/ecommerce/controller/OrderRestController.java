// src/main/java/com/ecommerce/controller/OrderRestController.java
package com.ecommerce.controller;

import com.ecommerce.api.ApiResponse;
import com.ecommerce.model.Order;
import com.ecommerce.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class OrderRestController {

    @Autowired
    private OrderService orderService;

    // ✅ 1. List all orders
    @GetMapping
    public ResponseEntity<?> listOrders() {
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok(ApiResponse.ok(Map.of("orders", orders)));
    }

    // ✅ 2. View single order details
    @GetMapping("/{id}")
    public ResponseEntity<?> viewOrder(@PathVariable Long id) {
        Order order = orderService.getOrderById(id);
        if (order == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.fail("Order not found"));
        }
        return ResponseEntity.ok(ApiResponse.ok(Map.of("order", order)));
    }

    // ✅ 3. Delete an order
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long id) {
        try {
            orderService.deleteOrder(id);
            return ResponseEntity.ok(ApiResponse.ok(Map.of(
                "message", "Order deleted successfully",
                "deletedOrderId", id
            )));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.fail("Error deleting order: " + e.getMessage()));
        }
    }
}
