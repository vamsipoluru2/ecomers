<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
  <title>Checkout</title>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"/>
</head>
<body class="bg-light">
<div class="container py-4">
  <h2>Checkout</h2>
  <div class="row g-4">
    <div class="col-md-7">
      <form id="checkoutForm" method="post" action="${pageContext.request.contextPath}/checkout">
        <h5 class="mt-3">Billing address</h5>
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">Full name</label>
            <input name="fullName" class="form-control" required/>
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Email</label>
            <input type="email" name="email" class="form-control" required/>
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Contact</label>
            <input name="contactNumber" class="form-control" required/>
          </div>
          <div class="col-12 mb-3">
            <label class="form-label">Address line 1</label>
            <input name="addressLine1" class="form-control" required/>
          </div>
          <div class="col-12 mb-3">
            <label class="form-label">Address line 2</label>
            <input name="addressLine2" class="form-control"/>
          </div>
          <div class="col-md-4 mb-3">
            <label class="form-label">City</label>
            <input name="city" class="form-control" required/>
          </div>
          <div class="col-md-4 mb-3">
            <label class="form-label">State</label>
            <input name="state" class="form-control" required/>
          </div>
          <div class="col-md-4 mb-3">
            <label class="form-label">PIN</label>
            <input name="postalCode" class="form-control" required/>
          </div>
        </div>

        <h5 class="mt-4">Payment</h5>
        <div class="mb-3">
          <select name="method" class="form-select" required>
            <c:forEach items="${methods}" var="m">
              <option value="${m}">${m}</option>
            </c:forEach>
          </select>
        </div>

        <div id="upiFields" class="d-none">
          <label class="form-label">UPI ID</label>
          <input name="upiId" class="form-control" placeholder="name@bank"/>
        </div>

        <div id="cardFields" class="d-none">
          <div class="row">
            <div class="col-12 mb-3">
              <label class="form-label">Card holder</label>
              <input name="cardHolder" class="form-control"/>
            </div>
            <div class="col-12 mb-3">
              <label class="form-label">Card number</label>
              <input name="cardNumber" class="form-control"/>
            </div>
            <div class="col-6 mb-3">
              <label class="form-label">Expiry (MM/YY)</label>
              <input name="expiry" class="form-control"/>
            </div>
            <div class="col-6 mb-3">
              <label class="form-label">CVV</label>
              <input name="cvv" class="form-control"/>
            </div>
          </div>
        </div>

        <button class="btn btn-primary mt-2">Place order</button>
      </form>
    </div>

    <div class="col-md-5">
      <div class="card">
        <div class="card-header">Your cart</div>
        <ul class="list-group list-group-flush">
          <c:forEach items="${cartItems}" var="ci">
            <li class="list-group-item d-flex justify-content-between align-items-center">
              <span>${ci.product.name} × ${ci.quantity}</span>
              <span>&#8377; ${ci.product.price * ci.quantity}</span>
            </li>
          </c:forEach>
          <li class="list-group-item d-flex justify-content-between">
            <strong>Total</strong>
            <strong>&#8377; ${total}</strong>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>

<script>
const methodSelect = document.querySelector('select[name="method"]');
const upi = document.getElementById('upiFields');
const card = document.getElementById('cardFields');
function toggle() {
  const v = methodSelect.value;
  upi.classList.toggle('d-none', v !== 'UPI');
  card.classList.toggle('d-none', v !== 'CARD');
}
methodSelect.addEventListener('change', toggle);
toggle();
</script>
</body>
</html>
