<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
    <title>Edit Product</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"/>
</head>
<body class="container mt-4">
<h2 class="text-center text-warning mb-3">✏️ Edit Product</h2>

<form action="/admin/products/update/${product.id}" method="post" enctype="multipart/form-data" class="col-md-6 mx-auto card p-4 shadow">
    <label>Name</label>
    <input type="text" name="name" value="${product.name}" class="form-control mb-2">

    <label>Description</label>
    <textarea name="description" class="form-control mb-2">${product.description}</textarea>

    <label>Price</label>
    <input type="number" step="0.01" name="price" value="${product.price}" class="form-control mb-2">

    <label>Category</label>
    <input type="text" name="category" value="${product.category}" class="form-control mb-2">

    <label>Current Image</label><br>
    <img src="${product.imageUrl}" width="100" class="mb-3"><br>

    <label>Replace Image</label>
    <input type="file" name="imageFile" class="form-control mb-3" accept="image/*">

    <button class="btn btn-warning w-100">Update Product</button>
</form>
</body>
</html>



