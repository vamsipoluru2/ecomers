<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
  <title>Order Confirmation</title>
  <meta charset="UTF-8"/>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"/>
</head>
<body class="bg-light">
<div class="container py-4">
  <div class="alert alert-success">
    <h4 class="alert-heading">Thank you! Your order is confirmed.</h4>
    <p>Order ID: <strong>${order.id}</strong></p>
    <p>Total Amount: <strong>&#8377; ${order.totalAmount}</strong></p>
    <hr/>
    <a class="btn btn-success" href="${pageContext.request.contextPath}/orders/${order.id}/invoice.pdf">
      Download invoice (PDF)
    </a>
    <div class="alert alert-info mt-3 mb-0">
      A confirmation email/SMS has been sent (if contact details were provided).
    </div>
  </div>
  <a href="${pageContext.request.contextPath}/products" class="btn btn-outline-primary">Continue shopping</a>
</div>
</body>
</html>
