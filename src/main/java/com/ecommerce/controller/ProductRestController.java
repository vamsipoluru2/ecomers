// src/main/java/com/ecommerce/controller/ProductRestController.java
package com.ecommerce.controller;

import com.ecommerce.api.ApiResponse;
import com.ecommerce.model.Product;
import com.ecommerce.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/product")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class ProductRestController {

    @Autowired
    private ProductService productService;

    // ✅ Display all products with pagination, search, and filter
    @GetMapping
    public ResponseEntity<?> getProducts(@RequestParam(defaultValue = "0") int page,
                                         @RequestParam(defaultValue = "6") int size,
                                         @RequestParam(required = false) String keyword,
                                         @RequestParam(required = false) String category) {
        try {
            Page<Product> products = productService.getPagedProducts(page, size, keyword, category);

            Map<String, Object> data = new LinkedHashMap<>();
            data.put("products", products.getContent());
            data.put("currentPage", products.getNumber());
            data.put("pageSize", products.getSize());
            data.put("totalPages", products.getTotalPages());
            data.put("totalItems", products.getTotalElements());
            data.put("keyword", keyword);   // can be null safely
            data.put("category", category); // can be null safely
            data.put("categories", productService.getAllCategories());

            return ResponseEntity.ok(ApiResponse.ok(data));
        } catch (Exception e) {
            e.printStackTrace(); // shows the real error if something else breaks
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.fail("Error fetching products: " + e.getClass().getSimpleName()));
        }
    }


    // ✅ Single product view
    @GetMapping("/{id}")
    public ResponseEntity<?> getProduct(@PathVariable Long id) {
        Product product = productService.getById(id);
        if (product == null) {
            return ResponseEntity.badRequest().body(ApiResponse.fail("Product not found!"));
        }
        return ResponseEntity.ok(ApiResponse.ok(Map.of("product", product)));
    }
}
