<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
    <title>Add Product | Admin</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"/>
    <style>
        body {
            background: linear-gradient(to right, #eef2f3, #d9e4ec);
            font-family: 'Segoe UI', sans-serif;
        }
        .card {
            border-radius: 12px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        }
        .btn-success {
            font-weight: 600;
            letter-spacing: 0.5px;
        }
        h3 {
            color: #28a745;
            font-weight: bold;
        }
    </style>
</head>

<body>
<div class="container mt-5">
    <div class="card col-md-6 mx-auto p-4 shadow-lg">
        <h3 class="text-center mb-4">➕ Add New Product</h3>

        <!-- ✅ Form action correctly mapped -->
        <form action="${pageContext.request.contextPath}/admin/products/add"
              method="post"
              enctype="multipart/form-data">

            <!-- Product Name -->
            <div class="mb-3">
                <label class="form-label">Product Name</label>
                <input type="text" name="name" class="form-control" placeholder="Enter product name" required>
            </div>

            <!-- Description -->
            <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea name="description" class="form-control" rows="3"
                          placeholder="Enter short description" required></textarea>
            </div>

            <!-- Price -->
            <div class="mb-3">
                <label class="form-label">Price (₹)</label>
                <input type="number" step="0.01" name="price" class="form-control" placeholder="Enter price" required>
            </div>

            <!-- Category -->
            <div class="mb-3">
                <label class="form-label">Category</label>
                <input type="text" name="category" class="form-control" placeholder="e.g. Fruits, Electronics" required>
            </div>

            <!-- Image Upload -->
            <div class="mb-3">
                <label class="form-label">Upload Product Image</label>
                <input type="file" name="imageFile" class="form-control" accept="image/*">
            </div>

            <!-- Submit -->
            <button type="submit" class="btn btn-success w-100 mt-3">💾 Save Product</button>
        </form>

        <!-- Back Link -->
        <div class="text-center mt-3">
            <a href="${pageContext.request.contextPath}/admin/products" class="btn btn-outline-secondary btn-sm">
                ← Back to Product List
            </a>
        </div>
    </div>
</div>
</body>
</html>


