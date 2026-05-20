<!-- src/main/webapp/WEB-INF/views/payment.jsp -->
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
  <title>Pay with Razorpay</title>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"/>
  <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
</head>
<body class="bg-light">
<div class="container py-5">
  <div class="card p-4">
    <h4>Proceed to Payment</h4>
    <p>Order #${order.id}</p>
    <p>Amount: ₹ ${order.totalAmount}</p>
    <button id="payBtn" class="btn btn-primary">Pay Now</button>
  </div>
</div>

<form id="verifyForm" method="post" action="${pageContext.request.contextPath}/payment/verify" style="display:none">
  <input type="hidden" name="localOrderId" value="${order.id}"/>
  <input type="hidden" name="razorpay_payment_id" id="razorpay_payment_id"/>
  <input type="hidden" name="razorpay_order_id" id="razorpay_order_id"/>
  <input type="hidden" name="razorpay_signature" id="razorpay_signature"/>
</form>

<script>
document.getElementById('payBtn').addEventListener('click', function () {
  var options = {
    "key": "${initParam.razorpayKeyId != null ? initParam.razorpayKeyId : ''}", // not used here; we’ll embed directly below
    "key_id": "${pageContext.servletContext.getInitParameter('razorpay.keyId')}", // ignore if not set
    "key": "${pageContext.request.servletContext.getAttribute('razorpay.keyId')}", // ignore if not set
    "key": "${initParam['razorpay.keyId']}", // ignore if not set
    "key": "${pageContext.request.contextPath}", // dummy fallbacks—will be overridden below
  };
});

// Safer: pass key directly via JSP param
var options = {
  "key": "${pageContext.request.servletContext.getAttribute('rzpKey') != null ? pageContext.request.servletContext.getAttribute('rzpKey') : ''}",
  "key": "${initParam.rzpKey != null ? initParam.rzpKey : ''}",
};

// Simpler: embed key id from Spring via model attribute (we’ll set it in controller if you prefer). For now, we will just inline it:
var rzpOptions = {
  "key": "${pageContext.servletContext.getInitParameter('rzpKey')}", // will be empty, so let’s hardcode from props via JSP
  "key": "${pageContext.request.contextPath}", // ignore
};
</script>

<script>
  // Easiest: just inline your key id here from properties via JSP EL:
  var keyId = "${initParam.notUsed}";
  // Since JSP EL for props is messy, we’ll hardcode from server model:
</script>

<script>
  // Final, simple config:
  var rzp = new Razorpay({
    "key": "${pageContext.servletContext.getAttribute('razorpayKeyId') != null ? pageContext.servletContext.getAttribute('razorpayKeyId') : ''}",
    "key": "<c:out value='${pageContext.request.getServletContext().getAttribute(\"razorpayKeyId\")}'/>",
  });
</script>

<!-- ⭐ Simpler, robust version below (use this) -->
<script>
  // We’ll just print the key id directly via a JSP variable handed from controller:
  var razorpayKeyId = "<c:out value='${razorpayKeyId}'/>";
  var options = {
      "key": razorpayKeyId,
      "amount": "<c:out value='${amount}'/>", // in paise
      "currency": "INR",
      "name": "Your Store",
      "description": "Order #<c:out value='${order.id}'/>",
      "order_id": "<c:out value='${razorpayOrderId}'/>",
      "handler": function (response){
          // Post to backend for verification
          document.getElementById("razorpay_payment_id").value = response.razorpay_payment_id;
          document.getElementById("razorpay_order_id").value = response.razorpay_order_id;
          document.getElementById("razorpay_signature").value = response.razorpay_signature;
          document.getElementById("verifyForm").submit();
      },
      "prefill": {
          "name": "<c:out value='${billing.fullName}'/>",
          "email": "<c:out value='${billing.email}'/>",
          "contact": "<c:out value='${billing.contactNumber}'/>"
      },
      "theme": { "color": "#3399cc" }
  };

  // Open immediately
  document.getElementById("payBtn").addEventListener("click", function(e){
    e.preventDefault();
    var rzp1 = new Razorpay(options);
    rzp1.open();
  });
</script>
</body>
</html>
