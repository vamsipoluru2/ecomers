<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
    <title>User Home | QuickMart</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"/>
    <style>
        body {
            background: linear-gradient(135deg, #f8f9fa, #e3f2fd);
            font-family: 'Segoe UI', sans-serif;
        }
        .navbar {
            background-color: #fff;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .navbar-brand {
            font-weight: bold;
            color: #0d6efd !important;
            font-size: 1.5rem;
        }
        .welcome-card {
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 3px 12px rgba(0,0,0,0.08);
            padding: 40px;
            margin-top: 80px;
            text-align: center;
            transition: all 0.3s ease;
        }
        .welcome-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        }
        .welcome-card h2 {
            font-weight: 700;
            color: #0d6efd;
        }
        .welcome-card p {
            color: #555;
            font-size: 1.1rem;
        }
        .quick-actions {
            margin-top: 40px;
        }
        .quick-actions a {
            text-decoration: none;
        }
        .action-card {
            border-radius: 15px;
            background: white;
            text-align: center;
            padding: 30px;
            transition: all 0.3s ease;
            box-shadow: 0 3px 8px rgba(0,0,0,0.1);
        }
        .action-card:hover {
            transform: translateY(-5px);
            background: #f8faff;
        }
        .action-icon {
            font-size: 2.5rem;
            margin-bottom: 10px;
            color: #0d6efd;
        }
        footer {
            margin-top: 80px;
            padding: 20px;
            text-align: center;
            color: #777;
            background: #f8f9fa;
            border-top: 1px solid #ddd;
        }
    </style>
</head>

<body>

<!-- Navbar -->
<nav class="navbar navbar-expand-lg navbar-light fixed-top">
  <div class="container">
    <a class="navbar-brand" href="${pageContext.request.contextPath}/user/home">QuickMart</a>
    <div class="ms-auto">
        <span class="me-3">👋 Logged in as <strong>${sessionScope.loggedUser.name}</strong></span>
        <a href="${pageContext.request.contextPath}/logout" class="btn btn-outline-danger btn-sm">Logout</a>
    </div>
  </div>
</nav>

<!-- Welcome Section -->
<div class="container">
    <div class="welcome-card">
        <h2>Welcome, ${sessionScope.loggedUser.name} 👋</h2>
        <p>Your one-stop destination for all shopping needs. Explore, order, and enjoy seamless shopping!</p>

        <div class="quick-actions row justify-content-center mt-5">
            <div class="col-md-3 mb-3">
                <a href="${pageContext.request.contextPath}/products">
                    <div class="action-card">
                        <div class="action-icon">🛍️</div>
                        <h5>Shop Products</h5>
                        <p>Browse all available items</p>
                    </div>
                </a>
            </div>
            <div class="col-md-3 mb-3">
                <a href="${pageContext.request.contextPath}/cart">
                    <div class="action-card">
                        <div class="action-icon">🛒</div>
                        <h5>My Cart</h5>
                        <p>View and manage your cart</p>
                    </div>
                </a>
            </div>
            <div class="col-md-3 mb-3">
                <a href="${pageContext.request.contextPath}/orders">
                    <div class="action-card">
                        <div class="action-icon">📦</div>
                        <h5>My Orders</h5>
                        <p>Track your past orders</p>
                    </div>
                </a>
            </div>
        </div>
    </div>
</div>

<footer>
    <p>© 2025 QuickMart | Built with ❤️ using Spring Boot + JSP</p>
</footer>

</body>
</html>