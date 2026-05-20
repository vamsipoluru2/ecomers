<!DOCTYPE html>
<html>
<head><title>Add Product</title></head>
<body>
<h2>Add New Product</h2>

<form action="/admin/products/save" method="post" enctype="multipart/form-data">
    <label>Name:</label><br>
    <input type="text" name="name" required><br><br>

    <label>Description:</label><br>
    <textarea name="description" required></textarea><br><br>

    <label>Price:</label><br>
    <input type="number" name="price" step="0.01" required><br><br>

    <label>Category:</label><br>
    <input type="text" name="category" required><br><br>

    <label>Image:</label><br>
    <input type="file" name="imageFile" accept="image/*" required><br><br>

    <input type="submit" value="Save">
</form>
</body>
</html>
