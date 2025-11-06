package com.ecommerce.service;

import com.ecommerce.model.Product;
import com.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    private static final String UPLOAD_DIR = "src/main/resources/static/images/";

    // ✅ Pagination + Search + Category Filter
    public Page<Product> getPagedProducts(int page, int size, String keyword, String category) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());

        if (keyword != null && !keyword.isEmpty()) {
            return productRepository.searchProducts(keyword, pageable);
        } else if (category != null && !category.isEmpty()) {
            return productRepository.findByCategoryIgnoreCase(category, pageable);
        } else {
            return productRepository.findAll(pageable);
        }
    }

    // ✅ For Admin - List all products (no pagination)
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // ✅ Add new product with image upload
    public void add(Product product, MultipartFile file) throws IOException {
        String fileName = saveImageFile(file);
        if (fileName != null) {
            product.setImageUrl("/images/" + fileName);
        }
        productRepository.save(product);
    }

    // ✅ Update existing product (image optional)
    public void update(Long id, Product updatedProduct, MultipartFile file) throws IOException {
        Product existingProduct = productRepository.findById(id).orElse(null);
        if (existingProduct == null) return;

        existingProduct.setName(updatedProduct.getName());
        existingProduct.setCategory(updatedProduct.getCategory());
        existingProduct.setDescription(updatedProduct.getDescription());
        existingProduct.setPrice(updatedProduct.getPrice());

        if (file != null && !file.isEmpty()) {
            String fileName = saveImageFile(file);
            existingProduct.setImageUrl("/images/" + fileName);
        }

        productRepository.save(existingProduct);
    }

    // ✅ Delete product by ID
    public void delete(Long id) {
        productRepository.deleteById(id);
    }

    // ✅ Get product by ID
    public Product getById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    // ✅ Get all categories (unique list)
    public List<String> getAllCategories() {
        return productRepository.findAll().stream()
                .map(Product::getCategory)
                .distinct()
                .collect(Collectors.toList());
    }

    // ✅ Save uploaded image to static folder
    private String saveImageFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) return null;

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(UPLOAD_DIR + fileName);
        Files.createDirectories(filePath.getParent());
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return fileName;
    }
}
