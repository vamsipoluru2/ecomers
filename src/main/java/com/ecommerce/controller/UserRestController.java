// src/main/java/com/ecommerce/controller/UserRestController.java
package com.ecommerce.controller;

import com.ecommerce.api.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class UserRestController {

    // ✅ User home (replaces "user-home.jsp")
    @GetMapping("/home")
    public ResponseEntity<?> home() {
        // You can later add personalized data like user info, recommendations, etc.
        return ResponseEntity.ok(ApiResponse.ok(Map.of(
                "message", "Welcome to the user dashboard!",
                "info", "This is your home endpoint for Angular."
        )));
    }
}
