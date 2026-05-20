<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<html>
<head>
    <title>All Orders</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"/>
</head>
<body class="bg-light">
<div class="container mt-5">
    <h2 class="text-center mb-4">📦 All Orders</h2>
    <table class="table table-bordered text-center bg-white">
        <thead class="table-dark">
        <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Total</th>
            <th>Action</th>
        </tr>
        </thead>
        <tbody>
        <c:forEach var="order" items="${orders}">
            <tr>
                <td>${order.id}</td>
                <td>${order.orderDate}</td>
                <td>₹${order.totalAmount}</td>
                <td>
                    <a href="${pageContext.request.contextPath}/orders/${order.id}" class="btn btn-sm btn-info">View</a>
                    <a href="${pageContext.request.contextPath}/orders/delete/${order.id}" class="btn btn-sm btn-danger">Delete</a>
                </td>
            </tr>
        </c:forEach>
        </tbody>
    </table>
</div>
</body>
</html>

