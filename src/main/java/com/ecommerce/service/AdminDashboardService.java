package com.ecommerce.service;

import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class AdminDashboardService {

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProducts", 12);
        stats.put("totalOrders", 24);
        stats.put("totalRevenue", 18500.0);
        return stats;
    }
}
