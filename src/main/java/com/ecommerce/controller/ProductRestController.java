package com.ecommerce.controller;

import com.ecommerce.model.Product;
import com.ecommerce.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    // ✅ Display all products with pagination, search, and filter
    @GetMapping
    public String showProducts(@RequestParam(defaultValue = "0") int page,
                               @RequestParam(defaultValue = "6") int size,
                               @RequestParam(required = false) String keyword,
                               @RequestParam(required = false) String category,
                               Model model) {

        Page<Product> products = productService.getPagedProducts(page, size, keyword, category);

        model.addAttribute("products", products.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", products.getTotalPages());
        model.addAttribute("keyword", keyword);
        model.addAttribute("category", category);
        model.addAttribute("categories", productService.getAllCategories());

        return "products"; // JSP view name
    }

    // ✅ Single product view (optional)
    @GetMapping("/{id}")
    public String viewProduct(@PathVariable Long id, Model model) {
        Product product = productService.getById(id);
        if (product == null) {
            model.addAttribute("error", "Product not found!");
            return "error";
        }
        model.addAttribute("product", product);
        return "product_details";
    }
}

