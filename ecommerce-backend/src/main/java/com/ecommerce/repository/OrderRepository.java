package com.ecommerce.repository;

import com.ecommerce.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.totalAmount IS NOT NULL")
    Double findTotalRevenue();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.totalAmount IS NOT NULL")
    Long countTotalOrders();

    @Query("SELECT SUM(oi.quantity) FROM OrderItem oi")
    Long countTotalItemsSold();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.paymentStatus = 'PAID'")
    Long countPaidOrders();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.paymentStatus = 'CREATED'")
    Long countPendingOrders();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.paymentStatus = 'FAILED'")
    Long countFailedOrders();

    // ✅ Fetch all orders with all relationships eagerly loaded to avoid
    // LazyInitializationException
    // Only fetch orders with non-null totalAmount to prevent primitive type
    // exceptions
    @Query("SELECT DISTINCT o FROM Order o " +
            "LEFT JOIN FETCH o.user " +
            "LEFT JOIN FETCH o.items oi " +
            "LEFT JOIN FETCH oi.product " +
            "WHERE o.totalAmount IS NOT NULL")
    List<Order> findAllWithDetails();

    // ✅ Fetch single order with all relationships eagerly loaded
    @Query("SELECT o FROM Order o " +
            "LEFT JOIN FETCH o.user " +
            "LEFT JOIN FETCH o.items oi " +
            "LEFT JOIN FETCH oi.product " +
            "WHERE o.id = :id AND o.totalAmount IS NOT NULL")
    Optional<Order> findByIdWithDetails(Long id);
}
