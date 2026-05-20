// src/main/java/com/ecommerce/controller/CartRestController.java
package com.ecommerce.controller;

import com.ecommerce.api.ApiResponse;
import com.ecommerce.model.Product;
import com.ecommerce.service.CartService;
import com.ecommerce.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class CartRestController {

    @Autowired private CartService cartService;
    @Autowired private ProductService productService;

    // ✅ Show cart (was: return "cart" view)
    @GetMapping
    public ResponseEntity<?> viewCart() {
        return ResponseEntity.ok(ApiResponse.ok(Map.of(
                "cart", cartService.getCart(),
                "total", cartService.getTotal()
        )));
    }

    // ✅ Add to Cart (was: GET /cart/add/{id} → redirect:/cart)
    // Kept the same call chain: productService.getById → cartService.addToCart(product)
    @PostMapping("/add/{id}")
    public ResponseEntity<?> addToCart(@PathVariable Long id) {
        Product product = productService.getById(id);
        if (product != null) {
            cartService.addToCart(product);
            return ResponseEntity.ok(ApiResponse.ok(Map.of(
                    "message", "Item added",
                    "cart", cartService.getCart(),
                    "total", cartService.getTotal()
            )));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.fail("Product not found"));
        }
    }

    // ✅ Update quantity (was: POST /cart/update/{id} with form param quantity)
    @PostMapping("/update/{id}")
    public ResponseEntity<?> updateQuantity(@PathVariable Long id,
                                            @RequestParam("quantity") int quantity) {
        cartService.updateQuantity(id, quantity);
        return ResponseEntity.ok(ApiResponse.ok(Map.of(
                "message", "Quantity updated",
                "cart", cartService.getCart(),
                "total", cartService.getTotal()
        )));
    }

    // ✅ Remove item (was: GET /cart/remove/{id} → redirect:/cart)
    @DeleteMapping("/remove/{id}")
    public ResponseEntity<?> removeItem(@PathVariable Long id) {
        cartService.removeItem(id);
        return ResponseEntity.ok(ApiResponse.ok(Map.of(
                "message", "Item removed",
                "cart", cartService.getCart(),
                "total", cartService.getTotal()
        )));
    }

    // ✅ Clear cart (was: GET /cart/clear → redirect:/cart)
    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart() {
        cartService.clear();
        return ResponseEntity.ok(ApiResponse.ok(Map.of(
                "message", "Cart cleared",
                "cart", cartService.getCart(),
                "total", cartService.getTotal()
        )));
    }

    // ✅ Legacy /cart/checkout → return a hint for Angular to navigate
    @GetMapping("/checkout")
    public ResponseEntity<?> goCheckout() {
        // In JSP you redirected to /checkout; here we just tell Angular where to go.
        return ResponseEntity.ok(ApiResponse.ok(Map.of(
                "redirect", "/checkout"
        )));
    }
}
