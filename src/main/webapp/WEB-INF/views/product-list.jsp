<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
    <title>Product Management</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"/>
</head>
<body class="container mt-4">
<h2>Product List</h2>
<a href="/admin/products/add" class="btn btn-success mb-3">+ Add Product</a>

<table class="table table-bordered">
    <thead class="table-dark">
    <tr>
        <th>ID</th><th>Name</th><th>Description</th>
        <th>Price</th><th>Category</th><th>Image</th><th>Actions</th>
    </tr>
    </thead>
    <tbody>
    <c:forEach var="p" items="${products}">
        <tr>
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>${p.description}</td>
            <td>${p.price}</td>
            <td>${p.category}</td>
            <td><img src="${p.imageUrl}" width="80" height="80" alt="No Image"/></td>
            <td>
                <a href="/admin/products/edit/${p.id}" class="btn btn-primary btn-sm">Edit</a>
                <a href="/admin/products/delete/${p.id}" class="btn btn-danger btn-sm">Delete</a>
            </td>
        </tr>
    </c:forEach>
    </tbody>
</table>
</body>
</html>


