package com.ecommerce.service;

import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class StatisticsService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public Map<String, Object> getStatistics() {
        Map<String, Object> stats = new HashMap<>();

        // Basic Statistics
        Long totalOrders = orderRepository.countTotalOrders();
        Double totalRevenue = orderRepository.findTotalRevenue();
        Long totalProducts = productRepository.count();
        Long totalUsers = userRepository.count();
        Long totalItemsSold = orderRepository.countTotalItemsSold();

        // Order Status Statistics
        Long paidOrders = orderRepository.countPaidOrders();
        Long pendingOrders = orderRepository.countPendingOrders();
        Long failedOrders = orderRepository.countFailedOrders();

        stats.put("totalOrders", totalOrders != null ? totalOrders : 0);
        stats.put("totalRevenue", totalRevenue != null ? totalRevenue : 0.0);
        stats.put("totalProducts", totalProducts != null ? totalProducts : 0);
        stats.put("totalUsers", totalUsers != null ? totalUsers : 0);
        stats.put("totalItemsSold", totalItemsSold != null ? totalItemsSold : 0);

        stats.put("paidOrders", paidOrders != null ? paidOrders : 0);
        stats.put("pendingOrders", pendingOrders != null ? pendingOrders : 0);
        stats.put("failedOrders", failedOrders != null ? failedOrders : 0);

        // Calculate averages
        double avgOrderValue = totalOrders > 0 && totalRevenue != null ? totalRevenue / totalOrders : 0.0;
        stats.put("avgOrderValue", Math.round(avgOrderValue * 100.0) / 100.0);

        // Products by Category
        Map<String, Long> categoryStats = productRepository.findAll().stream()
                .collect(Collectors.groupingBy(
                        product -> product.getCategory() != null ? product.getCategory() : "Uncategorized",
                        Collectors.counting()));

        List<Map<String, Object>> categories = categoryStats.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> cat = new HashMap<>();
                    cat.put("category", entry.getKey());
                    cat.put("count", entry.getValue());
                    return cat;
                })
                .sorted((a, b) -> Long.compare((Long) b.get("count"), (Long) a.get("count")))
                .limit(5)
                .collect(Collectors.toList());

        stats.put("topCategories", categories);

        return stats;
    }
}
