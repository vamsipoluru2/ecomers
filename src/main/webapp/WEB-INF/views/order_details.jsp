<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<html>
<head>
    <title>Order Details</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"/>
</head>
<body class="bg-light">
<div class="container mt-5">
    <h2 class="text-center mb-4">📦 Order Details</h2>
    <div class="card shadow p-4 bg-white">
        <p><strong>Order ID:</strong> ${order.id}</p>
        <p><strong>Date:</strong> ${order.orderDate}</p>
        <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>

        <h4 class="mt-4">Items:</h4>
        <table class="table table-bordered text-center">
            <thead class="table-dark">
            <tr>
                <th>Product</th><th>Quantity</th><th>Price</th><th>Total</th>
            </tr>
            </thead>
            <tbody>
            <c:forEach var="item" items="${order.items}">
                <tr>
                    <td>${item.product.name}</td>
                    <td>${item.quantity}</td>
                    <td>₹${item.product.price}</td>
                    <td>₹${item.totalPrice}</td>
                </tr>
            </c:forEach>
            </tbody>
        </table>
    </div>

    <div class="text-center mt-3">
        <a href="${pageContext.request.contextPath}/orders" class="btn btn-secondary">Back to Orders</a>
    </div>
</div>
</body>
</html>
