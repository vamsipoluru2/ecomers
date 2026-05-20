<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8"/>
    <title>🛒 Your Cart</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"/>
</head>
<body class="bg-light">
<div class="container mt-5">
    <h2 class="text-center text-primary mb-4">🛍️ Your Shopping Cart</h2>

    <c:if test="${message != null}">
        <div class="alert alert-info text-center">${message}</div>
    </c:if>

    <c:if test="${empty cart}">
        <div class="alert alert-warning text-center">
            Cart is empty! <a href="${pageContext.request.contextPath}/products" class="alert-link">Shop Now</a>
        </div>
    </c:if>

    <c:if test="${not empty cart}">
        <table class="table table-bordered text-center align-middle bg-white shadow-sm">
            <thead class="table-dark">
            <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Action</th>
            </tr>
            </thead>
            <tbody>
            <c:forEach var="it" items="${cart}">
                <tr>
                    <td><img src="${pageContext.request.contextPath}${it.product.imageUrl}" width="70" alt="${it.product.name}"></td>
                    <td>${it.product.name}</td>
                    <td>&#8377;${it.product.price}</td>
                    <td>
                        <form action="${pageContext.request.contextPath}/cart/update/${it.product.id}" method="post" class="d-flex justify-content-center">
                            <input type="number" name="quantity" value="${it.quantity}" min="1" class="form-control w-50 text-center">
                            <button class="btn btn-sm btn-outline-primary ms-2">Update</button>
                        </form>
                    </td>
                    <td>&#8377;${it.totalPrice}</td>
                    <td><a href="${pageContext.request.contextPath}/cart/remove/${it.product.id}" class="btn btn-sm btn-danger">Remove</a></td>
                </tr>
            </c:forEach>
            </tbody>
        </table>

        <h4 class="text-end">Total: &#8377;${total}</h4>
        <div class="text-end">
            <a href="${pageContext.request.contextPath}/cart/clear" class="btn btn-outline-danger">Clear Cart</a>
            <!-- ✅ Proceed to unified checkout page -->
            <a href="${pageContext.request.contextPath}/checkout" class="btn btn-success">Checkout</a>
        </div>
    </c:if>
</div>
</body>
</html>
