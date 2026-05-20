package com.ecommerce.controller;

import com.ecommerce.api.ApiResponse;
import com.ecommerce.model.Product;
import com.ecommerce.model.User;
import com.ecommerce.service.ProductService;
import com.ecommerce.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class AdminRestController {

    @Autowired
    private ProductService productService;

    // --- helpers -------------------------------------------------------------

    private User requireAdmin(HttpSession session) {
        User u = (User) session.getAttribute("loggedUser");
        if (u == null) {
            throw new org.springframework.web.server.ResponseStatusException(HttpStatus.UNAUTHORIZED, "Login required");
        }
        if (!"ADMIN".equalsIgnoreCase(u.getRole())) {
            throw new org.springframework.web.server.ResponseStatusException(HttpStatus.FORBIDDEN, "Admin only");
        }
        return u;
    }

    // ✅ 1. Admin Dashboard (was JSP) → simple JSON "ok"
    @GetMapping("/dashboard")
    public ResponseEntity<?> showDashboard(HttpSession session) {
        requireAdmin(session);
        return ResponseEntity.ok(ApiResponse.ok(Map.of("message", "admin_dashboard")));
    }

    // ✅ 2. Manage Products (Paginated + Search) - FIXED NULL POINTER
    @GetMapping("/product")
    public ResponseEntity<?> listProducts(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false) String keyword,
            HttpSession session) {
        try {
            requireAdmin(session);

            Page<Product> productPage = productService.getPagedProducts(page, size, keyword, null);

            // ✅ FIX: Use HashMap instead of Map.of() to handle null values safely
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("products",
                    productPage.getContent() != null ? productPage.getContent() : java.util.Collections.emptyList());
            responseData.put("currentPage", page);
            responseData.put("totalPages", productPage.getTotalPages());
            responseData.put("totalElements", productPage.getTotalElements());
            responseData.put("keyword", keyword != null ? keyword : "");

            return ResponseEntity.ok(ApiResponse.ok(responseData));
        } catch (Exception e) {
            e.printStackTrace();
            // Return empty response on error
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("products", java.util.Collections.emptyList());
            errorResponse.put("currentPage", page);
            errorResponse.put("totalPages", 0);
            errorResponse.put("totalElements", 0);
            errorResponse.put("keyword", keyword != null ? keyword : "");
            return ResponseEntity.ok(ApiResponse.ok(errorResponse));
        }
    }

    // ✅ 3. Show Add Product Form (was JSP) → not needed; return template hint
    @GetMapping("/product/add/form")
    public ResponseEntity<?> showAddForm(HttpSession session) {
        requireAdmin(session);
        return ResponseEntity.ok(ApiResponse.ok(Map.of(
                "productTemplate", new Product() // empty template object
        )));
    }

    // ✅ 4. Handle Add Product (Multipart for Angular FormData)
    @PostMapping(value = "/product", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addProduct(@RequestPart("product") Product product,
            @RequestPart(value = "imageFile", required = false) MultipartFile file,
            HttpSession session) throws IOException {
        requireAdmin(session);

        productService.add(product, file);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(Map.of("message", "Product created")));
    }

    // ✅ 5. Show Edit Product (was JSP) → return product JSON
    @GetMapping("/product/{id}")
    public ResponseEntity<?> showEditForm(@PathVariable Long id, HttpSession session) {
        requireAdmin(session);
        Product p = productService.getById(id);
        if (p == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.fail("Product not found"));
        }
        return ResponseEntity.ok(ApiResponse.ok(Map.of("product", p)));
    }

    // ✅ 6. Update Product (Multipart for Angular FormData)
    @PutMapping(value = "/product/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateProduct(@PathVariable Long id,
            @RequestPart("product") Product product,
            @RequestPart(value = "imageFile", required = false) MultipartFile file,
            HttpSession session) throws IOException {
        requireAdmin(session);

        productService.update(id, product, file);
        return ResponseEntity.ok(ApiResponse.ok(Map.of("message", "Product updated")));
    }

    @Autowired
    private StatisticsService statisticsService;

    // ✅ 7. Get real-time statistics
    @GetMapping("/statistics")
    public ResponseEntity<?> viewStatistics(HttpSession session) {
        requireAdmin(session);
        Map<String, Object> stats = statisticsService.getStatistics();
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }

    // ✅ 8. Delete Product
    @DeleteMapping("/product/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id, HttpSession session) {
        requireAdmin(session);
        productService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(Map.of("message", "Product deleted")));
    }

    // ✅ TEST ENDPOINT - Simple products list without complex logic
    @GetMapping("/product/test")
    public ResponseEntity<?> testProducts(HttpSession session) {
        try {
            requireAdmin(session);

            // Simple test - get first page of products
            Page<Product> productPage = productService.getPagedProducts(0, 10, null, null);

            Map<String, Object> responseData = new HashMap<>();
            responseData.put("products", productPage.getContent());
            responseData.put("currentPage", 0);
            responseData.put("totalPages", productPage.getTotalPages());
            responseData.put("totalElements", productPage.getTotalElements());
            responseData.put("message", "Test successful - found " + productPage.getContent().size() + " products");

            return ResponseEntity.ok(ApiResponse.ok(responseData));
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Test failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.fail(errorResponse));
        }
    }
}