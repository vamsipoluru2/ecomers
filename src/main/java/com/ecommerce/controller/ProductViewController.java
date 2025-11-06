/*
 * package com.ecommerce.controller;
 * 
 * import com.ecommerce.model.Product; import
 * com.ecommerce.service.ProductService; import
 * org.springframework.beans.factory.annotation.Autowired; import
 * org.springframework.stereotype.Controller; import
 * org.springframework.ui.Model; import
 * org.springframework.web.bind.annotation.GetMapping; import java.util.List;
 * 
 * @Controller public class ProductViewController {
 * 
 * @Autowired private ProductService productService;
 * 
 * // ✅ Show products for normal users
 * 
 * @GetMapping("/products") public String showProducts(Model model) {
 * List<Product> products = productService.getAllProducts();
 * model.addAttribute("products", products); return "products"; // → refers to
 * /WEB-INF/views/products.jsp } }
 */