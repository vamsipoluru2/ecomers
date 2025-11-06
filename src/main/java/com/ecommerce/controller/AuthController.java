package com.ecommerce.controller;

import com.ecommerce.model.User;
import com.ecommerce.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;

@Controller
public class AuthController {

    @Autowired
    private UserService userService;

    // ✅ Show login form
    @GetMapping("/login")
    public String showLoginPage(HttpSession session) {
        session.invalidate(); // Clear previous session
        return "login"; // goes to /WEB-INF/views/login.jsp
    }

    // ✅ Handle login submission
    @PostMapping("/login")
    public String loginUser(@RequestParam("email") String email,
                            @RequestParam("password") String password,
                            HttpSession session,
                            Model model) {

        User user = userService.login(email, password);

        if (user != null) {
            session.setAttribute("loggedUser", user);

            if ("ADMIN".equalsIgnoreCase(user.getRole())) {
                return "redirect:/admin/dashboard";
            } else {
                return "redirect:/user/home";
            }
        } else {
            model.addAttribute("error", "Invalid email or password!");
            return "login";
        }
    }

    // ✅ Show registration form
    @GetMapping("/register")
    public String showRegisterPage(Model model) {
        model.addAttribute("user", new User());
        return "register"; // goes to /WEB-INF/views/register.jsp
    }

    // ✅ Handle registration form
    @PostMapping("/register")
    public String registerUser(@ModelAttribute("user") User user, Model model) {
        if (userService.existsByEmail(user.getEmail())) {
            model.addAttribute("error", "Email already exists! Please log in.");
            return "register";
        }

        user.setRole("USER");
        userService.register(user);

        model.addAttribute("message", "Registration successful! Please login.");
        return "login";
    }

    // ✅ Logout
    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/login?logout=true";
    }
}
 