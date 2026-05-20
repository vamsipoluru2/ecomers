// src/main/java/com/ecommerce/controller/HomeRestController.java
package com.ecommerce.controller;

import com.ecommerce.api.ApiResponse;
import com.ecommerce.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.Map;

@RestController
@RequestMapping("/api/home")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class HomeRestController {

    @GetMapping
    public ResponseEntity<?> index(HttpSession session) {
        User loggedUser = (User) session.getAttribute("loggedUser");

        // ✅ If user or admin is logged in and they come back to home, log them out automatically
        if (loggedUser != null) {
            session.invalidate();
            return ResponseEntity.ok(ApiResponse.ok(Map.of(
                "message", "User logged out automatically due to returning to home",
                "redirect", "/login"
            )));
        }

        // ✅ Show public home page for guests
        return ResponseEntity.ok(ApiResponse.ok(Map.of(
            "message", "Welcome to the eCommerce API Home",
            "guest", true
        )));
    }
}
