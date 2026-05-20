<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<!DOCTYPE html>
<html>
<head>
    <title>🛍️ Products | E-Commerce</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"/>
    <style>
        body { background: #f8f9fa; font-family: 'Segoe UI', sans-serif; }
        .card { border-radius: 12px; transition: 0.3s; }
        .card:hover { transform: scale(1.03); box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
        .filter-bar { display: flex; justify-content: center; gap: 10px; margin-bottom: 30px; }
        .filter-bar input, .filter-bar select { width: 250px; }
        .card-title { font-size: 1.1rem; font-weight: 600; color: #0d6efd; }
        .product-desc { color: #6c757d; font-size: 0.9rem; min-height: 40px; }
        .price-tag { font-weight: 700; color: #212529; font-size: 1rem; }
    </style>
</head>
<body>

<div class="container mt-4">
    <h2 class="text-center mb-4 text-primary">🛒 Available Products</h2>

    <!-- ✅ Search + Filter -->
    <form action="${pageContext.request.contextPath}/products" method="get" class="filter-bar">
        <input type="text" name="keyword" class="form-control" placeholder="🔍 Search products..."
               value="${keyword}">
        <select name="category" class="form-select">
            <option value="">All Categories</option>
            <c:forEach var="cat" items="${categories}">
                <option value="${cat}" <c:if test="${cat == category}">selected</c:if>>${cat}</option>
            </c:forEach>
        </select>
        <button type="submit" class="btn btn-primary">Search</button>
    </form>

    <!-- ✅ Product Cards -->
    <div class="row justify-content-center">
        <c:if test="${empty products}">
            <div class="alert alert-warning text-center w-50">No products found!</div>
        </c:if>

        <c:forEach var="p" items="${products}">
            <div class="col-md-3 mb-4">
                <div class="card shadow-sm h-100">
                    <c:choose>
                        <c:when test="${not empty p.imageUrl}">
                            <img src="${pageContext.request.contextPath}${p.imageUrl}" class="card-img-top" height="200" style="object-fit: cover;">
                        </c:when>
                        <c:otherwise>
                            <img src="https://via.placeholder.com/200x200?text=No+Image" class="card-img-top" height="200">
                        </c:otherwise>
                    </c:choose>

                    <div class="card-body text-center">
                        <h5 class="card-title">${p.name}</h5>
                        <p class="text-muted mb-1">${p.category}</p>

                        <!-- ✅ Product Description -->
                        <p class="product-desc small" title="${p.description}">
                            <c:choose>
                                <c:when test="${fn:length(p.description) > 60}">
                                    ${fn:substring(p.description, 0, 60)}...
                                </c:when>
                                <c:otherwise>
                                    ${p.description}
                                </c:otherwise>
                            </c:choose>
                        </p>

                        <p class="price-tag">₹${p.price}</p>
                        <a href="${pageContext.request.contextPath}/cart/add/${p.id}" class="btn btn-success btn-sm">Add to Cart</a>
                    </div>
                </div>
            </div>
        </c:forEach>
    </div>

    <!-- ✅ Pagination -->
    <div class="text-center mt-4">
        <c:if test="${totalPages > 1}">
            <nav>
                <ul class="pagination justify-content-center">
                    <c:if test="${currentPage > 0}">
                        <li class="page-item">
                            <a class="page-link" href="${pageContext.request.contextPath}/products?page=${currentPage - 1}&keyword=${keyword}&category=${category}">Previous</a>
                        </li>
                    </c:if>

                    <c:forEach begin="0" end="${totalPages - 1}" var="i">
                        <li class="page-item <c:if test='${i == currentPage}'>active</c:if>'">
                            <a class="page-link" href="${pageContext.request.contextPath}/products?page=${i}&keyword=${keyword}&category=${category}">
                                ${i + 1}
                            </a>
                        </li>
                    </c:forEach>

                    <c:if test="${currentPage + 1 < totalPages}">
                        <li class="page-item">
                            <a class="page-link" href="${pageContext.request.contextPath}/products?page=${currentPage + 1}&keyword=${keyword}&category=${category}">Next</a>
                        </li>
                    </c:if>
                </ul>
            </nav>
        </c:if>
    </div>
</div>

</body>
</html>
 