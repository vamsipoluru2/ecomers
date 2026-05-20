package com.ecommerce.controller;

import com.ecommerce.model.User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import javax.servlet.http.HttpSession;

@Controller
public class HomeController {

    @GetMapping("/")
    public String index(HttpSession session) {
        User loggedUser = (User) session.getAttribute("loggedUser");

        // ✅ If user or admin is logged in and they come back to home, log them out automatically
        if (loggedUser != null) {
            session.invalidate();
            return "redirect:/login?logout=true";
        }

        // ✅ Show public home page for guests
        return "index";
    }
}
 