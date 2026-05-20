package com.ecommerce.service;

import com.ecommerce.model.CartItem;
import com.ecommerce.model.Product;
import com.ecommerce.model.User;
import com.ecommerce.repository.CartItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;
import javax.servlet.http.HttpSession;
import java.util.List;

@Service
@Transactional

public class CartService {

    @Autowired private CartItemRepository cartRepo;
    @Autowired private HttpSession session;

    private User currentUser() {
        Object u = session.getAttribute("loggedUser");
        if (u instanceof User) return (User) u;
        throw new IllegalStateException("No logged-in user in session");
    }

    // Get all cart items for the current user (same method name as before)
    public List<CartItem> getCart() { return cartRepo.findByUserId(currentUser().getId()); }
    public List<CartItem> getItems() { return getCart(); }

    
    @Transactional
    // Add product (upsert) – preserves existing signatures
    public void addProduct(Product product) { addProduct(product, 1); }

    @Transactional

    public void addProduct(Product product, int quantity) {
        User user = currentUser();
        cartRepo.findByUserIdAndProductId(user.getId(), product.getId())
                .ifPresentOrElse(
                        ci -> { ci.setQuantity(ci.getQuantity() + quantity); cartRepo.save(ci); },
                        () -> cartRepo.save(new CartItem(user, product, quantity))
                );
    }
    @Transactional

    // Remove product
    public void removeProduct(Long productId) {
        cartRepo.deleteByUserIdAndProductId(currentUser().getId(), productId);
    }
    @Transactional

    // Update quantity
    public void updateQuantity(Long productId, int quantity) {
        User user = currentUser();
        cartRepo.findByUserIdAndProductId(user.getId(), productId)
                .ifPresent(ci -> { ci.setQuantity(quantity); cartRepo.save(ci); });
    }
    @Transactional

    // Clear cart
    public void clear() { cartRepo.deleteByUserId(currentUser().getId()); }

    // Calculate total
    public double getTotal() {
        return getCart().stream().mapToDouble(CartItem::getTotalPrice).sum();
    }
    
 // --- add these inside CartService class ---

 // Keep old controller signature working
 public void addToCart(Product product) {
     addProduct(product);
 }

 public void addToCart(Product product, int quantity) {
     addProduct(product, quantity);
 }

 // Controller calls removeItem(id); delegate to DB method
 public void removeItem(Long productId) {
     removeProduct(productId);
 }

}
