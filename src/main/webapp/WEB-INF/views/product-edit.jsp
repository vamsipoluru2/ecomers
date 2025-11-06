<!DOCTYPE html>
<html>
<head><title>Edit Product</title></head>
<body>
<h2>Edit Product</h2>

<form action="/admin/products/update" method="post" enctype="multipart/form-data">
    <input type="hidden" name="id" value="${product.id}">
    
    <label>Name:</label><br>
    <input type="text" name="name" value="${product.name}" required><br><br>

    <label>Description:</label><br>
    <textarea name="description" required>${product.description}</textarea><br><br>

    <label>Price:</label><br>
    <input type="number" name="price" step="0.01" value="${product.price}" required><br><br>

    <label>Category:</label><br>
    <input type="text" name="category" value="${product.category}" required><br><br>

    <label>Current Image:</label><br>
    <img src="${product.imageUrl}" width="100"><br><br>

    <label>Upload New Image (optional):</label><br>
    <input type="file" name="imageFile" accept="image/*"><br><br>

    <input type="submit" value="Update">
</form>
</body>
</html>
