package com.ecommerce.controller;

import com.ecommerce.model.Product;
import com.ecommerce.model.User;
import com.ecommerce.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpSession;
import java.io.IOException;

@Controller
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private ProductService productService;

    // ✅ 1. Admin Dashboard (Session Protected)
    @GetMapping("/dashboard")
    public String showDashboard(HttpSession session) {
        User loggedUser = (User) session.getAttribute("loggedUser");

        if (loggedUser == null || !"ADMIN".equalsIgnoreCase(loggedUser.getRole())) {
            // if not logged in or not an admin → redirect to login
            return "redirect:/login";
        }

        return "admin_dashboard";
    }

    // ✅ 2. Manage Products (Paginated Product List + Search)
    @GetMapping("/products")
    public String listProducts(@RequestParam(defaultValue = "0") int page,
                               @RequestParam(defaultValue = "5") int size,
                               @RequestParam(required = false) String keyword,
                               Model model,
                               HttpSession session) {

        User loggedUser = (User) session.getAttribute("loggedUser");
        if (loggedUser == null || !"ADMIN".equalsIgnoreCase(loggedUser.getRole())) {
            return "redirect:/login";
        }

        Page<Product> productPage = productService.getPagedProducts(page, size, keyword, null);

        model.addAttribute("products", productPage.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", productPage.getTotalPages());
        model.addAttribute("keyword", keyword);

        return "admin_products";
    }

    // ✅ 3. Show Add Product Form
    @GetMapping("/products/add")
    public String showAddForm(Model model, HttpSession session) {
        User loggedUser = (User) session.getAttribute("loggedUser");
        if (loggedUser == null || !"ADMIN".equalsIgnoreCase(loggedUser.getRole())) {
            return "redirect:/login";
        }

        model.addAttribute("product", new Product());
        return "add_product";
    }

    // ✅ 4. Handle Add Product Form Submission
    @PostMapping("/products/add")
    public String addProduct(@ModelAttribute Product product,
                             @RequestParam("imageFile") MultipartFile file,
                             HttpSession session) throws IOException {

        User loggedUser = (User) session.getAttribute("loggedUser");
        if (loggedUser == null || !"ADMIN".equalsIgnoreCase(loggedUser.getRole())) {
            return "redirect:/login";
        }

        productService.add(product, file);
        return "redirect:/admin/products";
    }

    // ✅ 5. Show Edit Product Form
    @GetMapping("/products/edit/{id}")
    public String showEditForm(@PathVariable Long id, Model model, HttpSession session) {
        User loggedUser = (User) session.getAttribute("loggedUser");
        if (loggedUser == null || !"ADMIN".equalsIgnoreCase(loggedUser.getRole())) {
            return "redirect:/login";
        }

        model.addAttribute("product", productService.getById(id));
        return "edit_product";
    }

    // ✅ 6. Handle Update Product Form
    @PostMapping("/products/update/{id}")
    public String updateProduct(@PathVariable Long id,
                                @ModelAttribute Product product,
                                @RequestParam(value = "imageFile", required = false) MultipartFile file,
                                HttpSession session) throws IOException {

        User loggedUser = (User) session.getAttribute("loggedUser");
        if (loggedUser == null || !"ADMIN".equalsIgnoreCase(loggedUser.getRole())) {
            return "redirect:/login";
        }

        productService.update(id, product, file);
        return "redirect:/admin/products";
    }

    // ✅ 7. Dummy Statistics Page
    @GetMapping("/statistics")
    public String viewStatistics(HttpSession session) {
        User loggedUser = (User) session.getAttribute("loggedUser");
        if (loggedUser == null || !"ADMIN".equalsIgnoreCase(loggedUser.getRole())) {
            return "redirect:/login";
        }

        return "admin_statistics";
    }

    // ✅ 8. Delete Product
    @GetMapping("/products/delete/{id}")
    public String deleteProduct(@PathVariable Long id, HttpSession session) {
        User loggedUser = (User) session.getAttribute("loggedUser");
        if (loggedUser == null || !"ADMIN".equalsIgnoreCase(loggedUser.getRole())) {
            return "redirect:/login";
        }

        productService.delete(id);
        return "redirect:/admin/products";
    }
}