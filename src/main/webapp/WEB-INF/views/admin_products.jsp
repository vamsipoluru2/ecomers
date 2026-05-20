<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
    <title>Admin - Product Management</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"/>
    <style>
        body { background: #f8f9fa; font-family: 'Segoe UI', sans-serif; }
        .table img { width: 60px; height: 60px; object-fit: cover; border-radius: 6px; }
        .pagination { justify-content: center; }
    </style>
</head>
<body>

<div class="container mt-4">
    <h2 class="text-center text-primary mb-3">🛠️ Manage Products</h2>

    <!-- ✅ Search Bar -->
    <form action="${pageContext.request.contextPath}/admin/products" method="get" class="d-flex mb-3 justify-content-center">
        <input type="text" name="keyword" class="form-control w-25" placeholder="🔍 Search products..." value="${keyword}">
        <button type="submit" class="btn btn-primary ms-2">Search</button>
        <a href="${pageContext.request.contextPath}/admin/products/add" class="btn btn-success ms-3">➕ Add New Product</a>
    </form>

    <!-- ✅ Product Table -->
    <table class="table table-striped table-bordered text-center align-middle shadow-sm">
        <thead class="table-dark">
        <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price (₹)</th>
            <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <c:if test="${empty products}">
            <tr>
                <td colspan="6" class="text-center text-danger fw-bold">No products found!</td>
            </tr>
        </c:if>
        <c:forEach var="p" items="${products}">
            <tr>
                <td>${p.id}</td>
                <td>
                    <c:choose>
                        <c:when test="${not empty p.imageUrl}">
                            <img src="${pageContext.request.contextPath}${p.imageUrl}" alt="${p.name}">
                        </c:when>
                        <c:otherwise>
                            <img src="https://via.placeholder.com/60x60?text=No+Image" alt="No image">
                        </c:otherwise>
                    </c:choose>
                </td>
                <td>${p.name}</td>
                <td>${p.category}</td>
                <td>${p.price}</td>
                <td>
                    <a href="${pageContext.request.contextPath}/admin/products/edit/${p.id}" class="btn btn-sm btn-warning">Edit</a>
                    <a href="${pageContext.request.contextPath}/admin/products/delete/${p.id}" class="btn btn-sm btn-danger"
                       onclick="return confirm('Are you sure you want to delete this product?');">Delete</a>
                </td>
            </tr>
        </c:forEach>
        </tbody>
    </table>

    <!-- ✅ Pagination -->
    <div class="mt-4">
        <c:if test="${totalPages > 1}">
            <nav>
                <ul class="pagination">
                    <c:if test="${currentPage > 0}">
                        <li class="page-item">
                            <a class="page-link" href="${pageContext.request.contextPath}/admin/products?page=${currentPage - 1}&keyword=${keyword}">Previous</a>
                        </li>
                    </c:if>

                    <c:forEach begin="0" end="${totalPages - 1}" var="i">
                        <li class="page-item <c:if test='${i == currentPage}'>active</c:if>'">
                            <a class="page-link"
                               href="${pageContext.request.contextPath}/admin/products?page=${i}&keyword=${keyword}">
                                ${i + 1}
                            </a>
                        </li>
                    </c:forEach>

                    <c:if test="${currentPage + 1 < totalPages}">
                        <li class="page-item">
                            <a class="page-link" href="${pageContext.request.contextPath}/admin/products?page=${currentPage + 1}&keyword=${keyword}">Next</a>
                        </li>
                    </c:if>
                </ul>
            </nav>
        </c:if>
    </div>
</div>

</body>
</html>

