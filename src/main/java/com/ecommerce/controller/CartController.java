package com.ecommerce.controller;

import com.ecommerce.model.Product;
import com.ecommerce.service.CartService;
import com.ecommerce.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/cart")
public class CartController {

    @Autowired private CartService cartService;
    @Autowired private ProductService productService;

    // Show cart
    @GetMapping
    public String viewCart(Model model) {
        model.addAttribute("cart", cartService.getCart());
        model.addAttribute("total", cartService.getTotal());
        return "cart";
    }

    // Add to Cart -> stay on Cart page (NOT redirect to checkout)
    @GetMapping("/add/{id}")
    public String addToCart(@PathVariable Long id) {
        Product product = productService.getById(id);
        if (product != null) cartService.addToCart(product);
        return "redirect:/cart";
    }

    // Update quantity
    @PostMapping("/update/{id}")
    public String updateQuantity(@PathVariable Long id, @RequestParam("quantity") int quantity) {
        cartService.updateQuantity(id, quantity);
        return "redirect:/cart";
    }

    // Remove item
    @GetMapping("/remove/{id}")
    public String removeItem(@PathVariable Long id) {
        cartService.removeItem(id);
        return "redirect:/cart";
    }

    // Clear cart
    @GetMapping("/clear")
    public String clearCart() {
        cartService.clear();
        return "redirect:/cart";
    }

    // Any legacy /cart/checkout should go to unified /checkout page
    @GetMapping("/checkout")
    public String goCheckout() {
        return "redirect:/checkout";
    }
}
