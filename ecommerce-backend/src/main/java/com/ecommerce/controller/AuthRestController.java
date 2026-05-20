// src/main/java/com/ecommerce/controller/AuthRestController.java
package com.ecommerce.controller;

import com.ecommerce.api.ApiResponse;
import com.ecommerce.model.User;
import com.ecommerce.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class AuthRestController {

    @Autowired
    private UserService userService;

    // ✅ (was GET /login view) — keep same behavior: clear previous session
    @GetMapping("/login")
    public ResponseEntity<?> showLoginPage(HttpSession session) {
        session.invalidate(); // Clear previous session
        return ResponseEntity.ok(ApiResponse.ok(Map.of("message", "login_page")));
    }

    // ✅ Handle login submission (was POST /login -> redirects)
    // Now returns JSON + sets session exactly like before.
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> body,
                                       HttpSession session) {
        String email = body.get("email");
        String password = body.get("password");

        User user = userService.login(email, password);

        if (user != null) {
            session.setAttribute("loggedUser", user);

            // Preserve original redirect decision, but send it as data for Angular to navigate.
            String redirect = "ADMIN".equalsIgnoreCase(user.getRole())
                    ? "/admin/dashboard"
                    : "/user/home";

            return ResponseEntity.ok(ApiResponse.ok(Map.of(
                    "userId", user.getId(),
                    "name", user.getName(),
                    "email", user.getEmail(),
                    "role", user.getRole(),
                    "redirect", redirect
            )));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.fail("Invalid email or password!"));
        }
    }

    // ✅ (was GET /register view) — Angular renders its own form; return an empty template if you want
    @GetMapping("/register")
    public ResponseEntity<?> showRegisterPage() {
        return ResponseEntity.ok(ApiResponse.ok(Map.of("template", new User())));
    }

    // ✅ Handle registration (was POST /register -> go to login view)
    // Keep same logic: DO NOT auto-login; just create and tell Angular to go to login.
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userService.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.fail("Email already exists! Please log in."));
        }

        user.setRole("USER");
        userService.register(user);

        // Same semantics as before: after registration, show login.
        return ResponseEntity.ok(ApiResponse.ok(Map.of(
                "message", "Registration successful! Please login.",
                "next", "/login"
        )));
    }

    // ✅ Logout (was GET /logout -> redirect)
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(ApiResponse.ok(Map.of("message", "Logged out")));
    }

    // ✅ Helper for Angular to check session (was not in JSP version, but useful)
    @GetMapping("/me")
    public ResponseEntity<?> me(HttpSession session) {
        User user = (User) session.getAttribute("loggedUser");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.fail("Not logged in"));
        }
        return ResponseEntity.ok(ApiResponse.ok(Map.of(
                "userId", user.getId(),
                "name", user.getName(),
                "email", user.getEmail(),
                "role", user.getRole()
        )));
    }
}
